/**
 * Epic 13, Story 13.4: Update Training Material DTO
 */

import { PartialType } from "@nestjs/mapped-types";
import { CreateTrainingMaterialDto } from "./create-training-material.dto";

export class UpdateTrainingMaterialDto extends PartialType(
  CreateTrainingMaterialDto,
) {}
