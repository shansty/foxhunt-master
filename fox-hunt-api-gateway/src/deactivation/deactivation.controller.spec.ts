import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TokenService } from '../common/services/token.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenResponse } from 'src/common/interfaces/token.interface';
import { DeactivationController } from './deactivation.controller';
import { DeactivationService } from './deactivation.service';

describe('LoginController', () => {
  let controller: DeactivationController;
  const id = 1;
  const mockDeactivationService = {
    deactivateOrganization: jest.fn(),
    activateOrganization: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeactivationController],
      providers: [
        {
          provide: DeactivationService,
          useValue: mockDeactivationService,
        },
      ],
    }).compile();

    controller = module.get<DeactivationController>(DeactivationController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deactivateOrganization', () => {
    it('should deactivate organization', async () => {
      const result = await controller.deactivateOrganization(id);
      expect(
        mockDeactivationService.deactivateOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockDeactivationService.deactivateOrganization,
      ).toHaveBeenCalledWith(id);
      expect(result).toEqual(undefined);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockDeactivationService, 'deactivateOrganization')
        .mockImplementation(() => {
          throw new HttpException(`Test Error`, HttpStatus.UNAUTHORIZED);
        });
      await expect(
        controller.deactivateOrganization(id),
      ).rejects.toHaveProperty('status', HttpStatus.UNAUTHORIZED);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockDeactivationService, 'deactivateOrganization')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.deactivateOrganization(id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('activateOrganization', () => {
    it('should activate organization', async () => {
      const result = await controller.activateOrganization(id);
      expect(
        mockDeactivationService.activateOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(mockDeactivationService.activateOrganization).toHaveBeenCalledWith(
        id,
      );
      expect(result).toEqual(undefined);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockDeactivationService, 'activateOrganization')
        .mockImplementation(() => {
          throw new HttpException(`Test Error`, HttpStatus.UNAUTHORIZED);
        });
      await expect(controller.activateOrganization(id)).rejects.toHaveProperty(
        'status',
        HttpStatus.UNAUTHORIZED,
      );
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockDeactivationService, 'activateOrganization')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.activateOrganization(id)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
