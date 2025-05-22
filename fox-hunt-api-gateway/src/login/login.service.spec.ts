import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AxiosService } from '../common/services/axios.service';
import { TokenService } from '../common/services/token.service';
import { LoginService } from './login.service';
import { configService } from '../config/config.service';
import { TokenResponse } from '../common/interfaces/token.interface';
import { JwtPayload } from 'jsonwebtoken';
import { GoogleRequest } from '../common/interfaces/googleRequest.interface';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../common/repositories/user.repository';
import { LoginUserDto } from '../common/dtos/loginUser.dto';

describe('LoginService', () => {
  let service: LoginService;

  const mockAdminData: JwtPayload = {
    email: 'admin@unittest.com',
    organizationId: 1,
    roles: ['SYSTEM_ADMIN, TRAINER'],
  };

  const mockLoginDto: LoginUserDto = {
    email: 'unit@test.pl',
    password: 'pwd',
    domain: 'domain',
  };

  const mockRequest = {
    body: {
      email: 'admin@unittest.com',
      password: 'password',
    },
  } as Request;

  const mockTokensSet: TokenResponse = {
    token: 'test_access_token',
    refreshToken: 'test_refresh_token',
    expiresInSeconds: '1800',
    tokenType: 'customToken',
  };

  const mockAxiosService = {
    sendAxiosRequest: jest.fn().mockResolvedValue({ data: mockAdminData }),
  };

  const mockTokenService = {
    generateTokens: jest.fn().mockResolvedValue(mockTokensSet),
  };

  const mockUserRepository = {
    authenticateUser: jest.fn().mockResolvedValue(mockAdminData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: AxiosService,
          useValue: mockAxiosService,
        },
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
    service = await module.resolve<LoginService>(LoginService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('googleLogin', () => {
    const mockGoogleRequest = {
      user: {
        firstName: 'Test',
        lastName: 'User',
      },
      query: {
        domain: 'public',
      },
    } as unknown as GoogleRequest;
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.googleLogin(
        mockGoogleRequest,
      );
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledTimes(1);
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledWith(
        mockGoogleRequest,
        `${configService.getAdminUrl()}/login/authentication/google`,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw UnauthorizedException if request does not contain a user', async () => {
      const mockGoogleRequestWithNoUser = {
        query: {
          domain: 'public',
        },
      } as unknown as GoogleRequest;
      await expect(
        service.googleLogin(mockGoogleRequestWithNoUser),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an error if axiosService throws an error', async () => {
      jest
        .spyOn(mockAxiosService, 'sendAxiosRequest')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.googleLogin(mockGoogleRequest)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if tokenService throws an error', async () => {
      jest
        .spyOn(mockTokenService, 'generateTokens')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.googleLogin(mockGoogleRequest)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('logInAdmin', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.logInAdmin(mockRequest);
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledTimes(1);
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledWith(
        mockRequest,
        `${configService.getAdminUrl()}/login/authentication`,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw an error if axiosService throws an error', async () => {
      jest
        .spyOn(mockAxiosService, 'sendAxiosRequest')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInAdmin(mockRequest)).rejects.toThrow(Error);
    });

    it('should throw an error if tokenService throws an error', async () => {
      jest
        .spyOn(mockTokenService, 'generateTokens')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInAdmin(mockRequest)).rejects.toThrow(Error);
    });
  });

  describe('logInMobileAdmin', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.logInMobileAdmin(
        mockLoginDto,
      );
      expect(mockUserRepository.authenticateUser).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.authenticateUser).toHaveBeenCalledWith(
        mockLoginDto.email,
        mockLoginDto.domain,
        mockLoginDto.password,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw an error if axiosService throws an error', async () => {
      jest
        .spyOn(mockUserRepository, 'authenticateUser')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInMobileAdmin(mockLoginDto)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if tokenService throws an error', async () => {
      jest
        .spyOn(mockTokenService, 'generateTokens')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInMobileAdmin(mockLoginDto)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('logInOrganizationAdmin', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.logInOrganizationAdmin(
        mockRequest,
      );
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledTimes(1);
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledWith(
        mockRequest,
        `${configService.getAdminUrl()}/login/authentication/system`,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw an error if axiosService throws an error', async () => {
      jest
        .spyOn(mockAxiosService, 'sendAxiosRequest')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInOrganizationAdmin(mockRequest)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if tokenService throws an error', async () => {
      jest
        .spyOn(mockTokenService, 'generateTokens')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.logInOrganizationAdmin(mockRequest)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('changeOrganization', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await service.changeOrganization(
        mockRequest,
      );
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledTimes(1);
      expect(mockAxiosService.sendAxiosRequest).toHaveBeenCalledWith(
        mockRequest,
        `${configService.getAdminUrl()}/login/authentication/change-organization`,
      );
      expect(mockTokenService.generateTokens).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokens).toHaveBeenCalledWith(
        mockAdminData,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw an error if axiosService throws an error', async () => {
      jest
        .spyOn(mockAxiosService, 'sendAxiosRequest')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.changeOrganization(mockRequest)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if tokenService throws an error', async () => {
      jest
        .spyOn(mockTokenService, 'generateTokens')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.changeOrganization(mockRequest)).rejects.toThrow(
        Error,
      );
    });
  });
});
