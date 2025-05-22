import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { TokenService } from '../common/services/token.service';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { TokenResponse } from '../common/interfaces/token.interface';
import { GoogleRequest } from '../common/interfaces/googleRequest.interface';
import { LoginUserDto } from '../common/dtos/loginUser.dto';

describe('LoginController', () => {
  let controller: LoginController;

  const mockTokensSet: TokenResponse = {
    token: 'test_access_token',
    refreshToken: 'test_refresh_token',
    expiresInSeconds: '1800',
    tokenType: 'customToken',
  };

  const mockLoginDto: LoginUserDto = {
    email: 'unit@test.pl',
    password: 'pwd',
    domain: 'domain',
  };

  const mockLoginService = {
    logInAdmin: jest.fn().mockResolvedValue(mockTokensSet),
    logInMobileAdmin: jest.fn().mockResolvedValue(mockTokensSet),
    logInOrganizationAdmin: jest.fn().mockResolvedValue(mockTokensSet),
    changeOrganization: jest.fn().mockResolvedValue(mockTokensSet),
    googleLogin: jest.fn().mockResolvedValue(mockTokensSet),
  };

  const mockTokenService = {
    deleteRefreshToken: jest.fn(),
    createTokensByRefresh: jest.fn(),
  };

  const mockExpressResponse = {
    cookie: jest.fn().mockResolvedValue(null),
    clearCookie: jest.fn().mockResolvedValue(null),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    controller = module.get<LoginController>(LoginController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuth', () => {
    const mockRequest = {} as Request;
    it('should redirect go Google login page', async () => {
      const result: void = await controller.googleAuth(mockRequest);
      expect(result).toEqual(undefined);
    });
  });

  describe('googleAuthRedirect', () => {
    const mockGoogleRequest = {
      body: {
        email: 'admin@unittest.com',
      },
    } as GoogleRequest;
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.googleAuthRedirect(
        mockGoogleRequest,
      );
      expect(mockLoginService.googleLogin).toHaveBeenCalledTimes(1);
      expect(mockLoginService.googleLogin).toHaveBeenCalledWith(
        mockGoogleRequest,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest.spyOn(mockLoginService, 'googleLogin').mockImplementation(() => {
        throw new HttpException(
          `Incorrect credentials`,
          HttpStatus.UNAUTHORIZED,
        );
      });
      await expect(
        controller.googleAuthRedirect(mockGoogleRequest),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.googleAuthRedirect(mockGoogleRequest),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest.spyOn(mockLoginService, 'googleLogin').mockImplementation(() => {
        throw new Error(`Exemplary error`);
      });
      await expect(
        controller.googleAuthRedirect(mockGoogleRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('signInAdmin', () => {
    const mockRequest = {
      body: {
        email: 'admin@unittest.com',
        password: 'password',
        domain: 'public',
      },
    } as Request;

    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.signInAdmin(mockRequest);
      expect(mockLoginService.logInAdmin).toHaveBeenCalledTimes(1);
      expect(mockLoginService.logInAdmin).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest.spyOn(mockLoginService, 'logInAdmin').mockImplementation(() => {
        throw new HttpException(
          `Incorrect credentials`,
          HttpStatus.UNAUTHORIZED,
        );
      });
      await expect(controller.signInAdmin(mockRequest)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.signInAdmin(mockRequest)).rejects.toHaveProperty(
        'status',
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('should throw a bad request exception', async () => {
      jest.spyOn(mockLoginService, 'logInAdmin').mockImplementation(() => {
        throw new Error(`Exemplary error`);
      });
      await expect(controller.signInAdmin(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signInMobileAdmin', () => {
    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.signInMobileAdmin(
        mockLoginDto,
      );
      expect(mockLoginService.logInMobileAdmin).toHaveBeenCalledTimes(1);
      expect(mockLoginService.logInMobileAdmin).toHaveBeenCalledWith(
        mockLoginDto,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockLoginService, 'logInMobileAdmin')
        .mockImplementation(() => {
          throw new HttpException(
            `Incorrect credentials`,
            HttpStatus.UNAUTHORIZED,
          );
        });
      await expect(controller.signInMobileAdmin(mockLoginDto)).rejects.toThrow(
        HttpException,
      );
      await expect(
        controller.signInMobileAdmin(mockLoginDto),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockLoginService, 'logInMobileAdmin')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.signInMobileAdmin(mockLoginDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signInOrganizationAdmin', () => {
    const mockRequest = {
      body: {
        email: 'admin@unittest.com',
        password: 'password',
      },
    } as Request;

    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.signInOrganizationAdmin(
        mockRequest,
      );
      expect(mockLoginService.logInOrganizationAdmin).toHaveBeenCalledTimes(1);
      expect(mockLoginService.logInOrganizationAdmin).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockLoginService, 'logInOrganizationAdmin')
        .mockImplementation(() => {
          throw new HttpException(
            `Incorrect credentials`,
            HttpStatus.UNAUTHORIZED,
          );
        });
      await expect(
        controller.signInOrganizationAdmin(mockRequest),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.signInOrganizationAdmin(mockRequest),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockLoginService, 'logInOrganizationAdmin')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.signInOrganizationAdmin(mockRequest),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('logout', () => {
    it('void', async () => {
      const result: void = await controller.logout({
        refreshToken: mockTokensSet.refreshToken,
      });
      expect(mockTokenService.deleteRefreshToken).toHaveBeenCalledTimes(1);
      expect(mockTokenService.deleteRefreshToken).toHaveBeenCalledWith(
        mockTokensSet.refreshToken,
      );
      expect(result).toEqual(undefined);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockTokenService, 'deleteRefreshToken')
        .mockImplementation(() => {
          throw new HttpException(`Exception`, HttpStatus.UNAUTHORIZED);
        });
      await expect(
        controller.logout({ refreshToken: mockTokensSet.refreshToken }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockTokenService, 'deleteRefreshToken')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.logout({ refreshToken: mockTokensSet.refreshToken }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('changeOrganization', () => {
    const mockRequest = {
      body: {
        email: 'admin@unittest.com',
        domain: 'public',
      },
    } as Request;

    it('should return a set of tokens', async () => {
      const result: TokenResponse = await controller.changeOrganization(
        mockRequest,
      );
      expect(mockLoginService.changeOrganization).toHaveBeenCalledTimes(1);
      expect(mockLoginService.changeOrganization).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockLoginService, 'changeOrganization')
        .mockImplementation(() => {
          throw new HttpException(`Exception ocurred`, HttpStatus.UNAUTHORIZED);
        });
      await expect(controller.changeOrganization(mockRequest)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockLoginService, 'changeOrganization')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.signInAdmin(mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
