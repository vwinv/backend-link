import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class UpdatePreferredLocaleDto {
  @ApiProperty({ enum: ['fr', 'en'], example: 'fr' })
  @IsString()
  @IsIn(['fr', 'en'])
  locale!: 'fr' | 'en';
}
