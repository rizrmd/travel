import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export class PublicApiQueryDto {
  @ApiProperty({ example: 1, required: false, default: 1 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, default: 20 })
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  @IsOptional()
  per_page?: number = 20;

  @ApiProperty({ example: "created_at:desc", required: false })
  @IsString()
  @IsOptional()
  sort?: string;

  @ApiProperty({ example: "id,name,email", required: false })
  @IsString()
  @IsOptional()
  fields?: string;
}
