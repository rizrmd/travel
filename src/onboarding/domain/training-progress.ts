/**
 * Epic 13, Story 13.4: Training Progress Domain Model
 * Business logic for user training completion tracking
 */

export enum TrainingProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface CompletionCriteria {
  minProgressPercentage: number;
  minQuizScore?: number;
  requiresFullCompletion: boolean;
}

export class TrainingProgressDomain {
  static readonly DEFAULT_COMPLETION_CRITERIA: CompletionCriteria = {
    minProgressPercentage: 90,
    requiresFullCompletion: false,
  };

  static readonly QUIZ_PASSING_SCORE = 70;

  static canMarkAsCompleted(
    progressPercentage: number,
    quizScore?: number,
    criteria: CompletionCriteria = this.DEFAULT_COMPLETION_CRITERIA,
  ): boolean {
    // Check progress percentage
    if (progressPercentage < criteria.minProgressPercentage) {
      return false;
    }

    // Check quiz score if required
    if (criteria.minQuizScore && quizScore !== undefined) {
      if (quizScore < criteria.minQuizScore) {
        return false;
      }
    }

    return true;
  }

  static calculateCompletionRate(
    completedCount: number,
    totalCount: number,
  ): number {
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  }

  static determineStatus(progressPercentage: number): TrainingProgressStatus {
    if (progressPercentage === 0) {
      return TrainingProgressStatus.NOT_STARTED;
    }
    if (
      progressPercentage >=
      this.DEFAULT_COMPLETION_CRITERIA.minProgressPercentage
    ) {
      return TrainingProgressStatus.COMPLETED;
    }
    return TrainingProgressStatus.IN_PROGRESS;
  }

  static calculateProgressPercentage(
    currentPosition: number,
    totalDuration: number,
  ): number {
    if (totalDuration === 0) return 0;
    const percentage = (currentPosition / totalDuration) * 100;
    return Math.min(Math.round(percentage), 100);
  }

  static isQuizPassed(score: number): boolean {
    return score >= this.QUIZ_PASSING_SCORE;
  }

  static getStatusDisplayName(status: TrainingProgressStatus): string {
    const displayNames: Record<TrainingProgressStatus, string> = {
      [TrainingProgressStatus.NOT_STARTED]: "Belum Dimulai",
      [TrainingProgressStatus.IN_PROGRESS]: "Sedang Berjalan",
      [TrainingProgressStatus.COMPLETED]: "Selesai",
    };
    return displayNames[status];
  }

  static calculateEstimatedTimeRemaining(
    progressPercentage: number,
    totalDurationMinutes: number,
  ): number {
    const remainingPercentage = 100 - progressPercentage;
    return Math.ceil((remainingPercentage / 100) * totalDurationMinutes);
  }

  static getMandatoryProgress(
    completedMandatory: number,
    totalMandatory: number,
  ): {
    completed: number;
    total: number;
    percentage: number;
    isComplete: boolean;
  } {
    return {
      completed: completedMandatory,
      total: totalMandatory,
      percentage: this.calculateCompletionRate(
        completedMandatory,
        totalMandatory,
      ),
      isComplete: completedMandatory >= totalMandatory,
    };
  }

  static getNextRecommendedMaterial<
    T extends { is_mandatory: boolean; sort_order: number },
  >(allMaterials: T[], completedMaterialIds: string[]): T | null {
    // Filter out completed materials
    const incomplete = allMaterials.filter(
      (m: any) => !completedMaterialIds.includes(m.id),
    );

    if (incomplete.length === 0) return null;

    // Prioritize mandatory materials
    const mandatory = incomplete.filter((m) => m.is_mandatory);
    if (mandatory.length > 0) {
      return mandatory.sort((a, b) => a.sort_order - b.sort_order)[0];
    }

    // Return next optional material
    return incomplete.sort((a, b) => a.sort_order - b.sort_order)[0];
  }

  static calculateLearningStreak(
    progressRecords: { completed_at: Date | null }[],
  ): number {
    const completedDates = progressRecords
      .filter((r) => r.completed_at)
      .map((r) => r.completed_at!)
      .sort((a, b) => b.getTime() - a.getTime());

    if (completedDates.length === 0) return 0;

    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentDate = new Date(completedDates[0]);
    currentDate.setHours(0, 0, 0, 0);

    // Check if most recent is today or yesterday
    const daysDiff = Math.floor(
      (today.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysDiff > 1) return 0;

    // Count consecutive days
    for (let i = 1; i < completedDates.length; i++) {
      const prevDate = new Date(completedDates[i - 1]);
      prevDate.setHours(0, 0, 0, 0);

      const thisDate = new Date(completedDates[i]);
      thisDate.setHours(0, 0, 0, 0);

      const diff = Math.floor(
        (prevDate.getTime() - thisDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
