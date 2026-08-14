import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Jeton reçu par e-mail' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NouveauMotDePasse123!' })
  @IsString()
  @MinLength(8)
  password: string;
}
