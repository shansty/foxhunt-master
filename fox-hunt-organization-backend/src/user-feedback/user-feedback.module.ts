import { Module } from '@nestjs/common';
import { UserFeedbackController } from './user-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFeedbackEntity } from '../common/entities/user-feedback.entity';
import { UserFeedbackService } from './user-feedback.service';
import { UserFeedbackRepository } from './repository/user-feedback.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserFeedbackEntity])],
  controllers: [UserFeedbackController],
  providers: [UserFeedbackService, UserFeedbackRepository],
})
export class UserFeedbackModule {}
