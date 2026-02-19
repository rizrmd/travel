/**
 * Epic 13, Story 13.4: Training Material Domain Model
 * Business logic for training content management
 */

export enum TrainingCategory {
  VIDEO_TUTORIAL = "video_tutorial",
  PDF_GUIDE = "pdf_guide",
  FAQ = "faq",
  ARTICLE = "article",
}

export enum ContentType {
  YOUTUBE = "youtube",
  VIMEO = "vimeo",
  PDF = "pdf",
  LINK = "link",
}

export interface TrainingMaterialMetadata {
  tags?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  prerequisites?: string[];
  relatedMaterials?: string[];
  thumbnailUrl?: string;
  transcript?: string;
}

export class TrainingMaterialDomain {
  static readonly CATEGORY_NAMES: Record<TrainingCategory, string> = {
    [TrainingCategory.VIDEO_TUTORIAL]: "Video Tutorial",
    [TrainingCategory.PDF_GUIDE]: "Panduan PDF",
    [TrainingCategory.FAQ]: "FAQ",
    [TrainingCategory.ARTICLE]: "Artikel",
  };

  static validateContentUrl(type: ContentType, url: string): boolean {
    switch (type) {
      case ContentType.YOUTUBE:
        return this.isYouTubeUrl(url);
      case ContentType.VIMEO:
        return this.isVimeoUrl(url);
      case ContentType.PDF:
        return url.endsWith(".pdf") || url.includes("pdf");
      case ContentType.LINK:
        return this.isValidUrl(url);
      default:
        return false;
    }
  }

  private static isYouTubeUrl(url: string): boolean {
    const patterns = [
      /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^https?:\/\/youtu\.be\/[\w-]+/,
      /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    ];
    return patterns.some((pattern) => pattern.test(url));
  }

  private static isVimeoUrl(url: string): boolean {
    return /^https?:\/\/(www\.)?vimeo\.com\/\d+/.test(url);
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static extractVideoId(type: ContentType, url: string): string | null {
    if (type === ContentType.YOUTUBE) {
      const match = url.match(
        /(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      return match ? match[1] : null;
    }
    if (type === ContentType.VIMEO) {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? match[1] : null;
    }
    return null;
  }

  static getEmbedUrl(type: ContentType, url: string): string | null {
    const videoId = this.extractVideoId(type, url);
    if (!videoId) return null;

    if (type === ContentType.YOUTUBE) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (type === ContentType.VIMEO) {
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return null;
  }

  static getCategoryDisplayName(category: TrainingCategory): string {
    return this.CATEGORY_NAMES[category];
  }

  static estimateReadingTime(content: string, wordsPerMinute = 200): number {
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  static validateDuration(durationMinutes: number): boolean {
    return durationMinutes > 0 && durationMinutes <= 300; // Max 5 hours
  }

  static calculateTotalDuration(
    materials: { duration_minutes: number }[],
  ): number {
    return materials.reduce((sum, m) => sum + m.duration_minutes, 0);
  }

  static sortMaterials<T extends { sort_order: number; created_at: Date }>(
    materials: T[],
  ): T[] {
    return [...materials].sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }
      return a.created_at.getTime() - b.created_at.getTime();
    });
  }
}
