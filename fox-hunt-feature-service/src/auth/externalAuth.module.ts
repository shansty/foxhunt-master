import { Module } from '@nestjs/common';
import { ExternalAuthService } from './externalAuth.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ExternalAuthService],
  exports: [ExternalAuthService],
})
export class ExternalAuthModule {}
