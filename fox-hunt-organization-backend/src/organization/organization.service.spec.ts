import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrganizationTypeEnum } from '../common/enums/OrganizationType.enum';
import { IOrganization } from '../common/interfaces/organization.interface';
import { OrganizationEntity } from '../common/entities/organization.entity';
import { UserFeedbackEntity } from '../common/entities/user-feedback.entity';
import { ActivateOrganizationDto } from './dto/activateOrganization.dto';
import { OrganizationService } from './organization.service';
import { OrganizationStatusEnum } from '../common/enums/OrganizationStatus.enum';
import { UpdateOrganizationDto } from './dto/updateOrganization.dto';
import { EntityManager } from 'typeorm';
import axios from 'axios';
import { createStubInstance } from 'sinon';
import * as typeorm from 'typeorm';
import * as typeorm_functions from 'typeorm/globals';
import { GatewayRequests } from '../common/requests/gateway.requests';
import {
  OrganizationResponse,
  OrgTrainersParams,
  UserRoles,
} from './interfaces/interfaces';
import { ExternalAuthService } from '../auth/externalAuth.service';
import { UserServiceRequests } from '../common/requests/userService.requests';
import { UserData } from 'src/common/requests/interfaces/user.interface';
import { OrganizationRepository } from './repository/organization.repository';
import { IUserFeedback } from 'src/common/interfaces/user-feedback.interface';

jest.mock('axios');

