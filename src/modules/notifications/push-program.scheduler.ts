import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PushProgramService } from './push-program.service';

@Injectable()
export class PushProgramScheduler {
  private readonly logger = new Logger(PushProgramScheduler.name);

  constructor(private readonly pushProgramService: PushProgramService) {}

  /** Toutes les 15 minutes : fenêtre horaire + délai N°20 (15–30 min). */
  @Cron('*/15 * * * *')
  async tick() {
    try {
      await this.pushProgramService.runScheduledTick();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Push programme cron: ${message}`);
    }
  }
}
