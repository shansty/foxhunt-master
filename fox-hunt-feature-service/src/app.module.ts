import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { FeatureOrganizationModule } from './feature-organization/feature-organization.module';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    FeatureModule,
    FeatureOrganizationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
