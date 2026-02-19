/**
 * Epic 10, Story 10.3: Agent Branding Customization
 * Domain model for agent personal branding settings
 */

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

export class AgentBranding {
  id: string;
  userId: string; // References users table
  tenantId: string;
  profilePhoto: string | null;
  logo: string | null;
  agentName: string;
  tagline: string | null;
  phone: string;
  email: string;
  whatsappNumber: string;
  colorScheme: ColorScheme;
  socialMediaLinks: SocialMediaLinks;
  introText: string | null;
  introVideoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<AgentBranding>) {
    Object.assign(this, partial);
  }

  /**
   * Get default color scheme
   */
  static getDefaultColorScheme(): ColorScheme {
    return {
      primary: "#3B82F6", // Blue
      secondary: "#10B981", // Green
      accent: "#F59E0B", // Amber
    };
  }

  /**
   * Validate color hex format
   */
  static isValidHexColor(color: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  /**
   * Validate URL format
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validate social media URL belongs to correct platform
   */
  static isValidSocialMediaUrl(platform: string, url: string): boolean {
    const patterns: Record<string, RegExp> = {
      facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/,
      youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
    };

    return patterns[platform]?.test(url) ?? false;
  }

  /**
   * Format WhatsApp number to E.164
   */
  static formatWhatsAppNumber(number: string): string {
    // Remove all non-digit characters
    const cleaned = number.replace(/\D/g, "");

    // If starts with 0, replace with 62
    if (cleaned.startsWith("0")) {
      return `+62${cleaned.substring(1)}`;
    }

    // If starts with 62, add +
    if (cleaned.startsWith("62")) {
      return `+${cleaned}`;
    }

    // If already has +, return as is
    if (number.startsWith("+")) {
      return number;
    }

    // Default: assume Indonesian number
    return `+62${cleaned}`;
  }

  /**
   * Get WhatsApp URL with pre-filled message
   */
  getWhatsAppUrl(message?: string): string {
    const baseUrl = `https://wa.me/${this.whatsappNumber.replace(/\D/g, "")}`;

    if (message) {
      return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }

    return baseUrl;
  }

  /**
   * Check if branding is complete (all required fields filled)
   */
  isComplete(): boolean {
    return !!(
      this.agentName &&
      this.phone &&
      this.email &&
      this.whatsappNumber &&
      this.colorScheme.primary &&
      this.colorScheme.secondary &&
      this.colorScheme.accent
    );
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(): number {
    const fields = [
      this.agentName,
      this.phone,
      this.email,
      this.whatsappNumber,
      this.profilePhoto,
      this.logo,
      this.tagline,
      this.introText,
      this.introVideoUrl,
      this.socialMediaLinks.facebook,
      this.socialMediaLinks.instagram,
      this.socialMediaLinks.tiktok,
    ];

    const filledFields = fields.filter(
      (field) => field && field.length > 0,
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  }
}
