import { Test, TestingModule } from '@nestjs/testing';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository';
import { TokenService } from './token.service';
import { UnauthorizedException, HttpException } from '@nestjs/common';
import { TokenResponse } from '../interfaces/token.interface';
import { sign, JwtPayload } from 'jsonwebtoken';
import type { DeleteResult } from 'typeorm';
import { DeactivationService } from '../../deactivation/deactivation.service';

const mockAdminData: JwtPayload = {
  email: 'admin@unittest.com',
  organizationId: 1,
  roles: ['SYSTEM_ADMIN, TRAINER'],
  refreshTokenId: 1,
  iat: 1661872279,
  exp: 1781958679,
};

const mockTokensSet: TokenResponse = {
  token: 'test_access_token',
  refreshToken: 'test_refresh_token',
  expiresInSeconds: '1800',
  tokenType: 'customToken',
};

const mockEnvironmentalVariables = {
  JWT_ACCESS_TOKEN_SECRET: 'access_token_unit_test_secret',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: 1800000,
  JWT_REFRESH_TOKEN_SECRET: 'refresh_token_unit_test_secret',
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: 86400000,
};

const getAdminData = jest.fn().mockImplementation(() => {
  return mockAdminData;
});

const getEnvValue = jest.fn().mockImplementation((key: string) => {
  return mockEnvironmentalVariables[key];
});

