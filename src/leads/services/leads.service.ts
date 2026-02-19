import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, LessThanOrEqual, MoreThanOrEqual, Between } from "typeorm";
import { LeadEntity } from "../infrastructure/persistence/relational/entities/lead.entity";
import { Lead, LeadStatus, LeadSource } from "../domain/lead";
import { CreateLeadDto } from "../dto/create-lead.dto";
import { UpdateLeadStatusDto } from "../dto/update-lead-status.dto";
import { LeadQueryDto } from "../dto/lead-query.dto";
import { LeadResponseDto } from "../dto/lead-response.dto";

/**
 * Epic 10, Story 10.5: Leads Service
 */
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,
  ) {}

  /**
   * Create new lead (from landing page or other source)
   */
  async create(
    dto: CreateLeadDto,
    agentId: string,
    tenantId: string,
  ): Promise<LeadResponseDto> {
    const lead = this.leadRepository.create({
      ...dto,
      agentId,
      tenantId,
      status: LeadStatus.NEW,
      source: dto.landingPageId ? LeadSource.LANDING_PAGE : LeadSource.WEBSITE,
    });

    const saved = await this.leadRepository.save(lead);

    this.logger.log(
      `Created lead: ${saved.id} (${saved.fullName} - ${saved.email})`,
    );

    // TODO: Send email notification to agent
    // TODO: Send auto-reply email to prospect
    // TODO: Emit WebSocket event for real-time notification

    return this.toResponseDto(saved);
  }

  /**
   * Find all leads with filters
   */
  async findAll(
    query: LeadQueryDto,
    tenantId: string,
  ): Promise<{ data: LeadResponseDto[]; total: number }> {
    const queryBuilder = this.leadRepository
      .createQueryBuilder("lead")
      .where("lead.tenant_id = :tenantId", { tenantId })
      .andWhere("lead.deleted_at IS NULL");

    if (query.status) {
      queryBuilder.andWhere("lead.status = :status", { status: query.status });
    }

    if (query.source) {
      queryBuilder.andWhere("lead.source = :source", { source: query.source });
    }

    if (query.agentId) {
      queryBuilder.andWhere("lead.agent_id = :agentId", {
        agentId: query.agentId,
      });
    }

    if (query.landingPageId) {
      queryBuilder.andWhere("lead.landing_page_id = :landingPageId", {
        landingPageId: query.landingPageId,
      });
    }

    if (query.hotLeadsOnly) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      queryBuilder.andWhere("lead.created_at >= :oneDayAgo", { oneDayAgo });
    }

    if (query.startDate) {
      queryBuilder.andWhere("lead.created_at >= :startDate", {
        startDate: new Date(query.startDate),
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere("lead.created_at <= :endDate", {
        endDate: new Date(query.endDate),
      });
    }

    const total = await queryBuilder.getCount();

    const skip = (query.page - 1) * query.limit;
    queryBuilder
      .skip(skip)
      .take(query.limit)
      .orderBy("lead.created_at", "DESC");

    const entities = await queryBuilder.getMany();
    const data = entities.map((entity) => this.toResponseDto(entity));

    return { data, total };
  }

  /**
   * Find lead by ID
   */
  async findOne(id: string, tenantId: string): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    return this.toResponseDto(lead);
  }

  /**
   * Update lead status
   */
  async updateStatus(
    id: string,
    dto: UpdateLeadStatusDto,
    tenantId: string,
  ): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    lead.status = dto.status;

    // Update timestamps based on status
    if (dto.status === LeadStatus.CONVERTED && dto.convertedToJamaahId) {
      lead.convertedToJamaahId = dto.convertedToJamaahId;
      lead.convertedAt = new Date();
    }

    const updated = await this.leadRepository.save(lead);

    this.logger.log(`Updated lead ${id} status to ${dto.status}`);

    return this.toResponseDto(updated);
  }

  /**
   * Mark lead as contacted
   */
  async markAsContacted(
    id: string,
    tenantId: string,
  ): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    lead.status = LeadStatus.CONTACTED;
    lead.lastContactedAt = new Date();

    const updated = await this.leadRepository.save(lead);

    this.logger.log(`Marked lead ${id} as contacted`);

    return this.toResponseDto(updated);
  }

  /**
   * Assign lead to agent
   */
  async assignToAgent(
    id: string,
    agentId: string,
    tenantId: string,
  ): Promise<LeadResponseDto> {
    const lead = await this.leadRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!lead) {
      throw new NotFoundException(`Lead ${id} not found`);
    }

    lead.assignedToAgentId = agentId;

    const updated = await this.leadRepository.save(lead);

    this.logger.log(`Assigned lead ${id} to agent ${agentId}`);

    // TODO: Send notification to assigned agent

    return this.toResponseDto(updated);
  }

  /**
   * Get hot leads (< 24 hours old)
   */
  async getHotLeads(tenantId: string): Promise<LeadResponseDto[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const leads = await this.leadRepository.find({
      where: {
        tenantId,
        createdAt: MoreThanOrEqual(oneDayAgo),
        status: LeadStatus.NEW,
        deletedAt: null,
      },
      order: { createdAt: "DESC" },
    });

    return leads.map((lead) => this.toResponseDto(lead));
  }

  /**
   * Get leads by agent
   */
  async getLeadsByAgent(
    agentId: string,
    tenantId: string,
  ): Promise<LeadResponseDto[]> {
    const leads = await this.leadRepository.find({
      where: { agentId, tenantId, deletedAt: null },
      order: { createdAt: "DESC" },
    });

    return leads.map((lead) => this.toResponseDto(lead));
  }

  /**
   * Calculate days since lead created
   */
  private getDaysSinceCreated(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(entity: LeadEntity): LeadResponseDto {
    const daysSinceCreated = this.getDaysSinceCreated(entity.createdAt);
    const isHotLead = daysSinceCreated <= 1;

    return {
      id: entity.id,
      tenantId: entity.tenantId,
      landingPageId: entity.landingPageId,
      agentId: entity.agentId,
      fullName: entity.fullName,
      email: entity.email,
      phone: entity.phone,
      preferredDepartureMonth: entity.preferredDepartureMonth,
      message: entity.message,
      status: entity.status,
      source: entity.source,
      utmSource: entity.utmSource,
      utmMedium: entity.utmMedium,
      utmCampaign: entity.utmCampaign,
      convertedToJamaahId: entity.convertedToJamaahId,
      assignedToAgentId: entity.assignedToAgentId,
      lastContactedAt: entity.lastContactedAt,
      convertedAt: entity.convertedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      daysSinceCreated,
      isHotLead,
    };
  }
}
