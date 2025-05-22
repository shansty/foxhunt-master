import { DecodeTokenMiddleware } from './decodeToken.middleware';
import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DeactivationService } from '../../deactivation/deactivation.service';
import { TokenService } from '../services/token.service';

describe('DecodeTokenMiddleware', () => {
  let mockResponse: Partial<Response>;
  const nextFunction: NextFunction = jest.fn();
  let service: DecodeTokenMiddleware;

  const mockPayload = {
    organizationId: 1,
    email: 'user@unittest.com',
  };

  const mockPayloadWithMetadata = {
    ...mockPayload,
    iat: 1662542193997222,
    exp: 1662542193997222,
  };

  const token = 'Bearer test_token';
  const mockRequest = {
    method: 'GET',
    headers: {
      host: 'localhost',
      connection: 'keep-alive',
      'content-length': '87',
      authorization: token,
    },
    body: {
      email: 'admin@unittest.com',
      domain: 'public',
    },
  } as Request;

  const mockDeactivationService = {
    isOrganizationDeactivated: jest.fn().mockResolvedValue(false),
  };

  const mockTokenService = {
    verifyAccessToken: jest.fn().mockReturnValue(mockPayloadWithMetadata),
    deleteTokenMetaData: jest.fn().mockReturnValue(mockPayload),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecodeTokenMiddleware,
        {
          provide: DeactivationService,
          useValue: mockDeactivationService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    service = await module.resolve<DecodeTokenMiddleware>(
      DecodeTokenMiddleware,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add payload header to the http request', async () => {
    await service.use(mockRequest, mockResponse as Response, nextFunction);
    expect(mockTokenService.verifyAccessToken).toBeCalledTimes(1);
    expect(mockTokenService.deleteTokenMetaData).toBeCalledTimes(1);
    expect(mockDeactivationService.isOrganizationDeactivated).toBeCalledTimes(
      1,
    );
    expect(mockRequest.headers.payload).toEqual(JSON.stringify(mockPayload));
  });

  it('should add empty payload header to the http request', async () => {
    const mockRequest = {
      method: 'GET',
      headers: {
        host: 'localhost',
        connection: 'keep-alive',
        'content-length': '87',
      },
      body: {
        email: 'admin@unittest.com',
        domain: 'public',
      },
    } as Request;
    await service.use(mockRequest, mockResponse as Response, nextFunction);
    expect(nextFunction).toBeCalledTimes(1);
    expect(mockRequest.headers.payload).toEqual('');
  });

  it('should add exception data to response object if TokenService throws an exception', async () => {
    jest
      .spyOn(mockTokenService, 'verifyAccessToken')
      .mockImplementationOnce(() => {
        throw new Error(`Exemplary error`);
      });
    await expect(
      service.use(mockRequest, mockResponse as Response, nextFunction),
    ).rejects.toThrow(HttpException);
  });

  it('should add exception data to response object if organization was deactivated', async () => {
    jest
      .spyOn(mockDeactivationService, 'isOrganizationDeactivated')
      .mockImplementationOnce(async () => true);
    await expect(
      service.use(mockRequest, mockResponse as Response, nextFunction),
    ).rejects.toThrow(HttpException);
  });
});
