import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class OAuthGoogleDto {
  @ApiProperty({
    description: 'ID token OAuth 2.0 / OpenID Connect renvoyé par Google',
  })
  @IsString()
  idToken: string;

  @ApiPropertyOptional({
    example: 'DROP-XXXX',
    description: 'Code de parrainage (uniquement à la création du compte)',
  })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
