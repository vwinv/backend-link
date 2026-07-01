import { ApiProperty } from '@nestjs/swagger';
import { ShareMethod } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class ShareCardDto {
  @ApiProperty({ enum: ShareMethod, example: ShareMethod.WHATSAPP })
  @IsEnum(ShareMethod)
  method: ShareMethod;
}