jest.mock('../../config/config.service', () => ({
  configService: {
    getValue: (key: string) => getEnvValue(key),
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify: (token: string, key: string) => getAdminData(token, key),
  sign: jest.fn().mockImplementation((payload: JwtPayload, secret: string) => {
    if (secret === mockEnvironmentalVariables.JWT_ACCESS_TOKEN_SECRET)
      return mockTokensSet.token;
    if (secret === mockEnvironmentalVariables.JWT_REFRESH_TOKEN_SECRET)
      return mockTokensSet.refreshToken;
  }),
}));

describe('TokenService', () => {
  let service: TokenService;

  const refreshTokenId = 1;

  const mockRefreshTokensRepository = {
    createRefreshToken: jest.fn().mockResolvedValue(refreshTokenId),
    deleteRefreshTokenById: jest
      .fn()
      .mockResolvedValue({ raw: [], affected: 1 }),
    deleteRefreshTokensByTimestamp: jest
      .fn()
      .mockResolvedValue({ raw: [], affected: 1 }),
  };

  const mockDeactivationService = {
    isOrganizationDeactivated: jest.fn().mockResolvedValue(false),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: RefreshTokensRepository,
          useValue: mockRefreshTokensRepository,
        },
        {
          provide: DeactivationService,
          useValue: mockDeactivationService,
        },
      ],
    }).compile();
    service = await module.resolve<TokenService>(TokenService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should generate a set of tokens', async () => {
      const result: TokenResponse = await service.generateTokens(mockAdminData);
      expect(sign).toHaveBeenCalledTimes(2);
      expect(sign).toHaveBeenNthCalledWith(
        1,
        mockAdminData,
        mockEnvironmentalVariables.JWT_ACCESS_TOKEN_SECRET,
        {
          expiresIn:
            mockEnvironmentalVariables.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        },
      );
      expect(sign).toHaveBeenNthCalledWith(
        2,
        mockAdminData,
        mockEnvironmentalVariables.JWT_REFRESH_TOKEN_SECRET,
        {
          expiresIn:
            mockEnvironmentalVariables.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        },
      );
      expect(
        mockRefreshTokensRepository.createRefreshToken,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockRefreshTokensRepository, 'createRefreshToken')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.generateTokens(mockAdminData)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should return access token body', () => {
      const result: JwtPayload = service.verifyAccessToken(mockTokensSet.token);
      expect(getAdminData).toHaveBeenCalledTimes(1);
      expect(getAdminData).toHaveBeenCalledWith(
        mockTokensSet.token,
        mockEnvironmentalVariables.JWT_ACCESS_TOKEN_SECRET,
      );
      expect(result).toEqual(mockAdminData);
    });

    it('should return unauthorized exception', () => {
      getAdminData.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() => service.verifyAccessToken(mockTokensSet.token)).toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return refresh token body', () => {
      const result: JwtPayload = service.verifyRefreshToken(
        mockTokensSet.refreshToken,
      );
      expect(getAdminData).toHaveBeenCalledTimes(1);
      expect(getAdminData).toHaveBeenCalledWith(
        mockTokensSet.refreshToken,
        mockEnvironmentalVariables.JWT_REFRESH_TOKEN_SECRET,
      );
      expect(result).toEqual(mockAdminData);
    });

    it('should return unauthorized exception', () => {
      getAdminData.mockImplementationOnce(() => {
        throw new Error();
      });
      expect(() =>
        service.verifyRefreshToken(mockTokensSet.refreshToken),
      ).toThrow(UnauthorizedException);
    });
  });

  describe('createTokensByRefresh', () => {
    it('should return a set of tokens', async () => {
      const verifyRefreshTokenSpy = jest.spyOn(service, 'verifyRefreshToken');
      const generateTokensSpy = jest.spyOn(service, 'generateTokens');
      const deleteTokenMetaDataSpy = jest.spyOn(service, 'deleteTokenMetaData');
      const result: TokenResponse = await service.createTokensByRefresh(
        mockTokensSet.refreshToken,
      );
      expect(verifyRefreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(verifyRefreshTokenSpy).toHaveBeenCalledWith(
        mockTokensSet.refreshToken,
      );
      expect(
        mockRefreshTokensRepository.deleteRefreshTokenById,
      ).toHaveBeenCalledTimes(1);
      expect(deleteTokenMetaDataSpy).toHaveBeenCalledTimes(1);
      expect(deleteTokenMetaDataSpy).toHaveBeenCalledWith(mockAdminData);
      expect(mockDeactivationService.isOrganizationDeactivated).toBeCalledTimes(
        1,
      );
      expect(
        mockDeactivationService.isOrganizationDeactivated,
      ).toHaveBeenCalledWith(mockAdminData.organizationId);
      expect(generateTokensSpy).toHaveBeenCalledTimes(1);
      expect(generateTokensSpy).toHaveBeenCalledWith(mockAdminData);
      expect(result).toEqual(mockTokensSet);
    });

    it('should throw error if organization was deactivated', async () => {
      jest
        .spyOn(mockDeactivationService, 'isOrganizationDeactivated')
        .mockResolvedValueOnce(true);
      await expect(
        service.createTokensByRefresh(mockTokensSet.refreshToken),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if refreshTokenRepository throws an error', async () => {
      jest
        .spyOn(mockRefreshTokensRepository, 'deleteRefreshTokenById')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });

      await expect(
        service.createTokensByRefresh(mockTokensSet.refreshToken),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteRefreshToken', () => {
    it('void', async () => {
      const verifyRefreshTokenSpy = jest.spyOn(service, 'verifyRefreshToken');
      const result: void = await service.deleteRefreshToken(
        mockTokensSet.refreshToken,
      );
      expect(verifyRefreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(verifyRefreshTokenSpy).toHaveBeenCalledWith(
        mockTokensSet.refreshToken,
      );
      expect(
        mockRefreshTokensRepository.deleteRefreshTokenById,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(undefined);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockRefreshTokensRepository, 'deleteRefreshTokenById')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });

      await expect(
        service.deleteRefreshToken(mockTokensSet.refreshToken),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteTokenMetaData', () => {
    it('should return a token payload without exp, iat, refreshTokenId and token_type fields', () => {
      const updatedPayload: JwtPayload =
        service.deleteTokenMetaData(mockAdminData);
      expect(updatedPayload.email).toEqual(mockAdminData.email);
      expect(updatedPayload.exp).toEqual(undefined);
      expect(updatedPayload.iat).toEqual(undefined);
      expect(updatedPayload.refreshTokenId).toEqual(undefined);
      expect(updatedPayload.token_type).toEqual(undefined);
    });
  });

  describe('deleteRefreshTokensByTimestamp', () => {
    it('should return DeleteResult object', async () => {
      const result: DeleteResult =
        await service.deleteRefreshTokensByTimestamp();
      expect(result).toEqual({ raw: [], affected: 1 });
    });
    it('should throw an error', async () => {
      jest
        .spyOn(mockRefreshTokensRepository, 'deleteRefreshTokensByTimestamp')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.deleteRefreshTokensByTimestamp()).rejects.toThrow(
        Error,
      );
    });
  });
});
