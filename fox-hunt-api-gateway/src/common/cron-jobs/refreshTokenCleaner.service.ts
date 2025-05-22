import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshTokenCleanerService {
  private readonly logger = new Logger(RefreshTokenCleanerService.name);
  constructor(private tokenService: TokenService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCleaner(): Promise<void> {
    const deleteResult =
      await this.tokenService.deleteRefreshTokensByTimestamp();
    this.logger.debug(
      `Deleted refresh tokens amount: ${deleteResult.affected}`,
    );
  }
}
