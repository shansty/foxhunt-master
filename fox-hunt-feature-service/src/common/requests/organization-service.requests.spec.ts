import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationServiceRequests } from './organization-service.requests';
import axios from 'axios';
import { ExternalAuthService } from 'src/auth/externalAuth.service';

jest.mock('axios');

const domainMock = 'localhost';

jest.mock('../../config/config.service', () => ({
  configService: {
    getOrganizationServiceUrl: jest.fn().mockImplementation(() => domainMock),
  },
}));

describe('OrganizationServiceRequests', () => {
  let service: OrganizationServiceRequests;

  const organizationMock: any = {
    id: 4,
    name: 'Public Organization',
  };

  const externalAuthServiceMock = {
    getPayloadHeader: jest.fn(),
  };

  const name = '';
  const order = 'id';
  const sort = 'asc';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationServiceRequests,
        {
          provide: ExternalAuthService,
          useValue: externalAuthServiceMock,
        },
      ],
    }).compile();
    service = await module.resolve<OrganizationServiceRequests>(
      OrganizationServiceRequests,
    );
    jest.clearAllMocks();
  });

  it('should return organization data', async () => {
    (axios as unknown as jest.Mock).mockResolvedValueOnce({
      data: [organizationMock],
    });
    const result = await service.getOrganizations();
    expect(externalAuthServiceMock.getPayloadHeader).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith(`${domainMock}/organizations`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        payload: undefined,
      },
    });
    expect(axios).toHaveBeenCalled();
    expect(result).toEqual([organizationMock]);
  });

  it('should throw an exception', async () => {
    jest
      .spyOn(externalAuthServiceMock, 'getPayloadHeader')
      .mockImplementation(() => {
        throw new Error(`Exemplary error`);
      });

    await expect(service.getOrganizations()).rejects.toThrow(Error);
  });
});
