import { Test, TestingModule } from '@nestjs/testing';
import { configService } from '../config/config.service';
import { DeactivationService } from './deactivation.service';
import { DeactivatedOrganizationsRepository } from '../common/repositories/deactivated-organizations.repository';
import { DeactivatedOrganizationEntity } from '../common/entities/deactivatedOrganization.entity';

describe('DeactivationService', () => {
  let service: DeactivationService;
  const organizationId = 2;

  const mockDeactivatedrganization: DeactivatedOrganizationEntity = {
    id: 1,
    organizationId,
    creationDate: new Date(),
  };

  const mockDate = new Date(2020, 3, 1);

  const mockDeactivatedOrganizationsRepository = {
    deactivateOrganization: jest.fn(),
    activateOrganization: jest.fn(),
    deleteRecordsByTokenExpirationTime: jest
      .fn()
      .mockResolvedValue({ affected: 1 }),
    getRecord: jest.fn().mockResolvedValue([mockDeactivatedrganization]),
  };

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeactivationService,
        {
          provide: DeactivatedOrganizationsRepository,
          useValue: mockDeactivatedOrganizationsRepository,
        },
      ],
    }).compile();
    service = await module.resolve<DeactivationService>(DeactivationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deactivateOrganization', () => {
    it('should deactivate organization by organizationId', async () => {
      await service.deactivateOrganization(organizationId);
      expect(
        mockDeactivatedOrganizationsRepository.deactivateOrganization,
      ).toBeCalledTimes(1);
      expect(
        mockDeactivatedOrganizationsRepository.deactivateOrganization,
      ).toHaveBeenCalledWith(organizationId);
    });

    it('should throw an error if deactivateOrganizationRepository throws an error', async () => {
      jest
        .spyOn(mockDeactivatedOrganizationsRepository, 'deactivateOrganization')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        service.deactivateOrganization(organizationId),
      ).rejects.toThrow(Error);
    });
  });

  describe('activateOrganization', () => {
    it('should activate organization by organizationId', async () => {
      await service.activateOrganization(organizationId);
      expect(
        mockDeactivatedOrganizationsRepository.activateOrganization,
      ).toBeCalledTimes(1);
      expect(
        mockDeactivatedOrganizationsRepository.activateOrganization,
      ).toHaveBeenCalledWith(organizationId);
    });

    it('should throw an error if deactivateOrganizationRepository throws an error', async () => {
      jest
        .spyOn(mockDeactivatedOrganizationsRepository, 'activateOrganization')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        service.activateOrganization(organizationId),
      ).rejects.toThrow(Error);
    });
  });

  describe('deleteExpiredDeactivationRecords', () => {
    it('should activate delete expired records', async () => {
      await service.deleteExpiredDeactivationRecords();
      expect(
        mockDeactivatedOrganizationsRepository.deleteRecordsByTokenExpirationTime,
      ).toBeCalledTimes(1);
      expect(
        mockDeactivatedOrganizationsRepository.deleteRecordsByTokenExpirationTime,
      ).toHaveBeenCalledWith(
        new Date(Date.now() - +configService.getTokenExpirationTime()),
      );
    });

    it('should throw an error if deactivateOrganizationRepository throws an error', async () => {
      jest
        .spyOn(
          mockDeactivatedOrganizationsRepository,
          'deleteRecordsByTokenExpirationTime',
        )
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.deleteExpiredDeactivationRecords()).rejects.toThrow(
        Error,
      );
    });
  });

  describe('isOrganizationDeactivated', () => {
    it('should return true if organization is deactivated', async () => {
      const result = await service.isOrganizationDeactivated(organizationId);
      expect(mockDeactivatedOrganizationsRepository.getRecord).toBeCalledTimes(
        1,
      );
      expect(
        mockDeactivatedOrganizationsRepository.getRecord,
      ).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual(true);
    });

    it('should return false if organization is not deactivated', async () => {
      jest
        .spyOn(mockDeactivatedOrganizationsRepository, 'getRecord')
        .mockImplementationOnce(() => []);
      const result = await service.isOrganizationDeactivated(organizationId);
      expect(mockDeactivatedOrganizationsRepository.getRecord).toBeCalledTimes(
        1,
      );
      expect(
        mockDeactivatedOrganizationsRepository.getRecord,
      ).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual(false);
    });

    it('should throw an error if deactivateOrganizationRepository throws an error', async () => {
      jest
        .spyOn(mockDeactivatedOrganizationsRepository, 'getRecord')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        service.isOrganizationDeactivated(organizationId),
      ).rejects.toThrow(Error);
    });
  });
});
