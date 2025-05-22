import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/rolesAuth/enums/role.enum';
import { Roles } from '../auth/rolesAuth/roles.decorator';
import { UserFeedbackDto } from './dto/user-feedback.dto';
import { UserFeedbackService } from './user-feedback.service';

@ApiTags('User Feedback')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('user-feedbacks')
export class UserFeedbackController {
  constructor(private userFeedbackService: UserFeedbackService) {}

  @Patch()
  @Roles(Role.SystemAdmin)
  async patchUserFeedback(@Body() feedback: UserFeedbackDto) {
    try {
      return await this.userFeedbackService.updateUserFeedback(feedback);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }
}
