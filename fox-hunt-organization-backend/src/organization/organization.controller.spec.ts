import {
  BadRequestException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationStatusEnum } from '../common/enums/OrganizationStatus.enum';
import { OrganizationEntity } from '../common/entities/organization.entity';
import { OrganizationTypeEnum } from '../common/enums/OrganizationType.enum';
import { ActivateOrganizationDto } from './dto/activateOrganization.dto';
import { OrganizationDto } from './dto/organization.dto';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UserFeedbackEntity } from '../common/entities/user-feedback.entity';
import { UpdateOrganizationDto } from './dto/updateOrganization.dto';
import { PayloadEntrails } from 'src/auth/rolesAuth/payload.decorator';
import {
  ExistingOrganizationResponse,
  OrganizationResponse,
} from './interfaces/interfaces';
import { ChangeStatusOfOrganizationDto } from './dto/changeStatusOfOrganization.dto';
import { PageSizeDto } from '../common/dto/pageSize.dto';
import { SortDataDto } from '../common/dto/sortData.dto';
import { Sort } from '../common/enums/Sort.enum';
import { Order } from '../common/enums/Order.enum';
import { IUserFeedback } from 'src/common/interfaces/user-feedback.interface';

describe('OrganizationController', () => {
  let controller: OrganizationController;

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

  const userFeedback: UserFeedbackEntity = {
    userFeedbackId: 1,
    comment: 'Good job',
    ranking: 1,
    sendDate: '2021-02-01T17:25:00.000Z',
    hasRead: false,
    organizationEntity: organizationMock,
    userId: 1,
  };

  const user: any = {
    id: 1,
    firstName: 'Harry',
    lastName: 'Potter',
    dateOfBirth: '1980-07-31T17:25:00',
    country: 'England',
    city: 'London',
    email: 'hpotter@gmail.com',
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

  const mockOrganizationService = {
    getAll: jest.fn().mockResolvedValue([organizationMock]),
    updateInitialOrganizationStatus: jest
      .fn()
      .mockResolvedValue(organizationMock),
    updateOrganizationStatus: jest.fn().mockResolvedValue(organizationMock),
    getOrganizationsTrainers: jest.fn().mockResolvedValueOnce([user]),
    getSystemOrganization: jest.fn().mockResolvedValue([organizationMock]),
    findById: jest.fn().mockResolvedValue(organizationMock),
    getByDomain: jest.fn().mockResolvedValue(organizationMock),
    createOrganization: jest.fn(),
    updateOrganization: jest.fn(),
    getUserFeedbacks: jest.fn().mockResolvedValue({
      content: [userFeedback],
      totalElements: [userFeedback].length,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      providers: [OrganizationService],
    })
      .overrideProvider(OrganizationService)
      .useValue(mockOrganizationService)
      .compile();

    controller = module.get<OrganizationController>(OrganizationController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    const query: PageSizeDto = {
      page: 0,
      size: undefined,
    };
    const name = '';
    const ids = undefined;
    const sortData: SortDataDto = { sort: [Sort.ID, Order.ASC] };
    it('should list all organizations', async () => {
      const organizations: OrganizationEntity[] = await controller.getAll(
        ids,
        query,
        name,
        sortData,
      );
      expect(mockOrganizationService.getAll).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.getAll).toHaveBeenCalledWith(
        sortData.sort,
        name,
        query.page,
        query.size,
        ids,
      );
      expect(organizations).toEqual([organizationMock]);
    });

    it('should throw a bad request exception', () => {
      jest.spyOn(mockOrganizationService, 'getAll').mockImplementation(() => {
        throw new Error(`Exemplary error`);
      });
      expect(() => controller.getAll(ids, query)).toThrow(BadRequestException);
    });

    it('should throw a http exception', () => {
      jest.spyOn(mockOrganizationService, 'getAll').mockImplementation(() => {
        throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
      });
      expect(() => controller.getAll(ids, query)).toThrow(HttpException);
    });
  });

  describe('getSystemOrganization', () => {
    it('should list system organizations', async () => {
      const organizations: OrganizationEntity =
        await controller.getSystemOrganization();
      expect(
        mockOrganizationService.getSystemOrganization,
      ).toHaveBeenCalledTimes(1);
      expect(organizations).toEqual([organizationMock]);
    });

    it('should throw a bad request exception', () => {
      jest
        .spyOn(mockOrganizationService, 'getSystemOrganization')
        .mockImplementation(() => {
          throw new Error(`Exemplary error`);
        });
      expect(() => controller.getSystemOrganization()).toThrow(
        BadRequestException,
      );
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getSystemOrganization')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(controller.getSystemOrganization()).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOrganizationById', () => {
    const organizationId = 1;
    it('should return a specific organization', async () => {
      const organization: OrganizationResponse =
        await controller.getOrganizationById(organizationId);
      expect(mockOrganizationService.findById).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.findById).toHaveBeenCalledWith(
        organizationId,
      );
      expect(organization).toEqual(organizationMock);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'findById')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.getOrganizationById(organizationId),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'findById')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(
        controller.getOrganizationById(organizationId),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('organizationExists', () => {
    const domain = 'public';
    it('should retrieve an organization', async () => {
      await controller.organizationExists(domain);
      expect(mockOrganizationService.getByDomain).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.getByDomain).toHaveBeenCalledWith(domain);
    });

    it('should throw error if organization was not found', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockResolvedValueOnce(null);
      await expect(controller.organizationExists(domain)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockResolvedValueOnce(null);
      await expect(controller.organizationExists(domain)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(controller.organizationExists(domain)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('getOrganizationIdByDomain', () => {
    const domain = 'public';
    it('should retrieve an organization', async () => {
      const organization: ExistingOrganizationResponse =
        await controller.getOrganizationIdByDomain(domain);
      expect(mockOrganizationService.getByDomain).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.getByDomain).toHaveBeenCalledWith(domain);
      expect(organization).toEqual(organizationMock);
    });

    it('should throw error if organization was not found', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockResolvedValueOnce(null);
      await expect(
        controller.getOrganizationIdByDomain(domain),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockResolvedValueOnce(null);
      await expect(
        controller.getOrganizationIdByDomain(domain),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getByDomain')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(
        controller.getOrganizationIdByDomain(domain),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('createOrganization', () => {
    const organizationDto: OrganizationDto = {
      actualAddress: 'Warsaw',
      approximateEmployeesAmount: 10,
      legalAddress: 'Poland',
      name: 'Test name',
      organizationDomain: 'public',
      rootUserEmail: 'abc@domain.com',
      type: OrganizationTypeEnum.FREE,
    };

    it('should create an organization', async () => {
      const organization: void = await controller.createOrganization(
        organizationDto,
      );
      expect(mockOrganizationService.createOrganization).toHaveBeenCalledTimes(
        1,
      );
      expect(mockOrganizationService.createOrganization).toHaveBeenCalledWith(
        organizationDto,
      );
      expect(organization).toEqual(undefined);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'createOrganization')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.createOrganization(organizationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'createOrganization')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(
        controller.createOrganization(organizationDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('patchOrganization', () => {
    const organizationId = '1';
    const organizationDto: UpdateOrganizationDto = {
      name: 'testName',
      legalAddress: 'testAddress',
    };
    it('should update an organization', async () => {
      const organization = await controller.patchOrganization(
        organizationId,
        organizationDto,
      );
      expect(mockOrganizationService.updateOrganization).toHaveBeenCalledTimes(
        1,
      );
      expect(mockOrganizationService.updateOrganization).toHaveBeenCalledWith(
        organizationId,
        organizationDto,
      );
      expect(organization).toEqual(undefined);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateOrganization')
        .mockImplementationOnce(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.patchOrganization(organizationId, organizationDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateOrganization')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(
        controller.patchOrganization(organizationId, organizationDto),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('getUserFeedbacksByOrganizationId', () => {
    const id = 1;
    const page = 0;
    const size = 10;
    it('should return feedbacks of a user', async () => {
      const feedbacks: {
        content: IUserFeedback[];
        totalElements: number;
      } = await controller.getUserFeedbacksByOrganizationId(id, page, size);
      expect(mockOrganizationService.getUserFeedbacks).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.getUserFeedbacks).toHaveBeenCalledWith(
        id,
        page,
        size,
      );
      expect(feedbacks.content).toEqual([userFeedback]);
      expect(feedbacks.totalElements).toEqual([userFeedback].length);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getUserFeedbacks')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.getUserFeedbacksByOrganizationId(id, page, size),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'getUserFeedbacks')
        .mockImplementationOnce(async () => {
          throw new HttpException(`Exemplary error`, HttpStatus.BAD_REQUEST);
        });
      await expect(
        controller.getUserFeedbacksByOrganizationId(id, page, size),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('updateInitialOrganizationStatus', () => {
    const organizationId = 1;
    const organizationDto: ActivateOrganizationDto = {
      roles: [
        {
          userId: 1,
          organizationId: 1,
          role: 'SYSTEM_ADMIN',
        },
      ],
    };

    it('should return an updated organization', async () => {
      const organization: OrganizationEntity =
        await controller.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        );
      expect(
        mockOrganizationService.updateInitialOrganizationStatus,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationService.updateInitialOrganizationStatus,
      ).toHaveBeenCalledWith(organizationId, organizationDto);
      expect(organization).toEqual(organizationMock);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateInitialOrganizationStatus')
        .mockImplementation(async () => {
          throw new HttpException(
            `The user does not belong to current organization.`,
            HttpStatus.UNAUTHORIZED,
          );
        });
      await expect(
        controller.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toThrow(HttpException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateInitialOrganizationStatus')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.updateInitialOrganizationStatus(
          organizationId,
          organizationDto,
        ),
      ).rejects.toHaveProperty('status', 400);
    });
  });

  describe('getCurrentOrganization', () => {
    const payload: PayloadEntrails = {
      email: 'alexander.belyaev@itechart-group.com',
      organizationId: 4,
      roles: ['TRAINER', 'SYSTEM_ADMIN'],
    };
    const organizationId = 4;

    it('should return an organization', async () => {
      const organization: OrganizationResponse =
        await controller.currentOrganization(payload);
      expect(mockOrganizationService.findById).toHaveBeenCalledTimes(1);
      expect(mockOrganizationService.findById).toHaveBeenCalledWith(
        organizationId,
      );
      expect(organization).toEqual(organizationMock);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'findById')
        .mockImplementationOnce(async () => {
          throw new HttpException(
            `Test HttpException`,
            HttpStatus.UNAUTHORIZED,
          );
        });
      await expect(controller.currentOrganization(payload)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'findById')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(controller.currentOrganization(payload)).rejects.toThrow(
        HttpException,
      );
      await expect(
        controller.currentOrganization(payload),
      ).rejects.toHaveProperty('status', 400);
    });
  });

  describe('updateOrganizationStatus', () => {
    const organizationId = 1;
    const changeStatusDto: ChangeStatusOfOrganizationDto = {
      status: OrganizationStatusEnum.ACTIVE,
    };

    it('should return an updated organization', async () => {
      const organization: OrganizationEntity =
        await controller.updateOrganizationStatus(
          organizationId,
          changeStatusDto,
        );
      expect(
        mockOrganizationService.updateOrganizationStatus,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockOrganizationService.updateOrganizationStatus,
      ).toHaveBeenCalledWith(organizationId, changeStatusDto.status);
      expect(organization).toEqual(organizationMock);
    });

    it('should throw a http exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateOrganizationStatus')
        .mockImplementation(async () => {
          throw new UnauthorizedException(`Test error`);
        });
      await expect(
        controller.updateOrganizationStatus(organizationId, changeStatusDto),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw a bad request exception', async () => {
      jest
        .spyOn(mockOrganizationService, 'updateOrganizationStatus')
        .mockImplementation(async () => {
          throw new Error(`Exemplary error`);
        });
      await expect(
        controller.updateOrganizationStatus(organizationId, changeStatusDto),
      ).rejects.toThrow(HttpException);
      await expect(
        controller.updateOrganizationStatus(organizationId, changeStatusDto),
      ).rejects.toHaveProperty('status', 400);
    });
  });
});
