import {
  BadRequestException,
  Controller,
  HttpException,
  BadGatewayException,
  Post,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { ApiTags } from '@nestjs/swagger';
import { Body } from '@nestjs/common/decorators';
import { RegisterUserDto } from '../common/dtos/registerUser.dto';
import { VerifyUserDto } from '../common/dtos/verifyUser.dto';

@ApiTags('Registration')
@Controller()
export class RegisterController {
  constructor(private registerService: RegisterService) {}

  @Post('/register/mobile')
  async registerUserMobile(@Body() registerUserDto: RegisterUserDto) {
    try {
      return await this.registerService.registrationMobileAdmin(
        registerUserDto,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Post('/register/mobile/verify')
  async verifyUserMobile(@Body() verifyUserDto: VerifyUserDto) {
    try {
      return await this.registerService.verifyUserMobileAdmin(verifyUserDto);
    } catch (err) {
      if (err instanceof HttpException || err instanceof BadGatewayException)
        throw err;
      throw new BadRequestException(err);
    }
  }
}
