import { ApiProperty } from "@nestjs/swagger";

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  per_page: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  total_pages: number;
}

export class PaginationLinksDto {
  @ApiProperty()
  first: string;

  @ApiProperty({ required: false })
  prev?: string;

  @ApiProperty({ required: false })
  next?: string;

  @ApiProperty()
  last: string;
}

export class PublicApiResponseDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  meta: PaginationMetaDto;

  @ApiProperty()
  links: PaginationLinksDto;
}
