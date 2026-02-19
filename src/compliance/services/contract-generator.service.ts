/**
 * Epic 12, Story 12.1: Contract Generator Service
 * Generate contracts from templates with Handlebars
 */

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";
import { ContractEntity } from "../infrastructure/persistence/relational/entities/contract.entity";
import {
  Contract,
  ContractType,
  ContractStatus,
  ContractVariables,
} from "../domain/contract";
import { ContractTemplateVariablesDto } from "../dto/contract-template-variables.dto";

@Injectable()
export class ContractGeneratorService {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
  ) {
    this.loadTemplates();
    this.registerHelpers();
  }

  /**
   * Load Handlebars templates
   */
  private loadTemplates() {
    const templateDir = path.join(__dirname, "../templates");
    const templateFiles = [
      "wakalah-bil-ujrah-economy.hbs",
      "wakalah-bil-ujrah-standard.hbs",
      "wakalah-bil-ujrah-premium.hbs",
    ];

    for (const file of templateFiles) {
      const templatePath = path.join(templateDir, file);
      if (fs.existsSync(templatePath)) {
        const templateContent = fs.readFileSync(templatePath, "utf-8");
        const compiled = Handlebars.compile(templateContent);
        const templateName = file.replace(".hbs", "");
        this.templates.set(templateName, compiled);
      }
    }
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers() {
    // Format currency
    Handlebars.registerHelper("formatCurrency", (amount: number) => {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    });

    // Format date
    Handlebars.registerHelper("formatDate", (date: Date) => {
      return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    });

    // Format list items
    Handlebars.registerHelper("list", (items: string[]) => {
      return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
    });
  }

  /**
   * Generate contract from template
   */
  async generateContract(
    tenantId: string,
    jamaahId: string,
    packageId: string,
    contractType: ContractType,
    templateVersion: string = "1.0",
  ): Promise<ContractEntity> {
    // Get next contract number
    const contractNumber = await this.generateContractNumber(tenantId);

    // Create contract entity
    const contract = this.contractRepository.create({
      tenantId,
      jamaahId,
      packageId,
      contractType,
      contractNumber,
      templateVersion,
      status: ContractStatus.DRAFT,
      generatedAt: new Date(),
      metadata: {},
    });

    return await this.contractRepository.save(contract);
  }

  /**
   * Fill template with variables
   */
  async fillTemplate(
    contractType: ContractType,
    variables: ContractTemplateVariablesDto,
  ): Promise<string> {
    // Validate variables
    const validation = Contract.validateVariables(variables as any);
    if (!validation.valid) {
      throw new BadRequestException(
        `Missing required fields: ${validation.missingFields.join(", ")}`,
      );
    }

    // Get template
    const templateName = Contract.getTemplateName(contractType);
    const template = this.templates.get(templateName);

    if (!template) {
      throw new NotFoundException(`Template not found: ${templateName}`);
    }

    // Fill template
    return template(variables);
  }

  /**
   * Generate unique contract number
   * Format: TU-{TENANT_CODE}-{YEAR}-{SEQUENCE}
   */
  private async generateContractNumber(tenantId: string): Promise<string> {
    const year = new Date().getFullYear();

    // Get tenant code (first 3 chars of tenant ID)
    const tenantCode = tenantId.substring(0, 3).toUpperCase();

    // Get last contract for this tenant in current year
    const lastContract = await this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("EXTRACT(YEAR FROM contract.generated_at) = :year", { year })
      .orderBy("contract.generated_at", "DESC")
      .getOne();

    let sequence = 1;
    if (lastContract) {
      // Extract sequence from last contract number
      const parts = lastContract.contractNumber.split("-");
      sequence = parseInt(parts[parts.length - 1]) + 1;
    }

    return Contract.generateContractNumber(tenantCode, year, sequence);
  }

  /**
   * Get contract by ID
   */
  async getContractById(
    tenantId: string,
    contractId: string,
  ): Promise<ContractEntity> {
    const contract = await this.contractRepository.findOne({
      where: { id: contractId, tenantId },
    });

    if (!contract) {
      throw new NotFoundException("Contract not found");
    }

    return contract;
  }

  /**
   * List contracts for tenant
   */
  async listContracts(
    tenantId: string,
    filters?: {
      jamaahId?: string;
      status?: ContractStatus;
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<ContractEntity[]> {
    const query = this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId });

    if (filters?.jamaahId) {
      query.andWhere("contract.jamaah_id = :jamaahId", {
        jamaahId: filters.jamaahId,
      });
    }

    if (filters?.status) {
      query.andWhere("contract.status = :status", { status: filters.status });
    }

    if (filters?.startDate) {
      query.andWhere("contract.generated_at >= :startDate", {
        startDate: filters.startDate,
      });
    }

    if (filters?.endDate) {
      query.andWhere("contract.generated_at <= :endDate", {
        endDate: filters.endDate,
      });
    }

    return await query.orderBy("contract.generated_at", "DESC").getMany();
  }

  /**
   * Update contract status
   */
  async updateContractStatus(
    tenantId: string,
    contractId: string,
    newStatus: ContractStatus,
  ): Promise<ContractEntity> {
    const contract = await this.getContractById(tenantId, contractId);

    // Validate status transition
    if (!Contract.canTransitionTo(contract.status, newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${contract.status} to ${newStatus}`,
      );
    }

    contract.status = newStatus;

    // Update timestamps based on new status
    if (newStatus === ContractStatus.SENT && !contract.sentAt) {
      contract.sentAt = new Date();
      contract.expiresAt = Contract.calculateExpirationDate(contract.sentAt);
    } else if (newStatus === ContractStatus.VIEWED && !contract.viewedAt) {
      contract.viewedAt = new Date();
    } else if (newStatus === ContractStatus.SIGNED && !contract.signedAt) {
      contract.signedAt = new Date();
    } else if (
      newStatus === ContractStatus.COMPLETED &&
      !contract.completedAt
    ) {
      contract.completedAt = new Date();
    }

    return await this.contractRepository.save(contract);
  }

  /**
   * Cancel contract
   */
  async cancelContract(
    tenantId: string,
    contractId: string,
  ): Promise<ContractEntity> {
    return await this.updateContractStatus(
      tenantId,
      contractId,
      ContractStatus.CANCELLED,
    );
  }

  /**
   * Check for expired contracts and update status
   */
  async checkExpiredContracts(tenantId: string): Promise<void> {
    const contracts = await this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("contract.status IN (:...statuses)", {
        statuses: [ContractStatus.SENT, ContractStatus.VIEWED],
      })
      .andWhere("contract.expires_at < :now", { now: new Date() })
      .getMany();

    for (const contract of contracts) {
      contract.status = ContractStatus.EXPIRED;
      await this.contractRepository.save(contract);
    }
  }

  /**
   * Get contracts requiring reminders
   */
  async getContractsRequiringReminders(
    tenantId: string,
  ): Promise<ContractEntity[]> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await this.contractRepository
      .createQueryBuilder("contract")
      .where("contract.tenant_id = :tenantId", { tenantId })
      .andWhere("contract.status = :status", { status: ContractStatus.SENT })
      .andWhere("contract.sent_at <= :sevenDaysAgo", { sevenDaysAgo })
      .getMany();
  }
}
