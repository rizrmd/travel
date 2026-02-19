/**
 * Integration 4: Virtual Account Payment Gateway
 * Service: Virtual Account Management
 *
 * Handles:
 * - Creating virtual accounts for jamaah
 * - Managing VA lifecycle (active, expired, used, closed)
 * - Querying VA by jamaah or VA number
 */

import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VirtualAccountEntity } from "../infrastructure/persistence/relational/entities/virtual-account.entity";
import { JamaahEntity } from "../../jamaah/infrastructure/persistence/relational/entities/jamaah.entity";
import { MidtransService } from "./midtrans.service";
import { BankCode } from "../domain/bank-code.enum";
import { VAStatus, canReceivePayment } from "../domain/va-status.enum";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class VirtualAccountService {
  private readonly logger = new Logger(VirtualAccountService.name);

  constructor(
    @InjectRepository(VirtualAccountEntity)
    private readonly vaRepository: Repository<VirtualAccountEntity>,
    @InjectRepository(JamaahEntity)
    private readonly jamaahRepository: Repository<JamaahEntity>,
    private readonly midtransService: MidtransService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Create virtual account for a jamaah
   */
  async createVirtualAccount(
    jamaahId: string,
    bankCode: BankCode,
    amount?: number,
    tenantId?: string,
  ): Promise<VirtualAccountEntity> {
    // Fetch jamaah with package details
    const jamaah = await this.jamaahRepository.findOne({
      where: { id: jamaahId },
      relations: ["package"],
    });

    if (!jamaah) {
      throw new NotFoundException(`Jamaah not found: ${jamaahId}`);
    }

    // Use provided tenantId or get from jamaah
    const effectiveTenantId = tenantId || jamaah.tenant_id;

    // Check if active VA already exists for this jamaah + bank
    const existingVa = await this.vaRepository.findOne({
      where: {
        jamaah_id: jamaahId,
        bank_code: bankCode,
        status: VAStatus.ACTIVE,
      },
    });

    if (existingVa) {
      this.logger.warn(
        `Active VA already exists for jamaah ${jamaahId}, bank ${bankCode}`,
      );
      throw new ConflictException(
        `Active virtual account already exists for this bank. VA Number: ${existingVa.va_number}`,
      );
    }

    // Determine amount (explicit > package retail price > 0)
    const vaAmount =
      amount ||
      (jamaah.package
        ? parseFloat(jamaah.package.retail_price?.toString() || "0")
        : 0);

    if (vaAmount <= 0) {
      throw new BadRequestException(
        "Amount must be positive. Either provide amount or ensure jamaah has a package with valid price.",
      );
    }

    // Generate unique order ID
    const orderId = this.generateOrderId(jamaahId);

    try {
      // Create VA via Midtrans
      this.logger.debug(
        `Creating VA for jamaah ${jamaahId}, bank ${bankCode}, amount ${vaAmount}`,
      );

      const midtransResponse = await this.midtransService.createVirtualAccount({
        orderId,
        amount: vaAmount,
        bankCode,
        customerName: jamaah.full_name,
        customerEmail: jamaah.email || undefined,
      });

      // Extract VA number from response
      const vaNumber =
        midtransResponse.va_numbers?.[0]?.va_number ||
        midtransResponse.permata_va_number ||
        "";

      if (!vaNumber) {
        throw new Error("No VA number returned from Midtrans");
      }

      // Calculate expiry (default 24 hours)
      const expiryHours = parseInt(
        this.configService.get<string>("VA_EXPIRY_HOURS", "24"),
        10,
      );
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);

      // Save to database
      const virtualAccount = this.vaRepository.create({
        tenant_id: effectiveTenantId,
        jamaah_id: jamaahId,
        va_number: vaNumber,
        bank_code: bankCode,
        amount: vaAmount,
        status: VAStatus.ACTIVE,
        expires_at: expiresAt,
      });

      const saved = await this.vaRepository.save(virtualAccount);

      this.logger.log(
        `VA created successfully: ${saved.va_number} for jamaah ${jamaahId}`,
      );

      return saved;
    } catch (error) {
      this.logger.error(
        `Failed to create VA for jamaah ${jamaahId}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Find all virtual accounts for a jamaah
   */
  async findByJamaahId(jamaahId: string): Promise<VirtualAccountEntity[]> {
    return await this.vaRepository.find({
      where: { jamaah_id: jamaahId },
      order: { created_at: "DESC" },
    });
  }

  /**
   * Find active virtual accounts for a jamaah
   */
  async findActiveByJamaahId(
    jamaahId: string,
  ): Promise<VirtualAccountEntity[]> {
    return await this.vaRepository.find({
      where: {
        jamaah_id: jamaahId,
        status: VAStatus.ACTIVE,
      },
      order: { created_at: "DESC" },
    });
  }

  /**
   * Find virtual account by VA number
   */
  async findByVaNumber(vaNumber: string): Promise<VirtualAccountEntity | null> {
    return await this.vaRepository.findOne({
      where: { va_number: vaNumber },
      relations: ["jamaah", "jamaah.package"],
    });
  }

  /**
   * Find virtual account by ID
   */
  async findById(id: string): Promise<VirtualAccountEntity | null> {
    return await this.vaRepository.findOne({
      where: { id },
      relations: ["jamaah"],
    });
  }

  /**
   * Mark VA as used (when payment received)
   */
  async markAsUsed(id: string): Promise<void> {
    const va = await this.findById(id);

    if (!va) {
      throw new NotFoundException(`Virtual account not found: ${id}`);
    }

    if (!canReceivePayment(va.status)) {
      this.logger.warn(
        `Attempted to mark non-active VA as used: ${id}, status: ${va.status}`,
      );
      throw new BadRequestException(
        `Cannot mark VA as used. Current status: ${va.status}`,
      );
    }

    await this.vaRepository.update(id, {
      status: VAStatus.USED,
    });

    this.logger.log(`VA marked as used: ${va.va_number}`);
  }

  /**
   * Expire virtual account
   */
  async expireVirtualAccount(id: string): Promise<void> {
    const va = await this.findById(id);

    if (!va) {
      throw new NotFoundException(`Virtual account not found: ${id}`);
    }

    if (va.status !== VAStatus.ACTIVE) {
      this.logger.warn(`Cannot expire VA with status: ${va.status}`);
      return;
    }

    await this.vaRepository.update(id, {
      status: VAStatus.EXPIRED,
    });

    this.logger.log(`VA expired: ${va.va_number}`);
  }

  /**
   * Close virtual account manually
   */
  async closeVirtualAccount(id: string): Promise<void> {
    const va = await this.findById(id);

    if (!va) {
      throw new NotFoundException(`Virtual account not found: ${id}`);
    }

    if (va.status === VAStatus.USED) {
      throw new BadRequestException("Cannot close a used virtual account");
    }

    // Try to cancel on Midtrans if active
    if (va.status === VAStatus.ACTIVE) {
      try {
        const orderId = this.extractOrderIdFromVa(va);
        if (orderId) {
          await this.midtransService.cancelTransaction(orderId);
        }
      } catch (error) {
        this.logger.error(`Failed to cancel VA on Midtrans: ${error.message}`);
        // Continue with local closure even if Midtrans fails
      }
    }

    await this.vaRepository.update(id, {
      status: VAStatus.CLOSED,
    });

    this.logger.log(`VA closed: ${va.va_number}`);
  }

  /**
   * Check and expire old VAs (called via scheduled job)
   */
  async expireOldVirtualAccounts(): Promise<number> {
    const now = new Date();

    const expiredVas = await this.vaRepository.find({
      where: {
        status: VAStatus.ACTIVE,
      },
    });

    let count = 0;

    for (const va of expiredVas) {
      if (va.expires_at && va.expires_at < now) {
        await this.expireVirtualAccount(va.id);
        count++;
      }
    }

    if (count > 0) {
      this.logger.log(`Expired ${count} virtual accounts`);
    }

    return count;
  }

  /**
   * Get statistics for tenant
   */
  async getStatistics(tenantId: string): Promise<{
    total: number;
    active: number;
    used: number;
    expired: number;
    closed: number;
  }> {
    const [total, active, used, expired, closed] = await Promise.all([
      this.vaRepository.count({ where: { tenant_id: tenantId } }),
      this.vaRepository.count({
        where: { tenant_id: tenantId, status: VAStatus.ACTIVE },
      }),
      this.vaRepository.count({
        where: { tenant_id: tenantId, status: VAStatus.USED },
      }),
      this.vaRepository.count({
        where: { tenant_id: tenantId, status: VAStatus.EXPIRED },
      }),
      this.vaRepository.count({
        where: { tenant_id: tenantId, status: VAStatus.CLOSED },
      }),
    ]);

    return { total, active, used, expired, closed };
  }

  /**
   * Generate unique order ID for Midtrans
   */
  private generateOrderId(jamaahId: string): string {
    const timestamp = Date.now();
    const jamaahPrefix = jamaahId.substring(0, 8);
    return `VA-${jamaahPrefix}-${timestamp}`;
  }

  /**
   * Extract order ID from VA (reverse engineering for cancellation)
   * This is a fallback - ideally we'd store the order_id
   */
  private extractOrderIdFromVa(va: VirtualAccountEntity): string | null {
    // If we stored order_id in metadata, use it
    // Otherwise, return null and let Midtrans cancellation fail gracefully
    return null;
  }
}
