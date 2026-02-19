/**
 * Epic 10, Story 10.5: Lead Capture Form
 * Domain model for leads captured from landing pages
 */

export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  QUALIFIED = "qualified",
  CONVERTED = "converted",
  LOST = "lost",
}

export enum LeadSource {
  LANDING_PAGE = "landing_page",
  WEBSITE = "website",
  SOCIAL_MEDIA = "social_media",
  REFERRAL = "referral",
  CHATBOT = "chatbot",
  WHATSAPP = "whatsapp",
  OTHER = "other",
}

export class Lead {
  id: string;
  tenantId: string;
  landingPageId: string | null;
  agentId: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDepartureMonth: string | null;
  message: string | null;
  status: LeadStatus;
  source: LeadSource;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  convertedToJamaahId: string | null;
  assignedToAgentId: string | null;
  lastContactedAt: Date | null;
  convertedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(partial: Partial<Lead>) {
    Object.assign(this, partial);
  }

  /**
   * Mark lead as contacted
   */
  markAsContacted(): void {
    this.status = LeadStatus.CONTACTED;
    this.lastContactedAt = new Date();
  }

  /**
   * Mark lead as qualified
   */
  markAsQualified(): void {
    this.status = LeadStatus.QUALIFIED;
  }

  /**
   * Mark lead as converted
   */
  markAsConverted(jamaahId: string): void {
    this.status = LeadStatus.CONVERTED;
    this.convertedToJamaahId = jamaahId;
    this.convertedAt = new Date();
  }

  /**
   * Mark lead as lost
   */
  markAsLost(): void {
    this.status = LeadStatus.LOST;
  }

  /**
   * Assign lead to agent
   */
  assignToAgent(agentId: string): void {
    this.assignedToAgentId = agentId;
  }

  /**
   * Check if lead is from landing page
   */
  isFromLandingPage(): boolean {
    return (
      this.source === LeadSource.LANDING_PAGE && this.landingPageId !== null
    );
  }

  /**
   * Get days since created
   */
  getDaysSinceCreated(): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - this.createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Check if lead is hot (created within last 24 hours)
   */
  isHotLead(): boolean {
    return this.getDaysSinceCreated() <= 1;
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone format (Indonesian format)
   */
  static isValidPhone(phone: string): boolean {
    // Accepts formats: 08XXXXXXXXXX, +628XXXXXXXXXX, 628XXXXXXXXXX
    const phoneRegex = /^(\+?62|0)8\d{8,11}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }
}
