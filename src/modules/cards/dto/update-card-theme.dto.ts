import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsObject } from 'class-validator';

export class UpdateCardThemeDto {
  @ApiProperty({
    example: {
      style: 'noir',
      showQrCode: true,
      cardBadge: 'personalTag',
    },
  })
  @IsObject()
  theme: Prisma.InputJsonValue;
}
