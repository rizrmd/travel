import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "User email",
    example: "owner@berkahtravel.com",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "User password",
    example: "SecurePassword123!",
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
