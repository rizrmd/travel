/**
 * Epic 9, Story 9.1: Chatbot Notify Me DTO
 * Collects user email for Phase 2 launch announcement
 */

import { IsEmail, IsString, IsOptional, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class NotifyMeDto {
  @ApiProperty({
    description: "User email for launch notification",
    example: "user@example.com",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    description: "User name (optional)",
    example: "John Doe",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: "Feature request or suggested query (optional)",
    example: "I want the chatbot to help me find jamaah by name",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  featureRequest?: string;
}

export class NotifyMeResponseDto {
  @ApiProperty({ description: "Success message" })
  message: string;

  @ApiProperty({ description: "Submitted email" })
  email: string;

  @ApiProperty({ description: "Submission timestamp" })
  submittedAt: Date;
}
