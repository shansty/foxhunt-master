import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PayloadEntrails } from 'src/auth/rolesAuth/payload.decorator';
import { PageSizeDto } from 'src/common/dto/pageSize.dto';
import { Order } from 'src/feature/enums/Order.enum';
import { Sort } from 'src/feature/enums/Sort.enum';
import { SortDataDto } from 'src/feature/dto/sortDataDto';
import { FeatureEntity } from 'src/feature/repository/feature.entity';
import { ArrayFeatureOrganizationDto } from './dto/createFeatureOrganization.dto';
import { FeatureOrganizationController } from './feature-organization.controller';
import { FeatureOrganizationService } from './feature-organization.service';
import {
  FeatureOrganizationRelationsForCurrentOrgnaization,
  FeatureOrganizationResponse,
} from './interfaces/featureOrganization.interface';

describe('FeatureOrganizationController', () => {
  let controller: FeatureOrganizationController;

  const organizationFeaturesMock: FeatureOrganizationResponse = {
    id: 1,
    name: 'someName',
    featureOrganizations: [
      {
        id: 1,
        isEnabled: true,
      },
      {
        id: 2,
        isEnabled: true,
      },
    ],
  };

  const featureNameMock: FeatureOrganizationRelationsForCurrentOrgnaization = {
    name: 'FEATURE_NAME',
  };

  const mockOrganizationFeatureService = {
    getAll: jest.fn().mockResolvedValue([organizationFeaturesMock]),
    getByOrganizationId: jest.fn().mockResolvedValue([featureNameMock]),
    createFeatureOrganizationRelations: jest.fn().mockResolvedValue({
      affected: 1,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureOrganizationController],
      providers: [
        {
          provide: FeatureOrganizationService,
          useValue: mockOrganizationFeatureService,
        },
      ],
    }).compile();

    controller = module.get<FeatureOrganizationController>(
      FeatureOrganizationController,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    const query: PageSizeDto = {
      page: 0,
      size: undefined,
    };
    const name = '';
    const sortData: SortDataDto = { sort: [Sort.ID, Order.ASC] };
    it('should list all organizations with their features', async () => {
      const organizationFeatures: FeatureOrganizationResponse[] =
        await controller.getAll(query);
      expect(mockOrganizationFeatureService.getAll).toHaveBeenCalledWith(query);
      expect(mockOrganizationFeatureService.getAll).toHaveBeenCalledTimes(1);
      expect(organizationFeatures).toEqual([organizationFeaturesMock]);
    });

    it('should list organization-features by page and limit', async () => {
      const query: PageSizeDto = { page: 0, size: 1 };
      const organizationFeatures = await controller.getAll(query);
      expect(mockOrganizationFeatureService.getAll).toHaveBeenCalledWith(query);
      expect(mockOrganizationFeatureService.getAll).toHaveBeenCalledTimes(1);
      expect(organizationFeatures).toEqual([organizationFeaturesMock]);
    });

    it('should throw an exception if service throws an exception', async () => {
      jest
        .spyOn(mockOrganizationFeatureService, 'getAll')
        .mockImplementation(async () => {
          throw new HttpException(
            'Exemplary HTTP error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });

      await expect(controller.getAll(query)).rejects.toThrow(HttpException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationFeatureService, 'getAll')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.getAll(query)).rejects.toThrow(HttpException);
      await expect(controller.getAll(query)).rejects.toHaveProperty(
        'status',
        400,
      );
    });
  });

  describe('getByOrganizationId', () => {
    const payload: PayloadEntrails = {
      organizationId: 1,
      email: 'test@test.com',
      roles: ['SYSTEM__ADMIN'],
    };

    it('should return organization with its features', async () => {
      const organizations: FeatureOrganizationRelationsForCurrentOrgnaization[] =
        await controller.getByOrganizationId(payload);
      expect(
        mockOrganizationFeatureService.getByOrganizationId,
      ).toHaveBeenCalledWith(payload.organizationId);
      expect(
        mockOrganizationFeatureService.getByOrganizationId,
      ).toHaveBeenCalledTimes(1);
      expect(organizations).toEqual([featureNameMock]);
    });

    it('should throw an exception if service throws an exception', async () => {
      jest
        .spyOn(mockOrganizationFeatureService, 'getByOrganizationId')
        .mockImplementation(async () => {
          throw new HttpException(
            'Exemplary HTTP error',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        });
      await expect(controller.getByOrganizationId(payload)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw a bad request exception', () => {
      jest
        .spyOn(mockOrganizationFeatureService, 'getByOrganizationId')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      expect(controller.getByOrganizationId(payload)).rejects.toThrow(
        HttpException,
      );
      expect(controller.getByOrganizationId(payload)).rejects.toHaveProperty(
        'status',
        400,
      );
    });
  });

  describe('createFeatureOrganizationRelations', () => {
    const featureDto: FeatureEntity = {
      id: 3,
      name: 'feature_name',
      description: 'feature_description',
      displayName: 'feature_displayName',
      isGlobalyEnabled: true,
    };
    const featureOrganizationRelations: ArrayFeatureOrganizationDto = {
      featureOrganizationEntities: [
        {
          organizationEntity: 5,
          featureEntity: featureDto,
          isEnabled: true,
        },
      ],
    };

    it('should return a number of affected db rows', async () => {
      const result = await controller.createFeatureOrganizationRelations(
        featureOrganizationRelations,
      );
      expect(
        mockOrganizationFeatureService.createFeatureOrganizationRelations,
      ).toHaveBeenCalledWith(
        featureOrganizationRelations.featureOrganizationEntities,
      );
      expect(
        mockOrganizationFeatureService.createFeatureOrganizationRelations,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(
          mockOrganizationFeatureService,
          'createFeatureOrganizationRelations',
        )
        .mockImplementation(async () => {
          throw new HttpException(
            'Exemplary HTTP error',
            HttpStatus.UNAUTHORIZED,
          );
        });
      await expect(
        controller.createFeatureOrganizationRelations(
          featureOrganizationRelations,
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(
          mockOrganizationFeatureService,
          'createFeatureOrganizationRelations',
        )
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.createFeatureOrganizationRelations(
          featureOrganizationRelations,
        ),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.createFeatureOrganizationRelations(
          featureOrganizationRelations,
        ),
      ).rejects.toHaveProperty('status', 400);
    });
  });
});
