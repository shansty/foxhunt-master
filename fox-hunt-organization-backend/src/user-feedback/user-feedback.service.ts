import { Injectable } from '@nestjs/common';
import { UserFeedbackDto } from './dto/user-feedback.dto';
import { UserFeedbackRepository } from './repository/user-feedback.repository';

@Injectable()
export class UserFeedbackService {
  constructor(private userFeedbackRepository: UserFeedbackRepository) {}

  async updateUserFeedback(feedback: UserFeedbackDto) {
    return await this.userFeedbackRepository.update(feedback);
  }
}
