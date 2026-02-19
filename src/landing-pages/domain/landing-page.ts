/**
 * Epic 10, Story 10.1: Landing Page Entity
 * Domain model for agent-generated landing pages
 */

export enum TemplateType {
  MODERN = "modern",
  CLASSIC = "classic",
  MINIMAL = "minimal",
}

export enum LandingPageStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export interface LandingPageCustomizations {
  // Colors
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;

  // Branding
  logo?: string;
  profilePhoto?: string;
  agentName?: string;
  tagline?: string;

  // Contact
  phone?: string;
  email?: string;
  whatsappNumber?: string;

  // Social Media
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;

  // Content
  introText?: string;
  introVideoUrl?: string;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
}

export class LandingPage {
  id: string;
  tenantId: string;
  agentId: string;
  packageId: string;
  slug: string;
  templateId: TemplateType;
  customizations: LandingPageCustomizations;
  status: LandingPageStatus;
  viewsCount: number;
  leadsCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<LandingPage>) {
    Object.assign(this, partial);
  }

  /**
   * Check if page is published
   */
  isPublished(): boolean {
    return (
      this.status === LandingPageStatus.PUBLISHED && this.publishedAt !== null
    );
  }

  /**
   * Get full URL for landing page
   */
  getFullUrl(baseUrl: string): string {
    return `${baseUrl}/p/${this.slug}`;
  }

  /**
   * Increment view count
   */
  incrementViews(): void {
    this.viewsCount += 1;
  }

  /**
   * Increment lead count
   */
  incrementLeads(): void {
    this.leadsCount += 1;
  }

  /**
   * Calculate conversion rate
   */
  getConversionRate(): number {
    if (this.viewsCount === 0) return 0;
    return (this.leadsCount / this.viewsCount) * 100;
  }

  /**
   * Publish the landing page
   */
  publish(): void {
    this.status = LandingPageStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  /**
   * Unpublish (archive) the landing page
   */
  archive(): void {
    this.status = LandingPageStatus.ARCHIVED;
  }

  /**
   * Validate slug format (lowercase, alphanumeric with hyphens)
   */
  static isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  }

  /**
   * Generate slug from agent and package slugs
   */
  static generateSlug(agentSlug: string, packageSlug: string): string {
    const baseSlug = `${agentSlug}-${packageSlug}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return baseSlug;
  }
}
