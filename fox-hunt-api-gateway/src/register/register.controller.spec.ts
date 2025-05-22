import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { VerifyUserDto } from 'src/common/dtos/verifyUser.dto';
import { TokenResponse } from 'src/common/interfaces/token.interface';
import { RegisterUserDto } from '../common/dtos/registerUser.dto';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

describe('RegisterController', () => {
  let controller: RegisterController;

  const mockUserDto: RegisterUserDto = {
    email: 'unit@test.pl',
    password: 'pwd',
    firstName: 'Jan',
    lastName: 'Kowalski',
    birthDate: '1999-01-08',
    country: 'Poland',
    city: 'Warszawa',
  };

  const mockUserId: {
    userId: number;
  } = { userId: 1 };

  const mockVerifyUserDto: VerifyUserDto = {
    id: 1,
    token: 'abcdef',
  };

  const mockTokensSet: TokenResponse = {
    token: 'test_access_token',
    refreshToken: 'test_refresh_token',
    expiresInSeconds: '1800',
    tokenType: 'customToken',
  };

  const mockRegisterService = {
    registrationMobileAdmin: jest.fn().mockResolvedValue(mockUserId),
    verifyUserMobileAdmin: jest.fn().mockResolvedValue(mockTokensSet),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: RegisterService,
          useValue: mockRegisterService,
        },
      ],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUserMobile', () => {
    it('should return id of a newly created user', async () => {
      const result: {
        userId: number;
      } = await controller.registerUserMobile(mockUserDto);
      expect(mockRegisterService.registrationMobileAdmin).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRegisterService.registrationMobileAdmin).toHaveBeenCalledWith(
        mockUserDto,
      );
      expect(result).toEqual(mockUserId);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockRegisterService, 'registrationMobileAdmin')
        .mockImplementation(() => {
          throw new HttpException(`Incorrect data`, HttpStatus.UNAUTHORIZED);
        });
      await expect(controller.registerUserMobile(mockUserDto)).rejects.toThrow(
        HttpException,
      );
      await expect(
        controller.registerUserMobile(mockUserDto),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockRegisterService, 'registrationMobileAdmin')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.registerUserMobile(mockUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyUserMobile', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.verifyUserMobile(
        mockVerifyUserDto,
      );
      expect(mockRegisterService.verifyUserMobileAdmin).toHaveBeenCalledTimes(
        1,
      );
      expect(mockRegisterService.verifyUserMobileAdmin).toHaveBeenCalledWith(
        mockVerifyUserDto,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockRegisterService, 'verifyUserMobileAdmin')
        .mockImplementation(() => {
          throw new HttpException(`Incorrect data`, HttpStatus.UNAUTHORIZED);
        });
      await expect(
        controller.verifyUserMobile(mockVerifyUserDto),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.verifyUserMobile(mockVerifyUserDto),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockRegisterService, 'verifyUserMobileAdmin')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.verifyUserMobile(mockVerifyUserDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
