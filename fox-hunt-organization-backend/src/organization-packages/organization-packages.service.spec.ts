import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException } from '@nestjs/common';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationPackagesService } from './organization-packages.service';
import { OrganizationTypeEnum } from '../common/enums/OrganizationType.enum';
import { OrganizationStatusEnum } from '../common/enums/OrganizationStatus.enum';
import { OrganizationEntity } from '../common/entities/organization.entity';
import {
  OrganizationPackage,
  PostOrDeleteOrganizationPackagesDto,
} from './dto/postOrDeleteOrganizationPackages.dto';
import {
  OrganizationPackagesInfo,
  OrganizationPackagesRaw,
} from './interfaces/interfaces';
import { OrganizationPackagesRequests } from '../common/requests/organizationPackages.requests';

describe('OrganizationPackagesService', () => {
  let service: OrganizationPackagesService;

  const mockOrganizationEntity: OrganizationEntity = {
    id: 4,
    name: 'Public Organization',
    legalAddress: 'Minsk',
    actualAddress: 'Dluga',
    organizationDomain: 'public',
    type: OrganizationTypeEnum.FREE,
    approximateEmployeesAmount: 1,
    status: OrganizationStatusEnum.ACTIVE,
    created: '2022-08-02T10:13:18.675Z',
    lastStatusChange: '2022-08-02T10:13:18.675Z',
    system: true,
    userFeedback: [],
  };

  const organizationPackageRaw: OrganizationPackagesRaw = {
    locationPackageId: 1,
    organizationId: 4,
    accessType: 'SHARED',
  };

  const mockOrganizationService = {
    getAll: jest.fn().mockResolvedValue([mockOrganizationEntity]),
  };

  const mockOrganizationPackagesRequests = {
    getSharedOrganizationPackages: jest
      .fn()
      .mockResolvedValue([organizationPackageRaw]),
    manageOrganizationPackages: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationPackagesService,
        {
          provide: OrganizationService,
          useValue: mockOrganizationService,
        },
        {
          provide: OrganizationPackagesRequests,
          useValue: mockOrganizationPackagesRequests,
        },
      ],
    }).compile();
    service = module.get<OrganizationPackagesService>(
      OrganizationPackagesService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizationPackages', () => {
    it('should return all organization packages', async () => {
      const organizationPackages: OrganizationPackagesInfo[] =
        await service.getOrganizationPackages();
      expect(
        mockOrganizationPackagesRequests.getSharedOrganizationPackages,
      ).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.getAll).toHaveBeenCalledTimes(1);
      const expectedObj = {
        id: mockOrganizationEntity.id,
        name: mockOrganizationEntity.name,
        packages: [
          {
            id: organizationPackageRaw.locationPackageId,
          },
        ],
      };
      expect(organizationPackages).toEqual([expectedObj]);
    });

    it('should throw BadGatewayException if OrganizationPackagesRequests throws an error', async () => {
      jest
        .spyOn(
          mockOrganizationPackagesRequests,
          'getSharedOrganizationPackages',
        )
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(service.getOrganizationPackages()).rejects.toThrow(Error);
    });

    it('should throw an error if organizationService throws an error', async () => {
      jest
        .spyOn(mockOrganizationService, 'getAll')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(service.getOrganizationPackages()).rejects.toThrow(Error);
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
    it('should update an organization package', async () => {
      const result: void = await service.manageOrganizationPackages(
        operationDto,
      );
      expect(
        mockOrganizationPackagesRequests.manageOrganizationPackages,
      ).toHaveBeenCalledTimes(1);
      expect(result).toEqual(undefined);
    });

    it('should throw BadGatewayException if OrganizationPackagesRequests throws an error', async () => {
      jest
        .spyOn(mockOrganizationPackagesRequests, 'manageOrganizationPackages')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(
        service.manageOrganizationPackages(operationDto),
      ).rejects.toThrow(BadGatewayException);
    });
  });
});
