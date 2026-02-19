import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LandingPageEntity } from "../../landing-pages/infrastructure/persistence/relational/entities/landing-page.entity";
import { LeadEntity } from "../../leads/infrastructure/persistence/relational/entities/lead.entity";
import { LandingPageStatus } from "../../landing-pages/domain/landing-page";

/**
 * Epic 10, Story 10.6: Page Analytics Service
 * Provides analytics and metrics for landing pages
 */

export interface PageAnalytics {
  landingPageId: string;
  totalViews: number;
  totalLeads: number;
  conversionRate: number;
  leadsByStatus: Record<string, number>;
  leadsBySource: Record<string, number>;
  utmSources: Record<string, number>;
}

export interface AgentAnalytics {
  totalPages: number;
  publishedPages: number;
  totalViews: number;
  totalLeads: number;
  averageConversionRate: number;
  topPerformingPages: Array<{
    id: string;
    slug: string;
    views: number;
    leads: number;
    conversionRate: number;
  }>;
}

@Injectable()
export class PageAnalyticsService {
  private readonly logger = new Logger(PageAnalyticsService.name);

  constructor(
    @InjectRepository(LandingPageEntity)
    private readonly landingPageRepository: Repository<LandingPageEntity>,
    @InjectRepository(LeadEntity)
    private readonly leadRepository: Repository<LeadEntity>,
  ) { }

  /**
   * Get analytics for a specific landing page
   */
  async getPageAnalytics(
    landingPageId: string,
    tenantId: string,
  ): Promise<PageAnalytics> {
    const landingPage = await this.landingPageRepository.findOne({
      where: { id: landingPageId, tenantId },
    });

    if (!landingPage) {
      throw new Error("Landing page not found");
    }

    // Get leads for this landing page
    const leads = await this.leadRepository.find({
      where: { landingPageId, tenantId },
    });

    // Calculate metrics
    const totalViews = landingPage.viewsCount;
    const totalLeads = landingPage.leadsCount;
    const conversionRate = totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

    // Group leads by status
    const leadsByStatus = leads.reduce(
      (acc, lead) => {
        acc[lead.status] = (acc[lead.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group leads by source
    const leadsBySource = leads.reduce(
      (acc, lead) => {
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Group leads by UTM source
    const utmSources = leads.reduce(
      (acc, lead) => {
        if (lead.utmSource) {
          acc[lead.utmSource] = (acc[lead.utmSource] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      landingPageId,
      totalViews,
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      leadsByStatus,
      leadsBySource,
      utmSources,
    };
  }

  /**
   * Get analytics for all agent's pages
   */
  async getAgentAnalytics(
    agentId: string,
    tenantId: string,
  ): Promise<AgentAnalytics> {
    const pages = await this.landingPageRepository.find({
      where: { agentId, tenantId, deletedAt: null },
    });

    const totalPages = pages.length;
    const publishedPages = pages.filter((p) => p.status === "published").length;

    const totalViews = pages.reduce((sum, p) => sum + p.viewsCount, 0);
    const totalLeads = pages.reduce((sum, p) => sum + p.leadsCount, 0);

    const averageConversionRate =
      totalViews > 0 ? (totalLeads / totalViews) * 100 : 0;

    // Get top performing pages
    const topPerformingPages = pages
      .map((p) => ({
        id: p.id,
        slug: p.slug,
        views: p.viewsCount,
        leads: p.leadsCount,
        conversionRate:
          p.viewsCount > 0 ? (p.leadsCount / p.viewsCount) * 100 : 0,
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 5);

    return {
      totalPages,
      publishedPages,
      totalViews,
      totalLeads,
      averageConversionRate: Math.round(averageConversionRate * 100) / 100,
      topPerformingPages,
    };
  }

  /**
   * Get top performing pages across all agents (for admin)
   */
  async getTopPerformingPages(
    tenantId: string,
    limit: number = 10,
  ): Promise<
    Array<{
      id: string;
      slug: string;
      agentId: string;
      views: number;
      leads: number;
      conversionRate: number;
    }>
  > {
    const pages = await this.landingPageRepository.find({
      where: { tenantId, deletedAt: null, status: LandingPageStatus.PUBLISHED },
      order: { leadsCount: "DESC" },
      take: limit,
    });

    return pages.map((p) => ({
      id: p.id,
      slug: p.slug,
      agentId: p.agentId,
      views: p.viewsCount,
      leads: p.leadsCount,
      conversionRate:
        p.viewsCount > 0 ? (p.leadsCount / p.viewsCount) * 100 : 0,
    }));
  }

  /**
   * Track page view (called when someone visits public landing page)
   */
  async trackPageView(
    landingPageId: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    },
  ): Promise<void> {
    // Increment view count
    await this.landingPageRepository.increment(
      { id: landingPageId },
      "viewsCount",
      1,
    );

    // TODO: Store detailed view analytics in separate table if needed
    // For MVP, we just increment the counter

    this.logger.debug(`Tracked view for landing page: ${landingPageId}`);
  }
}
