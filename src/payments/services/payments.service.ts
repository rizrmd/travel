/**
 * Epic 7, Story 7.1: Payments Service
 * Handles payment creation, updates, and status management
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { PaymentEntity } from "../infrastructure/persistence/relational/entities/payment.entity";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import {
  UpdatePaymentDto,
  CancelPaymentDto,
  RefundPaymentDto,
} from "../dto/update-payment.dto";
import { PaymentResponseDto } from "../dto/payment-response.dto";
import { PaymentsListQueryDto } from "../dto/payments-list-query.dto";
import { Payment, PaymentStatus } from "../domain/payment";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  /**
   * Create a new payment record
   * Story 7.1: Manual payment entry
   */
  async create(
    dto: CreatePaymentDto,
    recordedById: string,
    tenantId: string,
  ): Promise<PaymentResponseDto> {
    // Validate payment amount
    if (!Payment.isValidAmount(dto.amount)) {
      throw new BadRequestException("Payment amount must be positive");
    }

    // Validate payment date
    const paymentDate = new Date(dto.paymentDate);
    if (!Payment.isValidPaymentDate(paymentDate)) {
      throw new BadRequestException("Payment date cannot be in the future");
    }

    // Validate reference number if provided
    if (
      dto.referenceNumber &&
      !Payment.isValidReferenceNumber(dto.referenceNumber)
    ) {
      throw new BadRequestException("Invalid reference number format");
    }

    // Create payment entity
    const payment = this.paymentRepository.create({
      tenant_id: tenantId,
      jamaah_id: dto.jamaahId,
      package_id: dto.packageId,
      amount: dto.amount,
      payment_method: dto.paymentMethod,
      payment_type: dto.paymentType,
      status: PaymentStatus.CONFIRMED, // Auto-confirm for manual entry
      reference_number: dto.referenceNumber || null,
      payment_date: paymentDate,
      notes: dto.notes || null,
      recorded_by_id: recordedById,
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // TODO: Trigger events:
    // 1. Update jamaah payment_status (partial/paid)
    // 2. Create commission record (Story 7.4)
    // 3. Send notification to jamaah
    // 4. Match to payment schedule if exists (Story 7.2)

    return this.mapToResponseDto(savedPayment);
  }

  /**
   * Find all payments with filtering and pagination
   */
  async findAll(
    query: PaymentsListQueryDto,
    tenantId: string,
  ): Promise<{
    data: PaymentResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      status,
      paymentMethod,
      paymentType,
      jamaahId,
      packageId,
      fromDate,
      toDate,
    } = query;

    const queryBuilder = this.paymentRepository
      .createQueryBuilder("payment")
      .where("payment.tenant_id = :tenantId", { tenantId })
      .andWhere("payment.deleted_at IS NULL");

    // Apply filters
    if (status) {
      queryBuilder.andWhere("payment.status = :status", { status });
    }

    if (paymentMethod) {
      queryBuilder.andWhere("payment.payment_method = :paymentMethod", {
        paymentMethod,
      });
    }

    if (paymentType) {
      queryBuilder.andWhere("payment.payment_type = :paymentType", {
        paymentType,
      });
    }

    if (jamaahId) {
      queryBuilder.andWhere("payment.jamaah_id = :jamaahId", { jamaahId });
    }

    if (packageId) {
      queryBuilder.andWhere("payment.package_id = :packageId", { packageId });
    }

    if (fromDate) {
      queryBuilder.andWhere("payment.payment_date >= :fromDate", { fromDate });
    }

    if (toDate) {
      queryBuilder.andWhere("payment.payment_date <= :toDate", { toDate });
    }

    // Order by payment date descending
    queryBuilder.orderBy("payment.payment_date", "DESC");

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [payments, total] = await queryBuilder.getManyAndCount();

    return {
      data: payments.map((p) => this.mapToResponseDto(p)),
      total,
      page,
      limit,
    };
  }

  /**
   * Find payment by ID
   */
  async findOne(id: string, tenantId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return this.mapToResponseDto(payment);
  }

  /**
   * Update payment
   */
  async update(
    id: string,
    dto: UpdatePaymentDto,
    tenantId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    // Update fields
    if (dto.status) {
      payment.status = dto.status;
    }

    if (dto.notes) {
      payment.notes = dto.notes;
    }

    payment.updated_at = new Date();

    const updated = await this.paymentRepository.save(payment);

    return this.mapToResponseDto(updated);
  }

  /**
   * Confirm payment
   */
  async confirm(id: string, tenantId: string): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const domain = this.mapToDomain(payment);

    if (!domain.canConfirm()) {
      throw new BadRequestException(
        `Cannot confirm payment with status: ${payment.status}`,
      );
    }

    domain.confirm();
    payment.status = domain.status;
    payment.updated_at = domain.updatedAt;

    const updated = await this.paymentRepository.save(payment);

    // TODO: Trigger commission calculation (Story 7.4)

    return this.mapToResponseDto(updated);
  }

  /**
   * Cancel payment
   */
  async cancel(
    id: string,
    dto: CancelPaymentDto,
    tenantId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const domain = this.mapToDomain(payment);

    if (!domain.canCancel()) {
      throw new BadRequestException(
        `Cannot cancel payment with status: ${payment.status}`,
      );
    }

    domain.cancel(dto.reason);
    payment.status = domain.status;
    payment.notes = domain.notes;
    payment.updated_at = domain.updatedAt;

    const updated = await this.paymentRepository.save(payment);

    return this.mapToResponseDto(updated);
  }

  /**
   * Refund payment
   */
  async refund(
    id: string,
    dto: RefundPaymentDto,
    tenantId: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    const domain = this.mapToDomain(payment);

    if (domain.status !== PaymentStatus.CONFIRMED) {
      throw new BadRequestException("Can only refund confirmed payments");
    }

    domain.refund(dto.reason);
    payment.status = domain.status;
    payment.notes = domain.notes;
    payment.updated_at = domain.updatedAt;

    const updated = await this.paymentRepository.save(payment);

    return this.mapToResponseDto(updated);
  }

  /**
   * Delete payment (soft delete)
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId,
        deleted_at: null,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    await this.paymentRepository.softDelete(id);
  }

  /**
   * Get payment statistics for a jamaah
   */
  async getJamaahPaymentStats(
    jamaahId: string,
    tenantId: string,
  ): Promise<{
    totalPaid: number;
    paymentCount: number;
    lastPaymentDate: Date | null;
  }> {
    const result = await this.paymentRepository
      .createQueryBuilder("payment")
      .select("SUM(payment.amount)", "totalPaid")
      .addSelect("COUNT(payment.id)", "paymentCount")
      .addSelect("MAX(payment.payment_date)", "lastPaymentDate")
      .where("payment.jamaah_id = :jamaahId", { jamaahId })
      .andWhere("payment.tenant_id = :tenantId", { tenantId })
      .andWhere("payment.status = :status", { status: PaymentStatus.CONFIRMED })
      .andWhere("payment.deleted_at IS NULL")
      .getRawOne();

    return {
      totalPaid: parseFloat(result.totalPaid) || 0,
      paymentCount: parseInt(result.paymentCount) || 0,
      lastPaymentDate: result.lastPaymentDate
        ? new Date(result.lastPaymentDate)
        : null,
    };
  }

  /**
   * Map entity to domain model
   */
  private mapToDomain(entity: PaymentEntity): Payment {
    return new Payment({
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      packageId: entity.package_id,
      amount: parseFloat(entity.amount.toString()),
      paymentMethod: entity.payment_method,
      paymentType: entity.payment_type,
      status: entity.status,
      referenceNumber: entity.reference_number,
      paymentDate: entity.payment_date,
      notes: entity.notes,
      recordedById: entity.recorded_by_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      deletedAt: entity.deleted_at,
    });
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(entity: PaymentEntity): PaymentResponseDto {
    const domain = this.mapToDomain(entity);

    return {
      id: entity.id,
      tenantId: entity.tenant_id,
      jamaahId: entity.jamaah_id,
      packageId: entity.package_id,
      amount: parseFloat(entity.amount.toString()),
      paymentMethod: entity.payment_method,
      paymentType: entity.payment_type,
      status: entity.status,
      referenceNumber: entity.reference_number,
      paymentDate: entity.payment_date,
      notes: entity.notes,
      recordedById: entity.recorded_by_id,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      formattedAmount: domain.getFormattedAmount(),
      paymentMethodDisplay: domain.getPaymentMethodDisplay(),
      paymentTypeDisplay: domain.getPaymentTypeDisplay(),
    };
  }
}
