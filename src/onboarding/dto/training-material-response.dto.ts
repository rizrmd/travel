/**
 * Epic 13, Story 13.4: Training Material Response DTO
 */

import { TrainingCategory, ContentType } from "../domain/training-material";

export class TrainingMaterialResponseDto {
  id: string;
  tenant_id: string;
  category: TrainingCategory;
  category_display: string;
  title: string;
  description: string | null;
  content_type: ContentType;
  content_url: string;
  embed_url: string | null;
  duration_minutes: number;
  sort_order: number;
  is_mandatory: boolean;
  is_published: boolean;
  metadata: any;
  created_at: Date;
  updated_at: Date;

  // User-specific fields (when requested by specific user)
  user_progress?: {
    status: string;
    progress_percentage: number;
    completed_at: Date | null;
  };

  constructor(data: Partial<TrainingMaterialResponseDto>) {
    Object.assign(this, data);
  }
}
