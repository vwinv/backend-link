import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '@prisma/client';

export class WalletAddResponseDto {
  @ApiProperty({ enum: WalletType })
  walletType: WalletType;

  @ApiProperty()
  savedCardId: string;

  @ApiProperty({ required: false })
  passBase64?: string;

  @ApiProperty({ required: false })
  saveUrl?: string;
}
