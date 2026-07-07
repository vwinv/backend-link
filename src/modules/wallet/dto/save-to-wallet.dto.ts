import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class SaveToWalletDto {
  @ApiProperty({ enum: WalletType, example: WalletType.APPLE_WALLET })
  @IsEnum(WalletType)
  walletType: WalletType;
}
