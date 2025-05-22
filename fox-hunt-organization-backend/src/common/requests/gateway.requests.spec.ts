import MockAdapter from 'axios-mock-adapter';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { GatewayRequests } from './gateway.requests';
import { configService } from '../../config/config.service';

describe('GatewayRequests', () => {
  let service: GatewayRequests;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const apiGatewayUrl = 'http://localhost:8083/api/v1';
  const axiosConfig = {
    method: 'post',
    data: 'test_data',
    headers: { 'Content-Type': 'application/json' },
  };
  const authorizationResponse = {
    token: 'test_access_token',
    refreshToken: 'test_refresh_token',
    expiresInSeconds: '1800',
    tokenType: 'customToken',
  };

  jest.mock('../../config/config.service', () => ({
    getApiGatewayUrl: jest.fn().mockResolvedValue(apiGatewayUrl),
    getAdminAxiosConfig: jest.fn().mockResolvedValue(axiosConfig),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GatewayRequests],
    }).compile();
    service = module.get<GatewayRequests>(GatewayRequests);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('deactivateOrganization', () => {
    it('should deactivate organization if token is correct', async () => {
      const id = 1;
      mock
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .reply(200, 'test');
      await service.deactivateOrganization(id);
      expect(mock.history.post.length).toEqual(1);
      expect(mock.history.post[0].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
    });
    it('should send new request for token if first has 401 error', async () => {
      const id = 1;
      mock
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(401, 'Token was not validated')
        .onPost(
          `${configService.getApiGatewayUrl()}/login/authentication/system`,
        )
        .reply(201, authorizationResponse)
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(201);
      await service.deactivateOrganization(id);
      expect(mock.history.post.length).toEqual(3);
      expect(mock.history.post[0].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
      expect(mock.history.post[0].headers['Authorization']).toEqual(
        'Bearer undefined',
      );
      expect(mock.history.post[1].url).toEqual(
        `${configService.getApiGatewayUrl()}/login/authentication/system`,
      );
      expect(mock.history.post[1].data).toEqual(
        JSON.stringify(configService.getOrganizationServiceAuthData()),
      );
      expect(mock.history.post[2].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
      expect(mock.history.post[2].headers['Authorization']).toEqual(
        `Bearer ${authorizationResponse.token}`,
      );
    });
    it('should throw exeption if first request to gateway failed with not 401 error', async () => {
      const id = 1;
      mock
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(409, 'Conflict error');
      await expect(service.deactivateOrganization(id)).rejects.toHaveProperty(
        'status',
        409,
      );
      expect(mock.history.post.length).toEqual(1);
      expect(mock.history.post[0].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
    });

    it('should throw exeption if login request failed', async () => {
      const id = 1;
      mock
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(401, 'Token was not validated')
        .onPost(
          `${configService.getApiGatewayUrl()}/login/authentication/system`,
        )
        .reply(409, 'Conflict error');
      await expect(service.deactivateOrganization(id)).rejects.toHaveProperty(
        'status',
        409,
      );
      expect(mock.history.post.length).toEqual(2);
      expect(mock.history.post[0].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
      expect(mock.history.post[1].url).toEqual(
        `${configService.getApiGatewayUrl()}/login/authentication/system`,
      );
    });

    it('should throw exeption if second request to gateway failed', async () => {
      const id = 1;
      mock
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(401, 'Token was not validated')
        .onPost(
          `${configService.getApiGatewayUrl()}/login/authentication/system`,
        )
        .reply(201, authorizationResponse)
        .onPost(
          `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
        )
        .replyOnce(401, 'Unauthorized');
      await expect(service.deactivateOrganization(id)).rejects.toHaveProperty(
        'status',
        401,
      );
      expect(mock.history.post.length).toEqual(3);
      expect(mock.history.post[2].url).toEqual(
        `${configService.getApiGatewayUrl()}/deactivation/organization/${id}`,
      );
    });
  });
});
