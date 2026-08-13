import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AddMemberDto } from '../teams/dto/add-member.dto';
import { AddSeatsDto } from './dto/add-seats.dto';
import { ConfirmSeatsDto } from './dto/confirm-seats.dto';
import { EspaceService } from './espace.service';

@ApiTags('Espace équipe')
@Controller('espace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EspaceController {
  constructor(private readonly espaceService: EspaceService) {}

  @Get()
  @ApiOperation({ summary: 'Lister mes espaces équipe (owner/admin)' })
  listMine(@CurrentUser() user: { userId: string }) {
    return this.espaceService.listMyEspaces(user.userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Tableau de bord espace équipe' })
  getDashboard(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
  ) {
    return this.espaceService.getDashboard(user.userId, slug);
  }

  @Get(':slug/members')
  @ApiOperation({ summary: 'Membres + invitations de l’espace' })
  getMembers(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
  ) {
    return this.espaceService.getMembers(user.userId, slug);
  }

  @Post(':slug/seats/checkout')
  @ApiOperation({ summary: 'Payer pour ajouter des sièges immédiatement' })
  checkoutSeats(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Body() dto: AddSeatsDto,
  ) {
    return this.espaceService.checkoutAdditionalSeats(
      user.userId,
      slug,
      dto.additionalSeats,
    );
  }

  @Post(':slug/seats/confirm')
  @ApiOperation({ summary: 'Confirmer le paiement d’ajout de sièges' })
  confirmSeats(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Body() dto: ConfirmSeatsDto,
  ) {
    return this.espaceService.confirmAdditionalSeats(
      user.userId,
      slug,
      dto.invoiceToken,
    );
  }

  @Post(':slug/invoices/:invoiceId/pay')
  @ApiOperation({ summary: 'Payer une facture PENDING' })
  payInvoice(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Param('invoiceId') invoiceId: string,
  ) {
    return this.espaceService.payInvoice(user.userId, slug, invoiceId);
  }

  @Post(':slug/invoices/confirm')
  @ApiOperation({ summary: 'Confirmer le paiement d’une facture' })
  confirmInvoice(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Body() dto: ConfirmSeatsDto,
  ) {
    return this.espaceService.confirmInvoicePayment(
      user.userId,
      slug,
      dto.invoiceToken,
    );
  }

  @Get(':slug/members/:memberId/analytics')
  @ApiOperation({ summary: 'Statistiques détaillées d’un membre' })
  getMemberAnalytics(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Param('memberId') memberId: string,
    @Query('days') days?: string,
  ) {
    const parsed = Number.parseInt(days ?? '30', 10);
    return this.espaceService.getMemberAnalytics(
      user.userId,
      slug,
      memberId,
      Number.isFinite(parsed) ? parsed : 30,
    );
  }

  @Post(':slug/members')
  @ApiOperation({ summary: 'Créer / inviter un membre depuis l’espace web' })
  addMember(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.espaceService.addMember(user.userId, slug, dto);
  }

  @Delete(':slug/members/:memberId')
  @ApiOperation({ summary: 'Retirer un membre' })
  removeMember(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Param('memberId') memberId: string,
  ) {
    return this.espaceService.removeMember(user.userId, slug, memberId);
  }

  @Delete(':slug/invitations/:inviteId')
  @ApiOperation({ summary: 'Annuler une invitation' })
  cancelInvitation(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
    @Param('inviteId') inviteId: string,
  ) {
    return this.espaceService.cancelInvitation(user.userId, slug, inviteId);
  }

  @Get(':slug/invoices')
  @ApiOperation({ summary: 'Factures de paiement de l’équipe' })
  getInvoices(
    @CurrentUser() user: { userId: string },
    @Param('slug') slug: string,
  ) {
    return this.espaceService.getInvoices(user.userId, slug);
  }
}
