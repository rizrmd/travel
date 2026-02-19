import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LandingPageEntity } from "../infrastructure/persistence/relational/entities/landing-page.entity";
import { LandingPage, LandingPageStatus } from "../domain/landing-page";
import { CreateLandingPageDto } from "../dto/create-landing-page.dto";
import { UpdateLandingPageDto } from "../dto/update-landing-page.dto";
import { LandingPageQueryDto } from "../dto/landing-page-query.dto";
import { LandingPageResponseDto } from "../dto/landing-page-response.dto";
import { TemplateRendererService } from "./template-renderer.service";

/**
 * Epic 10, Story 10.2: Landing Pages Service
 */
@Injectable()
export class LandingPagesService {
  private readonly logger = new Logger(LandingPagesService.name);

  constructor(
    @InjectRepository(LandingPageEntity)
    private readonly landingPageRepository: Repository<LandingPageEntity>,
    private readonly templateRenderer: TemplateRendererService,
  ) {}

  /**
   * Create new landing page
   */
  async create(
    dto: CreateLandingPageDto,
    agentId: string,
    tenantId: string,
  ): Promise<LandingPageResponseDto> {
    // Generate slug if not provided
    const slug = dto.slug || (await this.generateSlug(dto.packageId, agentId));

    // Check slug uniqueness
    const existing = await this.landingPageRepository.findOne({
      where: { slug },
    });

    if (existing) {
      throw new ConflictException(`Slug ${slug} already exists`);
    }

    // Create entity
    const landingPage = this.landingPageRepository.create({
      ...dto,
      slug,
      agentId,
      tenantId,
      status: LandingPageStatus.DRAFT,
      viewsCount: 0,
      leadsCount: 0,
    });

    const saved = await this.landingPageRepository.save(landingPage);

    this.logger.log(`Created landing page: ${saved.id} (${saved.slug})`);

    return this.toResponseDto(saved);
  }

  /**
   * Find all landing pages with filters
   */
  async findAll(
    query: LandingPageQueryDto,
    tenantId: string,
  ): Promise<{ data: LandingPageResponseDto[]; total: number }> {
    const queryBuilder = this.landingPageRepository
      .createQueryBuilder("lp")
      .where("lp.tenant_id = :tenantId", { tenantId })
      .andWhere("lp.deleted_at IS NULL");

    if (query.status) {
      queryBuilder.andWhere("lp.status = :status", { status: query.status });
    }

    if (query.templateId) {
      queryBuilder.andWhere("lp.template_id = :templateId", {
        templateId: query.templateId,
      });
    }

    if (query.agentId) {
      queryBuilder.andWhere("lp.agent_id = :agentId", {
        agentId: query.agentId,
      });
    }

    if (query.packageId) {
      queryBuilder.andWhere("lp.package_id = :packageId", {
        packageId: query.packageId,
      });
    }

    const total = await queryBuilder.getCount();

    const skip = (query.page - 1) * query.limit;
    queryBuilder.skip(skip).take(query.limit).orderBy("lp.created_at", "DESC");

    const entities = await queryBuilder.getMany();
    const data = entities.map((entity) => this.toResponseDto(entity));

    return { data, total };
  }

  /**
   * Find landing page by ID
   */
  async findOne(id: string, tenantId: string): Promise<LandingPageResponseDto> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    return this.toResponseDto(landingPage);
  }

  /**
   * Find landing page by slug (public access)
   */
  async findBySlug(slug: string): Promise<LandingPageEntity> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { slug, status: LandingPageStatus.PUBLISHED, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page not found`);
    }

    return landingPage;
  }

  /**
   * Update landing page
   */
  async update(
    id: string,
    dto: UpdateLandingPageDto,
    tenantId: string,
  ): Promise<LandingPageResponseDto> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    // Check slug uniqueness if changing slug
    if (dto.slug && dto.slug !== landingPage.slug) {
      const existing = await this.landingPageRepository.findOne({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new ConflictException(`Slug ${dto.slug} already exists`);
      }
    }

    Object.assign(landingPage, dto);
    const updated = await this.landingPageRepository.save(landingPage);

    this.logger.log(`Updated landing page: ${updated.id}`);

    return this.toResponseDto(updated);
  }

  /**
   * Publish landing page
   */
  async publish(id: string, tenantId: string): Promise<LandingPageResponseDto> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    landingPage.status = LandingPageStatus.PUBLISHED;
    landingPage.publishedAt = new Date();

    const updated = await this.landingPageRepository.save(landingPage);

    this.logger.log(`Published landing page: ${updated.id} (${updated.slug})`);

    return this.toResponseDto(updated);
  }

  /**
   * Archive landing page
   */
  async archive(id: string, tenantId: string): Promise<LandingPageResponseDto> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    landingPage.status = LandingPageStatus.ARCHIVED;

    const updated = await this.landingPageRepository.save(landingPage);

    this.logger.log(`Archived landing page: ${updated.id}`);

    return this.toResponseDto(updated);
  }

  /**
   * Duplicate landing page
   */
  async duplicate(
    id: string,
    tenantId: string,
  ): Promise<LandingPageResponseDto> {
    const original = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!original) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    // Generate new slug
    const slug = await this.generateSlug(original.packageId, original.agentId);

    const duplicate = this.landingPageRepository.create({
      ...original,
      id: undefined,
      slug,
      status: LandingPageStatus.DRAFT,
      viewsCount: 0,
      leadsCount: 0,
      publishedAt: null,
    });

    const saved = await this.landingPageRepository.save(duplicate);

    this.logger.log(`Duplicated landing page: ${saved.id} from ${id}`);

    return this.toResponseDto(saved);
  }

  /**
   * Delete landing page (soft delete)
   */
  async delete(id: string, tenantId: string): Promise<void> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id, tenantId, deletedAt: null },
    });

    if (!landingPage) {
      throw new NotFoundException(`Landing page ${id} not found`);
    }

    await this.landingPageRepository.softDelete(id);

    this.logger.log(`Deleted landing page: ${id}`);
  }

  /**
   * Increment view count
   */
  async incrementViews(id: string): Promise<void> {
    await this.landingPageRepository.increment({ id }, "viewsCount", 1);
  }

  /**
   * Increment lead count
   */
  async incrementLeads(id: string): Promise<void> {
    await this.landingPageRepository.increment({ id }, "leadsCount", 1);
  }

  /**
   * Generate unique slug
   */
  private async generateSlug(
    packageId: string,
    agentId: string,
  ): Promise<string> {
    // TODO: Fetch package and agent details to generate meaningful slug
    // For now, use a simple combination
    const timestamp = Date.now();
    const baseSlug = `page-${timestamp}`;

    return baseSlug;
  }

  /**
   * Convert entity to response DTO
   */
  private toResponseDto(entity: LandingPageEntity): LandingPageResponseDto {
    const conversionRate =
      entity.viewsCount > 0 ? (entity.leadsCount / entity.viewsCount) * 100 : 0;

    return {
      id: entity.id,
      tenantId: entity.tenantId,
      agentId: entity.agentId,
      packageId: entity.packageId,
      slug: entity.slug,
      templateId: entity.templateId,
      customizations: entity.customizations,
      status: entity.status,
      viewsCount: entity.viewsCount,
      leadsCount: entity.leadsCount,
      conversionRate: Math.round(conversionRate * 100) / 100,
      publishedAt: entity.publishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: `/p/${entity.slug}`, // TODO: Use full base URL from config
    };
  }
}
