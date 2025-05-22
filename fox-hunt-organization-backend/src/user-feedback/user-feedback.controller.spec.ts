import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserFeedbackDto } from './dto/user-feedback.dto';
import { UserFeedbackController } from './user-feedback.controller';
import { UserFeedbackService } from './user-feedback.service';

describe('UserFeedbackController', () => {
  let controller: UserFeedbackController;

  const mockUserFeedback: UserFeedbackDto = {
    userFeedbackId: 1,
    comment: 'Good job',
    ranking: 1,
    sendDate: '2021-02-01T17:25:00.000Z',
    hasRead: false,
    userId: 1,
    organizationEntity: undefined,
  };
  const mockUserFeedbackService = {
    updateUserFeedback: jest.fn().mockResolvedValue([mockUserFeedback]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFeedbackController],
      providers: [UserFeedbackService],
    })
      .overrideProvider(UserFeedbackService)
      .useValue(mockUserFeedbackService)
      .compile();

    controller = module.get<UserFeedbackController>(UserFeedbackController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('patchUserFeedback', () => {
    it('should return an updated user feedback', async () => {
      const userFeedback = await controller.patchUserFeedback(mockUserFeedback);
      expect(mockUserFeedbackService.updateUserFeedback).toHaveBeenCalledTimes(
        1,
      );
      expect(mockUserFeedbackService.updateUserFeedback).toHaveBeenCalledWith(
        mockUserFeedback,
      );
      expect(userFeedback).toEqual([mockUserFeedback]);
    });

    it('should return a BadRequestException', async () => {
      jest
        .spyOn(mockUserFeedbackService, 'updateUserFeedback')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.patchUserFeedback(mockUserFeedback),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
