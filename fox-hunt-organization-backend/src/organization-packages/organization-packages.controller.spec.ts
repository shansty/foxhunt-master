import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  OrganizationPackage,
  PostOrDeleteOrganizationPackagesDto,
} from './dto/postOrDeleteOrganizationPackages.dto';
import { OrganizationPackagesInfo } from './interfaces/interfaces';
import { OrganizationPackagesController } from './organization-packages.controller';
import { OrganizationPackagesService } from './organization-packages.service';

describe('OrganizationPackagesController', () => {
  let controller: OrganizationPackagesController;

  const mockOrganizationPackage = {
    id: 1,
    name: 'Public Organization',
  };

  const mockOrganizationPackagesService = {
    getOrganizationPackages: jest
      .fn()
      .mockResolvedValue([mockOrganizationPackage]),
    manageOrganizationPackages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationPackagesController],
      providers: [OrganizationPackagesService],
    })
      .overrideProvider(OrganizationPackagesService)
      .useValue(mockOrganizationPackagesService)
      .compile();

    controller = module.get<OrganizationPackagesController>(
      OrganizationPackagesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrganizationPackages', () => {
    it('should list organization packages', async () => {
      const organizationPackages: OrganizationPackagesInfo[] =
        await controller.getOrganizationPackages();
      expect(
        mockOrganizationPackagesService.getOrganizationPackages,
      ).toHaveBeenCalledTimes(1);
      expect(organizationPackages).toEqual([mockOrganizationPackage]);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationPackagesService, 'getOrganizationPackages')
        .mockImplementation(async () => {
          throw new HttpException(`Exemplary error.`, HttpStatus.FORBIDDEN);
        });
      await expect(controller.getOrganizationPackages()).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationPackagesService, 'getOrganizationPackages')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.getOrganizationPackages()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('manageOrganizationPackages', () => {
    const organizationPackageDto: OrganizationPackage = {
      locationPackageId: '1',
      organizationId: '1',
    };
    const operationDto: PostOrDeleteOrganizationPackagesDto = {
      assignments: [organizationPackageDto],
      unassignments: [],
    };

    it('should update an organizationPackage', async () => {
      const result = await controller.manageOrganizationPackages(operationDto);
      expect(
        mockOrganizationPackagesService.manageOrganizationPackages,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationPackagesService.manageOrganizationPackages,
      ).toHaveBeenCalledWith(operationDto);
      expect(result).toEqual(undefined);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationPackagesService, 'manageOrganizationPackages')
        .mockImplementation(async () => {
          throw new HttpException(`Exemplary error.`, HttpStatus.FORBIDDEN);
        });
      await expect(
        controller.manageOrganizationPackages(operationDto),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationPackagesService, 'manageOrganizationPackages')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.manageOrganizationPackages(operationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
