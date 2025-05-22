import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from 'jsonwebtoken';
import { RegisterUserDto } from 'src/common/dtos/registerUser.dto';
import { VerifyUserDto } from 'src/common/dtos/verifyUser.dto';
import { TokenResponse } from '../common/interfaces/token.interface';
import { UserRepository } from '../common/repositories/user.repository';
import { TokenService } from '../common/services/token.service';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;

  const mockTokensSet: TokenResponse = {
    token: 'test_access_token',
    refreshToken: 'test_refresh_token',
    expiresInSeconds: '1800',
    tokenType: 'customToken',
  };

  const mockAdminData: JwtPayload = {
    email: 'admin@unittest.com',
    organizationId: 1,
    roles: ['SYSTEM_ADMIN, TRAINER'],
  };

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

  const mockTokenService = {
    generateTokens: jest.fn().mockResolvedValue(mockTokensSet),
  };

  const mockUserRepository = {
    authenticateUser: jest.fn().mockResolvedValue(mockAdminData),
    activateUser: jest.fn().mockResolvedValue(mockAdminData),
    createUser: jest.fn().mockResolvedValue(mockUserId),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();
    service = await module.resolve<RegisterService>(RegisterService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registrationMobileAdmin', () => {
    it('should return identifier of a newly created user', async () => {
      const result: {
        userId: number;
      } = await service.registrationMobileAdmin(mockUserDto);
      expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith(
        mockUserDto.email,
        mockUserDto.password,
        mockUserDto.firstName,
        mockUserDto.lastName,
        mockUserDto.birthDate,
        mockUserDto.country,
        mockUserDto.city,
      );
      expect(result).toEqual(mockUserId);
    });

    it('should throw bad request exception if email address is incorrect', async () => {
      const mockUserDtoIncorrectEmail: RegisterUserDto = {
        ...mockUserDto,
        email: 'test',
      };
      await expect(
        service.registrationMobileAdmin(mockUserDtoIncorrectEmail),
      ).rejects.toThrow(HttpException);
      await expect(
        service.registrationMobileAdmin(mockUserDtoIncorrectEmail),
      ).rejects.toHaveProperty('status', HttpStatus.BAD_REQUEST);
    });
  });

  describe('verifyUserMobileAdmin', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.verifyUserMobileAdmin(
        mockVerifyUserDto,
      );
      expect(mockUserRepository.activateUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.activateUser).toHaveBeenCalledWith(
        mockVerifyUserDto.id,
        mockVerifyUserDto.token,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });
  });
});
