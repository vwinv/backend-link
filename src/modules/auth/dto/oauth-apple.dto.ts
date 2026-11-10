import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OAuthAppleDto {
  @ApiProperty({
    description: 'Identity token OAuth 2.0 / OpenID Connect renvoyé par Apple',
  })
  @IsString()
  idToken: string;

  @ApiPropertyOptional({
    description: 'Prénom (fourni uniquement à la première connexion Apple)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Nom (fourni uniquement à la première connexion Apple)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    example: 'DROP-XXXX',
    description: 'Code de parrainage (uniquement à la création du compte)',
  })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
