import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { configService } from '../../config/config.service';
import { ExternalAuthService } from '../../auth/externalAuth.service';
import { UserData } from './interfaces/user.interface';
import { UserServiceRequests } from './userService.requests';

jest.mock('axios');

describe('UserServiceRequests', () => {
  let service: UserServiceRequests;

  const mockPayloadHeader = 'test_payload';
  const mockExternalAuthService = {
    getPayloadHeader: jest.fn().mockResolvedValue(mockPayloadHeader),
  };
  const mockUser: UserData = { activated: true, email: 'test@gmail.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserServiceRequests,
        {
          provide: ExternalAuthService,
          useValue: mockExternalAuthService,
        },
      ],
    }).compile();
    service = module.get<UserServiceRequests>(UserServiceRequests);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrganizationAdmin', () => {
    it('should return admin of organization', async () => {
      const organizationId = 1;
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: mockUser,
      });
      const organizationAdmin = await service.getOrganizationAdmin(
        organizationId,
      );
      expect(mockExternalAuthService.getPayloadHeader).toHaveBeenCalledTimes(1);
      expect(axios.get as jest.Mock).toHaveBeenCalledTimes(1);
      expect(axios.get as jest.Mock).toHaveBeenCalledWith(
        `${configService.getAdminUrl()}/users/admin?organizationId=${organizationId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            payload: mockPayloadHeader,
          },
        },
      );
      expect(organizationAdmin).toEqual(mockUser);
    });
  });
});
