import { ApiProperty } from '@nestjs/swagger';
import { WalletType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class SaveToWalletDto {
  @ApiProperty({ description: 'ID de la carte à enregistrer' })
  @IsString()
  cardId: string;

  @ApiProperty({ enum: WalletType, example: WalletType.APPLE_WALLET })
  @IsEnum(WalletType)
  walletType: WalletType;
}
