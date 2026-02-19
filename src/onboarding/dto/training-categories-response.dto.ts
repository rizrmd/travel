/**
 * Epic 13, Story 13.4: Training Categories Response DTO
 */

import { TrainingCategory } from "../domain/training-material";

export class TrainingCategoryDto {
  category: TrainingCategory;
  display_name: string;
  material_count: number;
  total_duration_minutes: number;
  mandatory_count: number;

  constructor(data: Partial<TrainingCategoryDto>) {
    Object.assign(this, data);
  }
}

export class TrainingCategoriesResponseDto {
  categories: TrainingCategoryDto[];
  total_materials: number;
  total_duration_minutes: number;

  constructor(data: Partial<TrainingCategoriesResponseDto>) {
    Object.assign(this, data);
  }
}
