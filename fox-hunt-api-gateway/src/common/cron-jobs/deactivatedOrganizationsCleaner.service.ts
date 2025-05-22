import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { configService } from '../../config/config.service';
import { DeactivationService } from '../../deactivation/deactivation.service';

@Injectable()
export class DeactivatedOrganizationsCleanerService {
  constructor(private deactivationService: DeactivationService) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleCleaner() {
    await this.deactivationService.deleteExpiredDeactivationRecords();
  }
}
