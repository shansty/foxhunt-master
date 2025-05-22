import { Module } from '@nestjs/common';
import { FeatureController } from './feature.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureService } from './feature.service';
import { FeatureEntity } from './repository/feature.entity';
import { FeatureRepository } from 'src/feature/repository/feature.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FeatureEntity])],
  controllers: [FeatureController],
  providers: [FeatureService, FeatureRepository],
  exports: [FeatureService],
})
export class FeatureModule {}
