import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../services/token.service';
import { RefreshTokenCleanerService } from './refreshTokenCleaner.service';

describe('RefreshTokenCleanerService', () => {
  let service: RefreshTokenCleanerService;

  const mockTokenService = {
    deleteRefreshTokensByTimestamp: jest
      .fn()
      .mockResolvedValue({ raw: [], affected: 0 }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenCleanerService,
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();
    service = await module.resolve<RefreshTokenCleanerService>(
      RefreshTokenCleanerService,
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
        mockTokenService.deleteRefreshTokensByTimestamp,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockTokenService.deleteRefreshTokensByTimestamp,
      ).toHaveBeenCalledWith();
      expect(result).toEqual(undefined);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockTokenService, 'deleteRefreshTokensByTimestamp')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });

      await expect(service.handleCleaner()).rejects.toThrow(Error);
    });
  });
});
