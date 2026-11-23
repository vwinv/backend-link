import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AdminNotificationsService } from './admin-notifications.service';

@Injectable()
export class AdminNotificationsScheduler {
  private readonly logger = new Logger(AdminNotificationsScheduler.name);

  constructor(
    private readonly notificationsService: AdminNotificationsService,
  ) {}

  /** Toutes les minutes : campagnes programmées arrivées à échéance. */
  @Cron('* * * * *')
  async tick() {
    try {
      const result = await this.notificationsService.processDueScheduledCampaigns();
      if (result.processed > 0) {
        this.logger.log(
          `Campagnes programmées traitées: ${result.processed} (ok=${result.sent}, fail=${result.failed})`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Cron campagnes programmées: ${message}`);
    }
  }
}
