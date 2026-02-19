import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as Handlebars from "handlebars";
import { readFileSync } from "fs";
import { join } from "path";
import { TemplateType } from "../domain/landing-page";

/**
 * Epic 10, Story 10.1: Template Rendering Service
 * Renders HTML from Handlebars templates with package and branding data
 */

export interface TemplateData {
  // Package information
  package: {
    name: string;
    description: string;
    price: number;
    duration: number;
    departure_date: string;
    hotel_makkah: string;
    hotel_madinah: string;
    airline: string;
    inclusions: string[];
    itinerary: Array<{
      day: number;
      title: string;
      description: string;
    }>;
  };

  // Agent branding
  agent: {
    name: string;
    photo?: string;
    tagline?: string;
    phone: string;
    email: string;
    whatsapp: string;
    logo?: string;
    intro_text?: string;
    intro_video_url?: string;
    social_media: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
      linkedin?: string;
    };
  };

  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // SEO
  meta: {
    title: string;
    description: string;
    og_image?: string;
    url: string;
  };

  // UTM parameters for tracking
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

@Injectable()
export class TemplateRendererService {
  private readonly logger = new Logger(TemplateRendererService.name);
  private templates: Map<TemplateType, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    this.registerHelpers();
    this.loadTemplates();
  }

  /**
   * Register Handlebars helpers
   */
  private registerHelpers(): void {
    // Format currency helper
    Handlebars.registerHelper("formatCurrency", (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    });

    // Format date helper
    Handlebars.registerHelper("formatDate", (date: string) => {
      return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    // Pluralize helper
    Handlebars.registerHelper(
      "pluralize",
      (count: number, singular: string, plural: string) => {
        return count === 1 ? singular : plural;
      },
    );

    // Conditional comparison
    Handlebars.registerHelper("eq", (a, b) => a === b);
    Handlebars.registerHelper("gt", (a, b) => a > b);
    Handlebars.registerHelper("lt", (a, b) => a < b);

    // URL encode helper
    Handlebars.registerHelper("urlEncode", (str: string) => {
      return encodeURIComponent(str);
    });

    // WhatsApp URL helper
    Handlebars.registerHelper(
      "whatsappUrl",
      (number: string, message?: string) => {
        const cleaned = number.replace(/\D/g, "");
        const baseUrl = `https://wa.me/${cleaned}`;

        if (message) {
          return `${baseUrl}?text=${encodeURIComponent(message)}`;
        }

        return baseUrl;
      },
    );
  }

  /**
   * Load all templates from disk
   */
  private loadTemplates(): void {
    const templatePath = join(__dirname, "..", "templates");

    const templates = [
      TemplateType.MODERN,
      TemplateType.CLASSIC,
      TemplateType.MINIMAL,
    ];

    templates.forEach((templateType) => {
      try {
        const filePath = join(templatePath, `${templateType}.hbs`);
        const source = readFileSync(filePath, "utf-8");
        const template = Handlebars.compile(source);

        this.templates.set(templateType, template);
        this.logger.log(`Loaded template: ${templateType}`);
      } catch (error) {
        this.logger.error(`Failed to load template ${templateType}:`, error);
      }
    });
  }

  /**
   * Render template with data
   */
  async render(
    templateType: TemplateType,
    data: TemplateData,
  ): Promise<string> {
    const template = this.templates.get(templateType);

    if (!template) {
      throw new NotFoundException(`Template ${templateType} not found`);
    }

    try {
      const html = template(data);
      return html;
    } catch (error) {
      this.logger.error(`Error rendering template ${templateType}:`, error);
      throw error;
    }
  }

  /**
   * Get default meta tags
   */
  getDefaultMetaTags(
    packageName: string,
    agentName: string,
    url: string,
  ): string {
    return `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="Paket ${packageName} - ${agentName}">
    <meta property="og:description" content="Bergabunglah bersama ${agentName} untuk perjalanan Umroh yang berkesan. Paket ${packageName} dengan harga terbaik.">
    <meta property="og:image" content="/default-og-image.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${url}">
    <meta property="twitter:title" content="Paket ${packageName} - ${agentName}">
    <meta property="twitter:description" content="Bergabunglah bersama ${agentName} untuk perjalanan Umroh yang berkesan.">
    <meta property="twitter:image" content="/default-og-image.jpg">
    `.trim();
  }

  /**
   * Generate WhatsApp share message
   */
  generateWhatsAppMessage(data: TemplateData): string {
    return `
Assalamu'alaikum! 🕋

Saya ${data.agent.name} ingin berbagi paket Umroh terbaik:

📦 *${data.package.name}*
💰 Harga: ${new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(data.package.price)}
📅 ${data.package.duration} hari
🛫 ${data.package.airline}

Lihat detail lengkap di: ${data.meta.url}

Hubungi saya untuk informasi lebih lanjut! 🙏
    `.trim();
  }

  /**
   * Generate social media share URLs
   */
  generateShareUrls(
    url: string,
    title: string,
    packageSlug: string,
  ): Record<string, string> {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };
  }

  /**
   * Reload templates (for development)
   */
  reloadTemplates(): void {
    this.templates.clear();
    this.loadTemplates();
    this.logger.log("Templates reloaded");
  }

  /**
   * Check if template exists
   */
  hasTemplate(templateType: TemplateType): boolean {
    return this.templates.has(templateType);
  }

  /**
   * Get list of available templates
   */
  getAvailableTemplates(): TemplateType[] {
    return Array.from(this.templates.keys());
  }
}
