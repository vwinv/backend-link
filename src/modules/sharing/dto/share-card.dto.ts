import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShareMethod } from '@prisma/client';
import { IsEnum, IsIn, IsOptional } from 'class-validator';

export class ShareCardDto {
  @ApiProperty({ enum: ShareMethod, example: ShareMethod.WHATSAPP })
  @IsEnum(ShareMethod)
  method: ShareMethod;

  @ApiPropertyOptional({ enum: ['card', 'portfolio'] })
  @IsOptional()
  @IsIn(['card', 'portfolio'])
  scope?: 'card' | 'portfolio';
}
