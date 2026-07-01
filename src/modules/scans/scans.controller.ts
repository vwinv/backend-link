import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RecordScanContactDto } from '../contacts/dto/record-scan-contact.dto';
import { AiScanQuotaDto } from '../subscriptions/dto/usage-quota.dto';
import { ScansService } from './scans.service';

@ApiTags('Scans')
@Controller('scans')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScansController {
  constructor(private readonly scansService: ScansService) {}

  @Get('quota')
  @ApiOperation({ summary: 'Quota de scans IA pour la période en cours' })
  @ApiResponse({ status: 200, type: AiScanQuotaDto })
  getQuota(@CurrentUser() user: { userId: string }) {
    return this.scansService.getQuota(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Enregistrer un scan IA (consomme le quota)' })
  recordScan(
    @CurrentUser() user: { userId: string },
    @Body() payload: RecordScanContactDto = {},
  ) {
    return this.scansService.recordScan(user.userId, payload);
  }
}
