import { Test, TestingModule } from '@nestjs/testing';
import { UserFeedbackDto } from './dto/user-feedback.dto';
import { UserFeedbackRepository } from './repository/user-feedback.repository';
import { UserFeedbackService } from './user-feedback.service';

describe('UserFeedbackService', () => {
  let service: UserFeedbackService;

  const mockUserFeedback: UserFeedbackDto = {
    userFeedbackId: 1,
    comment: 'Good job',
    ranking: 1,
    sendDate: '2021-02-01T17:25:00.000Z',
    hasRead: false,
    userId: 1,
    organizationEntity: undefined,
  };

  const mockUserFeedbackRepository = {
    update: jest.fn().mockResolvedValue([mockUserFeedback]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserFeedbackService,
        {
          provide: UserFeedbackRepository,
          useValue: mockUserFeedbackRepository,
        },
      ],
    }).compile();
    service = module.get<UserFeedbackService>(UserFeedbackService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateUserFeedback', () => {
    it('should return a user feedback', async () => {
      const feedback = await service.updateUserFeedback(mockUserFeedback);
      expect(mockUserFeedbackRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserFeedbackRepository.update).toHaveBeenCalledWith(
        mockUserFeedback,
      );
      expect(feedback).toEqual([mockUserFeedback]);
    });

    it('should return a BadRequestException', async () => {
      jest
        .spyOn(mockUserFeedbackRepository, 'update')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        service.updateUserFeedback(mockUserFeedback),
      ).rejects.toThrow(Error);
    });
  });
});
