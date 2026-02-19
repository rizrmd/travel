import { PartialType } from "@nestjs/swagger";
import { CreateLandingPageDto } from "./create-landing-page.dto";

/**
 * Epic 10, Story 10.2: Update Landing Page DTO
 */
export class UpdateLandingPageDto extends PartialType(CreateLandingPageDto) {}