describe('OrganizationService', () => {
  let service: OrganizationService;

  const organizationMock: OrganizationEntity = {
    id: 4,
    name: 'Public Organization',
    legalAddress: 'Belarus',
    actualAddress: 'Minsk',
    organizationDomain: 'public',
    type: OrganizationTypeEnum.FREE,
    approximateEmployeesAmount: 1,
    status: OrganizationStatusEnum.NEW,
    created: '2022-08-09T14:51:51.899Z',
    lastStatusChange: '2022-08-09T14:51:51.899Z',
    system: false,
    userFeedback: [],
  };

  const userMock: any = {
    id: 1,
    firstName: 'Petya',
    lastName: 'Utochkin',
    dateOfBirth: '2000-02-01T17:25:00',
    country: 'Belarus',
    city: 'Minsk',
    email: '1123@gmail.com',
    roles: [
      {
        organizationId: 4,
        userId: 1,
        role: 'TRAINER',
      },
    ],
    activatedSince: '2020-06-24T20:35:20',
    completed: false,
    activated: true,
  };

  const mockFeedback: UserFeedbackEntity = {
    userFeedbackId: 1,
    comment: 'test comment',
    ranking: 1,
    sendDate: '1998-02-01T17:25:00.000Z',
    hasRead: false,
    organizationEntity: organizationMock,
    userId: userMock.id,
  };

  const mockOrganizationAdmin: UserData = {
    activated: true,
    email: 'test@gmail.com',
  };

  const organizationWithUserMock: OrganizationResponse = {
    ...organizationMock,
    rootUserEmail: mockOrganizationAdmin.email,
  };

  const mockUserFeedbackEntityRepository = {
    findAndCount: jest.fn().mockResolvedValue([[mockFeedback], 1]),
  };

  const mockExternalAuthService = {
    getPayloadHeader: jest.fn(),
  };

  const mockOrganizationRepository = {
    findAll: jest.fn().mockResolvedValue([organizationMock]),
    findByIds: jest.fn().mockResolvedValue([organizationMock]),
    findByLimit: jest.fn().mockResolvedValue([organizationMock]),
    findOneSystemOrganization: jest.fn().mockResolvedValue(organizationMock),
    findOneById: jest.fn().mockResolvedValue(organizationMock),
    saveOrganization: jest.fn().mockResolvedValue(organizationMock),
    findStatusOfOrganization: jest
      .fn()
      .mockResolvedValue(organizationMock.status),
    updateOrganization: jest.fn().mockResolvedValue(organizationMock),
    findOneByDomain: jest.fn().mockResolvedValue(organizationMock),
    createOrganizationEntity: jest.fn(),
  };

  const mockGatewayRequests = {
    activateOrganization: jest.fn(),
    deactivateOrganization: jest.fn(),
  };

  const mockUserServiceRequests = {
    getOrganizationAdmin: jest.fn().mockResolvedValue(mockOrganizationAdmin),
    getUsersByIds: jest.fn().mockResolvedValue([userMock]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: getRepositoryToken(UserFeedbackEntity),
          useValue: mockUserFeedbackEntityRepository,
        },
        {
          provide: ExternalAuthService,
          useValue: mockExternalAuthService,
        },
        {
          provide: OrganizationRepository,
          useValue: mockOrganizationRepository,
        },
        {
          provide: GatewayRequests,
          useValue: mockGatewayRequests,
        },
        {
          provide: UserServiceRequests,
          useValue: mockUserServiceRequests,
        },
      ],
    }).compile();
    service = module.get<OrganizationService>(OrganizationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    const page = 0;
    const size = undefined;
    const sort = undefined;
    const name = undefined;
    it('should return all organizations', async () => {
      const organizations: OrganizationEntity[] = await service.getAll();
      expect(mockOrganizationRepository.findAll).toHaveBeenCalledTimes(1);
      expect(organizations).toEqual([organizationMock]);
    });

    it('should return specified organizations', async () => {
      const idList: number[] = [1, 2];
      const organizations: OrganizationEntity[] = await service.getAll(
        sort,
        name,
        page,
        size,
        idList,
      );
      expect(mockOrganizationRepository.findByIds).toHaveBeenCalledTimes(1);
      expect(mockOrganizationRepository.findByIds).toHaveBeenCalledWith(idList);
      expect(organizations).toEqual([organizationMock]);
    });

    it('should list organizations by page and size', async () => {
      const pageNum = 0;
      const pageSize = 1;
      const organizations = await service.getAll(sort, name, pageNum, pageSize);
      expect(mockOrganizationRepository.findByLimit).toHaveBeenCalledTimes(1);
      expect(organizations).toEqual([organizationMock]);
    });

    it('should throw BadRequestException when page is defined and size is undefined', async () => {
      const pageNum = 1;
      const pageSize = undefined;
      await expect(
        service.getAll(sort, name, pageNum, pageSize),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findAll')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(service.getAll()).rejects.toThrow(Error);
    });
  });

  describe('getOrganizationsTrainers', () => {
    const role: UserRoles = 'TRAINER';
    const params: OrgTrainersParams = {
      page: 0,
      size: 10,
      roles: role,
    };

    it('should list organization trainers', async () => {
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: userMock });
      const trainers: any = await service.getOrganizationsTrainers(params);
      expect(mockExternalAuthService.getPayloadHeader).toHaveBeenCalledTimes(1);
      expect(trainers).toEqual(userMock);
    });

    it('should throw an error if axios throws an error', async () => {
      (axios.get as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('Exemplary error');
      });
      await expect(service.getOrganizationsTrainers(params)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if adminPortalService throws an error', async () => {
      jest
        .spyOn(mockExternalAuthService, 'getPayloadHeader')
        .mockImplementationOnce(() => {
          throw new Error(`Exemplary error`);
        });
      await expect(service.getOrganizationsTrainers(params)).rejects.toThrow(
        Error,
      );
    });
  });
  describe('getSystemOrganization', () => {
    it('should return system organization', async () => {
      const organization: OrganizationEntity =
        await service.getSystemOrganization();
      expect(
        mockOrganizationRepository.findOneSystemOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationRepository.findOneSystemOrganization,
      ).toHaveBeenCalledWith();
      expect(organization).toEqual(organizationMock);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneSystemOrganization')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });

      await expect(service.getSystemOrganization()).rejects.toThrow(Error);
    });
  });

  describe('findById', () => {
    const organizationId = 1;
    it('should return an organization', async () => {
      const organization: OrganizationResponse = await service.findById(
        organizationId,
      );
      expect(mockOrganizationRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockOrganizationRepository.findOneById).toHaveBeenCalledWith(
        organizationId,
      );
      expect(
        mockUserServiceRequests.getOrganizationAdmin,
      ).toHaveBeenCalledTimes(1);
      expect(organization).toEqual(organizationWithUserMock);
    });

    it('should throw http not found exception', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockResolvedValueOnce(null);

      await expect(service.findById(organizationId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });

      await expect(service.findById(organizationId)).rejects.toThrow(Error);
    });
  });

  describe('getByDomain', () => {
    const domain = 'public';
    it('should return an organization', async () => {
      const organization: OrganizationEntity = await service.getByDomain(
        domain,
      );
      expect(mockOrganizationRepository.findOneByDomain).toHaveBeenCalledTimes(
        1,
      );
      expect(mockOrganizationRepository.findOneByDomain).toHaveBeenCalledWith(
        domain,
      );
      expect(organization).toEqual(organizationMock);
    });

    it('should throw a NotFoundException if organization was not found', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneByDomain')
        .mockResolvedValueOnce(null);
      await expect(service.getByDomain(domain)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ForbiddenException if organization was deactivated', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneByDomain')
        .mockResolvedValueOnce({
          ...organizationMock,
          status: OrganizationStatusEnum.DEACTIVATED,
        });
      await expect(service.getByDomain(domain)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'findOneByDomain')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });

      await expect(service.getByDomain(domain)).rejects.toThrow(Error);
    });
  });

  describe('updateOrganization', () => {
    const organizationId = '1';
    const organizationDto: UpdateOrganizationDto = {
      name: 'testName',
      legalAddress: 'testAddress',
    };
    it('should return an organization', async () => {
      const organization: any = await service.updateOrganization(
        organizationId,
        organizationDto,
      );
      expect(
        mockOrganizationRepository.updateOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationRepository.updateOrganization,
      ).toHaveBeenCalledWith(organizationId, organizationDto);
      expect(organization).toEqual(organizationMock);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'updateOrganization')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });
      await expect(
        service.updateOrganization(organizationId, organizationDto),
      ).rejects.toThrow(Error);
    });
  });

  describe('getUserFeedbacks', () => {
    const userId = 1;
    const page = 0;
    const pageSize = 10;
    it('should return users feedbacks', async () => {
      const feedbacks: {
        content: IUserFeedback[];
        totalElements: number;
      } = await service.getUserFeedbacks(userId, page, pageSize);
      expect(
        mockUserFeedbackEntityRepository.findAndCount,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockUserFeedbackEntityRepository.findAndCount,
      ).toHaveBeenCalledWith({
        select: [
          'comment',
          'hasRead',
          'ranking',
          'sendDate',
          'userFeedbackId',
          'userId',
        ],
        relations: ['organizationEntity'],
        skip: page,
        take: pageSize,
        where: { organizationEntity: { id: userId } },
      });
      expect(feedbacks.content).toEqual([mockFeedback]);
      expect(feedbacks.totalElements).toEqual([mockFeedback].length);
    });

    it('should throw an error', async () => {
      jest
        .spyOn(mockUserFeedbackEntityRepository, 'findAndCount')
        .mockImplementationOnce(async () => {
          throw new Error('Exemplary error');
        });

      await expect(
        service.getUserFeedbacks(userId, page, pageSize),
      ).rejects.toThrow(Error);
    });
  });

  describe('createOrganization', () => {
    const organizationDto: IOrganization = {
      name: 'Public Organization',
      legalAddress: 'Belarus',
      actualAddress: 'Minsk',
      organizationDomain: 'public',
      type: OrganizationTypeEnum.FREE,
      rootUserEmail: 'test@test.com',
    };

    const connectionStub = createStubInstance(typeorm.Connection);
    jest
      .spyOn(typeorm_functions, 'getConnection')
      .mockReturnValue(connectionStub);
    const manager = new EntityManager(connectionStub);
    manager.save = jest.fn();
    const mockCreateQueryRunner = jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      release: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: manager,
    }));

    jest
      .spyOn(connectionStub, 'createQueryRunner')
      .mockReturnValue(mockCreateQueryRunner());

    it('should create an organization', async () => {
      const mockAxiosResponse = {
        id: 123,
        emails: organizationDto.rootUserEmail,
        roles: [
          { organizationId: null, userId: null, role: 'ORGANIZATION_ADMIN' },
        ],
        completed: false,
        activated: false,
      };
      (axios.post as jest.Mock).mockResolvedValueOnce(mockAxiosResponse);
      const result: void = await service.createOrganization(organizationDto);
      expect(typeorm_functions.getConnection).toHaveBeenCalledTimes(1);
      expect(connectionStub.createQueryRunner).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationRepository.createOrganizationEntity,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationRepository.createOrganizationEntity,
      ).toHaveBeenCalledWith(organizationDto);
      expect(manager.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(undefined);
    });

    it('should throw an error if getConnection throws an error', async () => {
      jest
        .spyOn(typeorm_functions, 'getConnection')
        .mockImplementationOnce(() => {
          throw new Error('Exemplary error');
        });

      await expect(service.createOrganization(organizationDto)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if organizationRepository throws an error', async () => {
      jest
        .spyOn(mockOrganizationRepository, 'createOrganizationEntity')
        .mockImplementationOnce(() => {
          throw new Error('Exemplary error');
        });

      await expect(service.createOrganization(organizationDto)).rejects.toThrow(
        Error,
      );
    });

    it('should throw a bad gateway exception', async () => {
      (axios.post as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Exemplary error');
      });
      await expect(service.createOrganization(organizationDto)).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('updateInitialOrganizationStatus', () => {
    it('should return the updated organization', async () => {
      const organizationId = 1;
      const organizationDto: ActivateOrganizationDto = {
        roles: [
          {
            userId: 1,
            organizationId: 1,
            role: 'ORGANIZATION_ADMIN',
          },
        ],
      };
      jest
        .spyOn(mockOrganizationRepository, 'findStatusOfOrganization')
        .mockResolvedValue({ status: 'NEW' });
      jest
        .spyOn(service, 'updateOrganizationStatus')
        .mockResolvedValue(organizationMock);
      const updatedOrganization: OrganizationEntity =
        await service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        );
      expect(
        mockOrganizationRepository.findStatusOfOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationRepository.findStatusOfOrganization,
      ).toHaveBeenCalledWith(organizationId);
      expect(service.updateOrganizationStatus).toHaveBeenCalledTimes(1);
      expect(service.updateOrganizationStatus).toHaveBeenCalledWith(
        organizationId,
        OrganizationStatusEnum.ACTIVE,
      );
      expect(updatedOrganization).toEqual(organizationMock);
    });

    it('should throw an error if user does not belong to the organization', async () => {
      const organizationId = 1;
      const organizationDto: ActivateOrganizationDto = {
        roles: [
          {
            userId: 1,
            organizationId: 2,
            role: 'ORGANIZATION_ADMIN',
          },
        ],
      };
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toThrow(HttpException);
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toHaveProperty('status', 401);
    });

    it('should throw an error if user is not a ORGANIZATION_ADMIN of the organization', async () => {
      const organizationId = 1;
      const organizationDto: ActivateOrganizationDto = {
        roles: [
          {
            userId: 1,
            organizationId: 1,
            role: 'TRAINER',
          },
        ],
      };
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toThrow(HttpException);
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toHaveProperty('status', 401);
    });

    it('should throw an error if organizations status is not NEW', async () => {
      const organizationId = 1;
      const organizationDto: ActivateOrganizationDto = {
        roles: [
          {
            userId: 1,
            organizationId: 1,
            role: 'ORGANIZATION_ADMIN',
          },
        ],
      };
      jest
        .spyOn(mockOrganizationRepository, 'findStatusOfOrganization')
        .mockImplementation(async () => {
          return { status: OrganizationStatusEnum.ACTIVE };
        });
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toThrow(HttpException);
      await expect(
        service.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toHaveProperty('status', 400);
    });
  });

  describe('updateOrganizationStatus', () => {
    it('should return the updated organization', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.DECLINED;
      const savedOrganization = {
        ...organizationMock,
        status,
      };
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockResolvedValue(organizationMock);
      jest
        .spyOn(mockOrganizationRepository, 'saveOrganization')
        .mockResolvedValue(savedOrganization);
      const updatedOrganization: OrganizationEntity =
        await service.updateOrganizationStatus(id, status);
      expect(mockOrganizationRepository.findOneById).toHaveBeenCalledTimes(1);
      expect(mockOrganizationRepository.findOneById).toHaveBeenCalledWith(id);
      expect(mockOrganizationRepository.saveOrganization).toHaveBeenCalledTimes(
        1,
      );
      expect(mockOrganizationRepository.saveOrganization).toHaveBeenCalledWith({
        ...organizationMock,
        status,
      });
      expect(updatedOrganization).toEqual(savedOrganization);
    });

    it('should throw NotFoundException if organization was not found', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.NEW;
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockImplementationOnce(async () => null);

      await expect(
        service.updateOrganizationStatus(id, status),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if organization status is the same', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.NEW;
      await expect(
        service.updateOrganizationStatus(id, status),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if organization is system', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.NEW;
      const organizationMock: OrganizationEntity = {
        id: 4,
        name: 'Public Organization',
        legalAddress: 'Belarus',
        actualAddress: 'Minsk',
        organizationDomain: 'public',
        type: OrganizationTypeEnum.FREE,
        approximateEmployeesAmount: 1,
        status: OrganizationStatusEnum.NEW,
        created: '2022-08-09T14:51:51.899Z',
        lastStatusChange: '2022-08-09T14:51:51.899Z',
        system: true,
        userFeedback: [],
      };
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockImplementationOnce(async () => organizationMock);
      await expect(
        service.updateOrganizationStatus(id, status),
      ).rejects.toThrow(BadRequestException);
    });

    it('should send request for activation if new status is ACTIVE and organizationAdmin is activated', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.ACTIVE;
      const organizationMock: OrganizationEntity = {
        id: 4,
        name: 'Public Organization',
        legalAddress: 'Belarus',
        actualAddress: 'Minsk',
        organizationDomain: 'public',
        type: OrganizationTypeEnum.FREE,
        approximateEmployeesAmount: 1,
        status: OrganizationStatusEnum.DEACTIVATED,
        created: '2022-08-09T14:51:51.899Z',
        lastStatusChange: '2022-08-09T14:51:51.899Z',
        system: false,
        userFeedback: [],
      };
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockImplementationOnce(async () => organizationMock);
      await service.updateOrganizationStatus(id, status);
      expect(
        mockUserServiceRequests.getOrganizationAdmin,
      ).toHaveBeenCalledTimes(1);
      expect(mockUserServiceRequests.getOrganizationAdmin).toHaveBeenCalledWith(
        id,
      );
      expect(mockGatewayRequests.activateOrganization).toHaveBeenCalledTimes(1);
      expect(mockGatewayRequests.activateOrganization).toHaveBeenCalledWith(id);
    });

    it('should change status to NEW if organizationAdmin was not activated', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.ACTIVE;
      const organizationMock: OrganizationEntity = {
        id: 4,
        name: 'Public Organization',
        legalAddress: 'Belarus',
        actualAddress: 'Minsk',
        organizationDomain: 'public',
        type: OrganizationTypeEnum.FREE,
        approximateEmployeesAmount: 1,
        status: OrganizationStatusEnum.DEACTIVATED,
        created: '2022-08-09T14:51:51.899Z',
        lastStatusChange: '2022-08-09T14:51:51.899Z',
        system: false,
        userFeedback: [],
      };
      jest
        .spyOn(mockOrganizationRepository, 'findOneById')
        .mockImplementationOnce(async () => organizationMock);
      jest
        .spyOn(mockUserServiceRequests, 'getOrganizationAdmin')
        .mockResolvedValue({ activated: false });
      await service.updateOrganizationStatus(id, status);
      expect(
        mockUserServiceRequests.getOrganizationAdmin,
      ).toHaveBeenCalledTimes(1);
      expect(mockUserServiceRequests.getOrganizationAdmin).toHaveBeenCalledWith(
        id,
      );
      expect(mockGatewayRequests.activateOrganization).toHaveBeenCalledTimes(0);
    });

    it('should send request for deactivation if new status is DEACTIVATED', async () => {
      const id = 1;
      const status = OrganizationStatusEnum.DEACTIVATED;
      await service.updateOrganizationStatus(id, status);
      expect(mockGatewayRequests.deactivateOrganization).toHaveBeenCalledTimes(
        1,
      );
      expect(mockGatewayRequests.deactivateOrganization).toHaveBeenCalledWith(
        id,
      );
    });
  });
});
