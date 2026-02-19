import { IsString, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RevokeTokenDto {
  @ApiProperty({ example: "tok_def456..." })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: "cli_abc123..." })
  @IsString()
  @IsNotEmpty()
  client_id: string;

  @ApiProperty({ example: "sec_xyz789..." })
  @IsString()
  @IsNotEmpty()
  client_secret: string;
}
