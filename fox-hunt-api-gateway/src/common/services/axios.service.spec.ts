import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { AxiosService } from './axios.service';
import axios, { AxiosResponse } from 'axios';
import { HttpException } from '@nestjs/common';

jest.mock('axios');

describe('AxiosService', () => {
  let service: AxiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AxiosService],
    }).compile();
    service = await module.resolve<AxiosService>(AxiosService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined;
  });

  describe('sendAxiosRequest', () => {
    const url = 'localhost';
    const mockRequest = {
      method: 'GET',
      headers: {
        host: 'localhost',
        connection: 'keep-alive',
        'content-length': '87',
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json;charset=UTF-8',
      },
      body: {
        email: 'admin@unittest.com',
        domain: 'public',
      },
    } as Request;
    const mockResponse = {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'content-length': '102',
        connection: 'keep-alive',
      },
      data: {
        email: 'admin@unittest.com',
        organizationId: 1,
      },
    } as unknown as Response;

    it('should return a http response', async () => {
      (axios as unknown as jest.Mock).mockResolvedValueOnce(mockResponse);
      const result: AxiosResponse = await service.sendAxiosRequest(
        mockRequest,
        url,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw a http exception', async () => {
      (axios as unknown as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('Exemplary error');
      });
      await expect(service.sendAxiosRequest(mockRequest, url)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
