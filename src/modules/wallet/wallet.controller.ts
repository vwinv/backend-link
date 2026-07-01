import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SaveToWalletDto } from './dto/save-to-wallet.dto';
import { WalletAddResponseDto } from './dto/wallet-add-response.dto';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('cards/:cardId/add')
  @ApiOperation({ summary: 'Générer un pass et préparer l’ajout au wallet' })
  @ApiResponse({ status: 201, type: WalletAddResponseDto })
  addCardToWallet(
    @CurrentUser() user: { userId: string },
    @Param('cardId') cardId: string,
    @Body() dto: SaveToWalletDto,
  ) {
    return this.walletService.addCardToWallet(user.userId, cardId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les cartes enregistrées dans le wallet' })
  findAll(@CurrentUser() user: { userId: string }) {
    return this.walletService.findAll(user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Retirer une carte du wallet (historique Link)' })
  remove(@CurrentUser() user: { userId: string }, @Param('id') id: string) {
    return this.walletService.remove(user.userId, id);
  }
}
