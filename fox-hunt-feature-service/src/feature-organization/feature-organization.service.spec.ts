import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from 'src/feature/enums/Order.enum';
import { Sort } from 'src/feature/enums/Sort.enum';
import { OrganizationRequestData } from 'src/common/requests/interfaces/organization.interface';
import { OrganizationServiceRequests } from 'src/common/requests/organization-service.requests';
import { FeatureOrganizationService } from 'src/feature-organization/feature-organization.service';
import { FeatureOrganizationRepository } from 'src/feature-organization/repository/featureOrganization.repository';
import { FeatureService } from 'src/feature/feature.service';
import { FeatureEntity } from 'src/feature/repository/feature.entity';
import { FeatureRepository } from 'src/feature/repository/feature.repository';
import {
  FeatureOrganizationIsEnabledData,
  FeatureOrganizationRaw,
  FeatureOrganizationRelationsForCurrentOrgnaization,
  FeatureOrganizationResponse,
  IFeatureOrganizationRelation,
  UpdateFeatureOrganizationRelationsResponse,
} from './interfaces/featureOrganization.interface';
import { PageSizeDto } from 'src/common/dto/pageSize.dto';

describe('FeatureOrganizationService', () => {
  let service: FeatureOrganizationService;
  let featureService: FeatureService;

  const featureNameMock: FeatureOrganizationRelationsForCurrentOrgnaization = {
    name: 'FIRST_FEATURE',
  };

  const featureMock: FeatureOrganizationIsEnabledData = {
    isEnabled: true,
    featureEntity: featureNameMock,
  };

  const organizationMockDb: OrganizationRequestData = {
    id: 1,
    name: 'Exemplary name',
  };

  const organizationFeatureMock: FeatureOrganizationResponse = {
    ...organizationMockDb,
    featureOrganizations: [
      {
        isEnabled: false,
        id: 1,
      },
    ],
  };

  const featureOrganizationMockDb: FeatureOrganizationRaw = {
    FeatureOrganizationEntity_feature_organization_id: '1',
    FeatureOrganizationEntity_is_enabled: false,
    FeatureOrganizationEntity_organization_id: '1',
    FeatureOrganizationEntity_feature_id: '1',
  };

  const mockFeatureRepository = {
    findGloballyEnabled: jest.fn(),
  };

  const mockFeatureOrganizationRepository = {
    findByOrganizationId: jest.fn().mockResolvedValue([featureMock]),
    findAllRaw: jest.fn().mockResolvedValue([featureOrganizationMockDb]),
    findFeaturesOfSpecificOrganizations: jest
      .fn()
      .mockResolvedValue([featureOrganizationMockDb]),
    createFeatureOrganizationRelations: jest.fn().mockResolvedValue(1),
  };

  const mockOrganizationServiceRequests = {
    getOrganizations: jest.fn().mockResolvedValue([organizationMockDb]),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureOrganizationService,
        FeatureService,
        {
          provide: FeatureRepository,
          useValue: mockFeatureRepository,
        },
        {
          provide: FeatureOrganizationRepository,
          useValue: mockFeatureOrganizationRepository,
        },
        {
          provide: OrganizationServiceRequests,
          useValue: mockOrganizationServiceRequests,
        },
      ],
    }).compile();

    service = module.get<FeatureOrganizationService>(
      FeatureOrganizationService,
    );
    featureService = module.get<FeatureService>(FeatureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getByOrganizationId', () => {
    const organizationId = 1;

    it('should return features of an organization', async () => {
      jest
        .spyOn(featureService, 'getGloballyEnabledFeatures')
        .mockImplementation(async () => [featureNameMock.name]);

      const features: FeatureOrganizationRelationsForCurrentOrgnaization[] =
        await service.getByOrganizationId(organizationId);
      expect(featureService.getGloballyEnabledFeatures).toHaveBeenCalled();
      expect(
        mockFeatureOrganizationRepository.findByOrganizationId,
      ).toHaveBeenCalled();
      expect(
        mockFeatureOrganizationRepository.findByOrganizationId,
      ).toHaveBeenCalledWith(organizationId);
      expect(features).toEqual([featureNameMock]);
    });

    it('should return an empty array if the organization has no features', async () => {
      jest
        .spyOn(featureService, 'getGloballyEnabledFeatures')
        .mockImplementation(async () => []);
      jest
        .spyOn(mockFeatureOrganizationRepository, 'findByOrganizationId')
        .mockImplementation(async () => []);

      const features: FeatureOrganizationRelationsForCurrentOrgnaization[] =
        await service.getByOrganizationId(organizationId);
      expect(featureService.getGloballyEnabledFeatures).toHaveBeenCalled();
      expect(
        mockFeatureOrganizationRepository.findByOrganizationId,
      ).toHaveBeenCalled();
      expect(
        mockFeatureOrganizationRepository.findByOrganizationId,
      ).toHaveBeenCalledWith(organizationId);
      expect(features).toEqual([]);
    });

    it('should throw an error if the featureService throws an error', async () => {
      jest
        .spyOn(featureService, 'getGloballyEnabledFeatures')
        .mockImplementation(async () => {
          throw new Error();
        });
      await expect(service.getByOrganizationId(organizationId)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if the featureOrganizationRepository throws an error', async () => {
      jest
        .spyOn(featureService, 'getGloballyEnabledFeatures')
        .mockImplementation(async () => []);
      jest
        .spyOn(mockFeatureOrganizationRepository, 'findByOrganizationId')
        .mockImplementation(async () => {
          throw new Error();
        });
      await expect(service.getByOrganizationId(organizationId)).rejects.toThrow(
        Error,
      );
    });
  });

  describe('getAll', () => {
    it('should list all organizations with their features', async () => {
      const getOrganizationsSpy = jest.spyOn(
        FeatureOrganizationService.prototype as any,
        'getOrganizations',
      );
      const organizationsFeatures: FeatureOrganizationResponse[] =
        await service.getAll();
      expect(getOrganizationsSpy).toHaveBeenCalledTimes(1);
      expect(
        mockFeatureOrganizationRepository.findFeaturesOfSpecificOrganizations,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationServiceRequests.getOrganizations,
      ).toHaveBeenCalledTimes(1);
      expect(organizationsFeatures).toEqual([organizationFeatureMock]);
    });

    it('should list organizations-features by page and size', async () => {
      const query: PageSizeDto = {
        page: 0,
        size: 1,
      };
      const getOrganizationsSpy = jest.spyOn(
        FeatureOrganizationService.prototype as any,
        'getOrganizations',
      );
      const organizationsFeatures: FeatureOrganizationResponse[] =
        await service.getAll(query);
      expect(getOrganizationsSpy).toHaveBeenCalledTimes(1);
      expect(getOrganizationsSpy).toHaveBeenCalledWith(query);
      expect(organizationsFeatures).toEqual([organizationFeatureMock]);
    });

    it('should return an empty array if there is no organization', async () => {
      jest
        .spyOn(
          mockFeatureOrganizationRepository,
          'findFeaturesOfSpecificOrganizations',
        )
        .mockImplementation(async () => []);
      jest
        .spyOn(mockOrganizationServiceRequests, 'getOrganizations')
        .mockImplementation(async () => []);

      const organizationsFeatures: FeatureOrganizationResponse[] =
        await service.getAll();
      expect(
        mockFeatureOrganizationRepository.findFeaturesOfSpecificOrganizations,
      ).toHaveBeenCalled();
      expect(
        mockOrganizationServiceRequests.getOrganizations,
      ).toHaveBeenCalled();
      expect(organizationsFeatures).toEqual([]);
    });

    it('should throw an error if the featureOrganizationRepository throws an error', async () => {
      jest
        .spyOn(
          mockFeatureOrganizationRepository,
          'findFeaturesOfSpecificOrganizations',
        )
        .mockImplementation(async () => {
          throw new Error();
        });
      jest
        .spyOn(mockOrganizationServiceRequests, 'getOrganizations')
        .mockImplementation(async () => []);
      await expect(service.getAll()).rejects.toThrow(Error);
    });

    it('should throw an error if the organizationServiceRequests throws an error', async () => {
      jest
        .spyOn(mockFeatureOrganizationRepository, 'findAllRaw')
        .mockImplementation(async () => []);
      jest
        .spyOn(mockOrganizationServiceRequests, 'getOrganizations')
        .mockImplementation(async () => {
          throw new Error();
        });
      await expect(service.getAll()).rejects.toThrow(Error);
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
    const featureOrganizationEntitiesDto: IFeatureOrganizationRelation = {
      organizationEntity: 5,
      featureEntity: featureDto,
      isEnabled: true,
    };

    it('should return a number of affected db rows', async () => {
      const result: UpdateFeatureOrganizationRelationsResponse =
        await service.createFeatureOrganizationRelations([
          featureOrganizationEntitiesDto,
        ]);
      expect(
        mockFeatureOrganizationRepository.createFeatureOrganizationRelations,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockFeatureOrganizationRepository.createFeatureOrganizationRelations,
      ).toHaveBeenCalledWith([featureOrganizationEntitiesDto]);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw an error if the featureOrganizationRepository throws an error', async () => {
      jest
        .spyOn(
          mockFeatureOrganizationRepository,
          'createFeatureOrganizationRelations',
        )
        .mockImplementation(async () => {
          throw new Error();
        });
      await expect(
        service.createFeatureOrganizationRelations([
          featureOrganizationEntitiesDto,
        ]),
      ).rejects.toThrow(Error);
    });
  });
});
