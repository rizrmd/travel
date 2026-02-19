import { ApiProperty } from "@nestjs/swagger";

export class ApiErrorDetailsDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  @ApiProperty({ required: false })
  details?: any;

  @ApiProperty()
  request_id: string;
}

export class ApiErrorResponseDto {
  @ApiProperty()
  error: ApiErrorDetailsDto;
}
