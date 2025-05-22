import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserFeedbackEntity } from '../../common/entities/user-feedback.entity';
import { Repository } from 'typeorm';
import { UserFeedbackDto } from '../dto/user-feedback.dto';

@Injectable()
export class UserFeedbackRepository {
  constructor(
    @InjectRepository(UserFeedbackEntity)
    private userFeedbackRepository: Repository<UserFeedbackEntity>,
  ) {}

  async update(feedback: UserFeedbackDto) {
    const queryResponse = await this.userFeedbackRepository
      .createQueryBuilder()
      .update(UserFeedbackEntity, feedback)
      .where('user_feedback_id = :id', { id: feedback.userFeedbackId })
      .returning('*')
      .updateEntity(true)
      .execute();
    return queryResponse.raw[0];
  }
}
