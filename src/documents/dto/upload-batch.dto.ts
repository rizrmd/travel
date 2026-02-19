/**
 * Epic 6, Story 6.3: Upload Batch DTO
 */

import { ApiProperty } from "@nestjs/swagger";

export class UploadBatchDto {
  @ApiProperty({
    description:
      "ZIP file containing multiple documents. Filename format: {JamaahName}-{DocumentType}.{ext}",
    type: "string",
    format: "binary",
  })
  file: any;
}
