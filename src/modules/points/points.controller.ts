import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApplyReferralCodeDto } from './dto/apply-referral-code.dto';
import { RedeemPointsDto } from './dto/redeem-points.dto';
import { PointsService } from './points.service';
import { PointsRedeemService } from './points-redeem.service';

@ApiTags('Points')
@Controller('points')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PointsController {
  constructor(
    private readonly pointsService: PointsService,
    private readonly pointsRedeemService: PointsRedeemService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Solde, code de parrainage et historique' })
  getMe(@CurrentUser() user: { userId: string }) {
    return this.pointsService.getOverview(user.userId);
  }

  @Post('referral-code')
  @ApiOperation({ summary: 'Enregistrer un code de parrainage (filleul)' })
  applyCode(
    @CurrentUser() user: { userId: string },
    @Body() dto: ApplyReferralCodeDto,
  ) {
    return this.pointsService.applyReferralCode(user.userId, dto);
  }

  @Post('redeem')
  @ApiOperation({
    summary: 'Acheter un produit avec des points (abonnement, thèmes plus tard)',
  })
  redeem(
    @CurrentUser() user: { userId: string },
    @Body() dto: RedeemPointsDto,
  ) {
    return this.pointsRedeemService.redeem(user.userId, dto);
  }
}
