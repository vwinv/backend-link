import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppUpdateService } from './app-update.service';

@ApiTags('App')
@Controller('app')
export class AppVersionController {
  constructor(private readonly appUpdateService: AppUpdateService) {}

  @Get('version')
  @ApiOperation({
    summary: 'Versions mobiles (prompt de mise à jour in-app)',
  })
  getVersion() {
    return this.appUpdateService.getPublicConfig();
  }
}
