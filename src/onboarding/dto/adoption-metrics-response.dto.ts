/**
 * Epic 13, Story 13.5: Adoption Metrics Response DTO
 */

export class AdoptionMetricsResponseDto {
  // User Activity Metrics
  total_users: number;
  active_users_last_7_days: number;
  active_users_percentage: number;
  inactive_users: number;
  inactive_users_percentage: number;

  // Training Metrics
  training_completion_rate: number;
  users_completed_mandatory_training: number;
  users_with_training_progress: number;

  // Session Metrics
  average_session_duration_minutes: number;
  total_sessions_last_7_days: number;

  // Activity Breakdown
  activity_by_type: {
    activity_type: string;
    count: number;
    percentage: number;
  }[];

  // Feature Usage
  top_features_used: {
    feature_name: string;
    usage_count: number;
  }[];

  // Trends
  daily_active_users: {
    date: string;
    active_users: number;
  }[];

  // Period
  period_start: Date;
  period_end: Date;
  generated_at: Date;

  constructor(data: Partial<AdoptionMetricsResponseDto>) {
    Object.assign(this, data);
  }
}

export class InactiveUserDto {
  id: string;
  full_name: string;
  email: string;
  role: string;
  last_login_at: Date | null;
  days_since_last_login: number;
  total_logins: number;
  training_completion_percentage: number;
  created_at: Date;

  constructor(data: Partial<InactiveUserDto>) {
    Object.assign(this, data);
  }
}
