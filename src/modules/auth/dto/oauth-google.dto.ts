import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OAuthGoogleDto {
  @ApiProperty({
    description: 'ID token OAuth 2.0 / OpenID Connect renvoyé par Google',
  })
  @IsString()
  idToken: string;
}
