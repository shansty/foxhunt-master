import { Test, TestingModule } from '@nestjs/testing';
import { ExternalAuthService } from './externalAuth.service';
import { AxiosResponse } from 'axios';
import { configService } from '../config/config.service';
import { BadGatewayException } from '@nestjs/common';

jest.mock('axios');

const mockResponse = {
  data: {
    test: 'test',
  },
} as AxiosResponse;

jest.mock('../config/config.service', () => ({
  configService: {
    getAxiosExternalAuth: jest
      .fn()
      .mockImplementation(async () => mockResponse),
  },
}));

describe('ExternalAuthService', () => {
  let service: ExternalAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExternalAuthService],
    }).compile();
    service = module.get<ExternalAuthService>(ExternalAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return data of axios response', async () => {
    const result: string = await service.getPayloadHeader();
    expect(configService.getAxiosExternalAuth).toHaveBeenCalledTimes(1);
    expect(result).toEqual(JSON.stringify(mockResponse.data));
  });

  it('should throw a BadGatewayException', async () => {
    jest
      .spyOn(configService, 'getAxiosExternalAuth')
      .mockImplementationOnce(() => {
        throw new Error(`Exemplary error`);
      });

    await expect(service.getPayloadHeader()).rejects.toThrow(
      BadGatewayException,
    );
  });
});
