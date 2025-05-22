import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { configService } from '../../config/config.service';
import { ExternalAuthService } from '../../auth/externalAuth.service';
import { OrganizationPackagesRequests } from './organizationPackages.requests';
import { OrganizationPackage } from '../../organization-packages/dto/postOrDeleteOrganizationPackages.dto';
import { OrganizationPackagesRaw } from 'src/organization-packages/interfaces/interfaces';

jest.mock('axios');

describe('OrganizationPackagesRequests', () => {
  let service: OrganizationPackagesRequests;
  jest.mock('../../config/config.service', () => ({
    getAdminUrl: jest.fn().mockResolvedValue('http://localhost:8080/api/v1'),
  }));

  const mockPayloadHeader = 'test_payload';
  const mockOrganizationPackage: OrganizationPackage = {
    organizationId: '4',
    locationPackageId: '1',
  };

  const mockOrganizationPackageResponse: OrganizationPackagesRaw = {
    organizationId: 4,
    locationPackageId: 1,
    accessType: 'SHARED',
  };

  const mockExternalAuthService = {
    getPayloadHeader: jest.fn().mockResolvedValue(mockPayloadHeader),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationPackagesRequests,
        {
          provide: ExternalAuthService,
          useValue: mockExternalAuthService,
        },
      ],
    }).compile();
    service = module.get<OrganizationPackagesRequests>(
      OrganizationPackagesRequests,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('manageOrganizationPackages', () => {
    const method = 'post';
    it('should update organization packages', async () => {
      await service.manageOrganizationPackages(method, [
        mockOrganizationPackage,
      ]);
      expect(mockExternalAuthService.getPayloadHeader).toHaveBeenCalledTimes(1);
      expect(axios).toHaveBeenCalledTimes(1);
      expect(axios).toHaveBeenCalledWith(
        `${configService.getAdminUrl()}/organization-packages`,
        {
          method: method,
          data: { assignments: [mockOrganizationPackage] },
          headers: {
            'Content-Type': 'application/json',
            payload: mockPayloadHeader,
          },
        },
      );
    });

    it('should throw error if ExternalAuthService throws error', async () => {
      jest
        .spyOn(mockExternalAuthService, 'getPayloadHeader')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(
        service.manageOrganizationPackages(method, [mockOrganizationPackage]),
      ).rejects.toThrow(Error);
    });
  });

  describe('getSharedOrganizationPackages', () => {
    it('should list all shared organizations', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: [mockOrganizationPackageResponse],
      });
      const sharedPackages = await service.getSharedOrganizationPackages();
      expect(mockExternalAuthService.getPayloadHeader).toHaveBeenCalledTimes(1);
      expect(axios.get as jest.Mock).toHaveBeenCalledTimes(1);
      expect(axios.get as jest.Mock).toHaveBeenCalledWith(
        `${configService.getAdminUrl()}/organization-packages?accessType=SHARED`,
        {
          headers: {
            'Content-Type': 'application/json',
            payload: mockPayloadHeader,
          },
        },
      );
      expect(sharedPackages).toEqual([mockOrganizationPackageResponse]);
    });

    it('should throw error if ExternalAuthService throws error', async () => {
      jest
        .spyOn(mockExternalAuthService, 'getPayloadHeader')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(service.getSharedOrganizationPackages()).rejects.toThrow(
        Error,
      );
    });
  });
});
