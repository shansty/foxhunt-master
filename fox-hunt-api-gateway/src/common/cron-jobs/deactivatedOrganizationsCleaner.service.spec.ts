import { Test, TestingModule } from '@nestjs/testing';
import { DeactivationService } from '../../deactivation/deactivation.service';
import { DeactivatedOrganizationsCleanerService } from './deactivatedOrganizationsCleaner.service';

describe('DeactivationService', () => {
  let service: DeactivatedOrganizationsCleanerService;

  const mockDeactivationService = {
    deleteExpiredDeactivationRecords: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeactivatedOrganizationsCleanerService,
        {
          provide: DeactivationService,
          useValue: mockDeactivationService,
        },
      ],
    }).compile();
    service = await module.resolve<DeactivatedOrganizationsCleanerService>(
      DeactivatedOrganizationsCleanerService,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleCleaner', () => {
    it('should clean the expired tokens', async () => {
      const result: void = await service.handleCleaner();
      expect(
        mockDeactivationService.deleteExpiredDeactivationRecords,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockDeactivationService.deleteExpiredDeactivationRecords,
      ).toHaveBeenCalledWith();
      expect(result).toEqual(undefined);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockDeactivationService, 'deleteExpiredDeactivationRecords')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });

      await expect(service.handleCleaner()).rejects.toThrow(Error);
    });
  });
});
