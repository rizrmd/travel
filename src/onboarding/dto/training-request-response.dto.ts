/**
 * Epic 13, Story 13.6: Training Request Response DTO
 */

import {
  IsInt,
  Min,
  Max,
  IsString,
  IsDateString,
  IsOptional,
  MaxLength,
} from "class-validator";
import {
  TrainingRequestStatus,
  ContactMethod,
} from "../infrastructure/persistence/relational/entities/training-request.entity";

export class TrainingRequestResponseDto {
  id: string;
  tenant_id: string;
  user_id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  };
  topic: string;
  message: string | null;
  preferred_date: Date | null;
  preferred_time: string | null;
  contact_method: ContactMethod;
  status: TrainingRequestStatus;
  status_display: string;
  assigned_to_id: string | null;
  assigned_to: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  assigned_at: Date | null;
  scheduled_at: Date | null;
  scheduled_duration_minutes: number | null;
  meeting_url: string | null;
  meeting_location: string | null;
  completed_at: Date | null;
  completion_notes: string | null;
  satisfaction_rating: number | null;
  metadata: any;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<TrainingRequestResponseDto>) {
    Object.assign(this, data);
  }
}

export class AssignTrainerDto {
  @IsString()
  assigned_to_id: string;
}

export class ScheduleTrainingDto {
  @IsDateString()
  scheduled_at: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  scheduled_duration_minutes?: number = 60;

  @IsOptional()
  @IsString()
  meeting_url?: string;

  @IsOptional()
  @IsString()
  meeting_location?: string;
}

export class CompleteTrainingDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  completion_notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  satisfaction_rating?: number;
}


