/**
 * Epic 13, Story 13.4: Training Progress Response DTO
 */

import { TrainingProgressStatus } from "../domain/training-progress";

export class TrainingProgressResponseDto {
  id: string;
  user_id: string;
  material_id: string;
  material: {
    id: string;
    title: string;
    category: string;
    duration_minutes: number;
    is_mandatory: boolean;
  };
  status: TrainingProgressStatus;
  status_display: string;
  progress_percentage: number;
  current_position_seconds: number | null;
  quiz_score: number | null;
  attempts_count: number;
  started_at: Date | null;
  completed_at: Date | null;
  last_accessed_at: Date | null;
  metadata: any;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<TrainingProgressResponseDto>) {
    Object.assign(this, data);
  }
}

export class UserTrainingProgressSummaryDto {
  user_id: string;
  total_materials: number;
  completed_materials: number;
  in_progress_materials: number;
  not_started_materials: number;
  mandatory_completed: number;
  mandatory_total: number;
  completion_percentage: number;
  total_duration_minutes: number;
  completed_duration_minutes: number;
  learning_streak_days: number;
  next_recommended_material: {
    id: string;
    title: string;
    category: string;
  } | null;

  constructor(data: Partial<UserTrainingProgressSummaryDto>) {
    Object.assign(this, data);
  }
}
