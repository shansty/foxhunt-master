import { Role } from '../auth/rolesAuth/enums/role.enum';
import axios from 'axios';
import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationEntity } from '../common/entities/organization.entity';
import { OrganizationRepository } from './repository/organization.repository';
import { getConnection, Repository } from 'typeorm';
import { IOrganization } from '../common/interfaces/organization.interface';
import { UserFeedbackEntity } from '../common/entities/user-feedback.entity';
import { configService } from '../config/config.service';
import {
  ISortData,
  OrganizationResponse,
  OrgTrainersParams,
} from './interfaces/interfaces';
import { OrganizationStatusEnum } from '../common/enums/OrganizationStatus.enum';
import { ActivateOrganizationDto } from './dto/activateOrganization.dto';
import { GatewayRequests } from '../common/requests/gateway.requests';
import { ExternalAuthService } from '../auth/externalAuth.service';
import { UserServiceRequests } from '../common/requests/userService.requests';
import { UserData } from '../common/requests/interfaces/user.interface';
import { UpdateOrganizationDto } from './dto/updateOrganization.dto';
import { Order } from '../common/enums/Order.enum';
import { Sort } from '../common/enums/Sort.enum';
import { IUser } from 'src/common/interfaces/user.interface';
import { IUserFeedback } from 'src/common/interfaces/user-feedback.interface';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(
    private organizationRepository: OrganizationRepository,
    @InjectRepository(UserFeedbackEntity)
    private userFeedbackRepository: Repository<UserFeedbackEntity>,
    private externalAuthService: ExternalAuthService,
    private gatewayRequests: GatewayRequests,
    private userServiceRequest: UserServiceRequests,
  ) { }

  async getAll(
    sort: ISortData = [Sort.ID, Order.ASC],
    name = '',
    page = 0,
    size?: number | undefined,
    ids?: number[],
  ): Promise<OrganizationEntity[]> {
    let organizations: OrganizationEntity[];
    if (ids) {
      organizations = await this.organizationRepository.findByIds(ids);
      this.logger.debug(
        `The number of retrieved organizations: ${organizations.length}`,
      );
      return organizations;
    }
    if (page !== 0 && !size)
      throw new BadRequestException('Size need to be specified with page');
    if (page === 0 && !size) {
      organizations = await this.organizationRepository.findAll(
        name,
        sort[0],
        sort[1],
      );
    } else {
      organizations = await this.organizationRepository.findByLimit(
        page,
        size,
        name,
        sort[0],
        sort[1],
      );
    }
    this.logger.debug(
      `The number of retrieved organizations: ${organizations.length}`,
    );
    return organizations;
  }

  private async sendInvitation(
    organization: OrganizationEntity,
    email: string,
  ) {
    const authenticationPayload: string =
      await this.externalAuthService.getPayloadHeader();
    const { data } = await axios.post(
      `${configService.getAdminUrl()}/user-invitations/organization-admin`,
      {
        emails: [email],
        organization,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          payload: authenticationPayload,
        },
      },
    );
    return data;
  }

  async createOrganization(organization: IOrganization): Promise<void> {
    const connection = getConnection();

    const queryRunner = connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const organizationEntity: OrganizationEntity =
        this.organizationRepository.createOrganizationEntity(organization);
      await queryRunner.manager.save(organizationEntity);

      try {
        await this.sendInvitation(
          organizationEntity,
          organization.rootUserEmail,
        );
      } catch (err) {
        throw new BadGatewayException(
          err,
          'Invitation service is not available',
        );
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findById(id: number): Promise<OrganizationResponse> {
    const organization: OrganizationEntity =
      await this.organizationRepository.findOneById(id);
    if (!organization) {
      throw new NotFoundException(`Organization with id: ${id} doesn't exist`);
    }
    // const organizationAdmin: UserData =
    //   await this.userServiceRequest.getOrganizationAdmin(id);
    return { ...organization, rootUserEmail: 'shirochina16@gmail.com' };
  }

  async getOrganizationsTrainers(params: OrgTrainersParams) {
    const payload: string = await this.externalAuthService.getPayloadHeader();
    const { data } = await axios.get(`${configService.getAdminUrl()}/users`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        payload,
      },
    });
    return data;
  }

  async getByDomain(domain: string): Promise<OrganizationEntity> {
    const organization = await this.organizationRepository.findOneByDomain(
      domain,
    );
    if (!organization) {
      throw new NotFoundException(
        `Organization of provided domain does not exist`,
      );
    }
    if (organization.status === OrganizationStatusEnum.DEACTIVATED)
      throw new ForbiddenException(
        'This organization was deactivated, please contact the administrator',
      );
    return organization;
  }

  async updateOrganization(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<OrganizationEntity[]> {
    return this.organizationRepository.updateOrganization(id, organization);
  }

  getSystemOrganization() {
    return this.organizationRepository.findOneSystemOrganization();
  }

  async getUserFeedbacks(
    id: number,
    page: number,
    pageSize: number,
  ): Promise<{ content: IUserFeedback[]; totalElements: number }> {
    const userFeedbacks: [UserFeedbackEntity[], number] =
      await this.userFeedbackRepository.findAndCount({
        select: [
          'comment',
          'hasRead',
          'ranking',
          'sendDate',
          'userFeedbackId',
          'userId',
        ],
        relations: ['organizationEntity'],
        where: { organizationEntity: { id } },
        skip: page * pageSize,
        take: pageSize,
      });
    const userIds: number[] = [
      ...new Set(
        userFeedbacks[0].map((feedback) => {
          return feedback.userId;
        }),
      ),
    ];
    const users: IUser[] = userIds.length
      ? await this.userServiceRequest.getUsersByIds(userIds)
      : [];
    const feedbacksWithUsers: IUserFeedback[] = userFeedbacks[0].map(
      (feedback) => {
        const user: IUser = users.find((user) => {
          return user.userId == feedback.userId;
        });
        return { ...feedback, user: user };
      },
    );
    return {
      content: feedbacksWithUsers,
      totalElements: userFeedbacks[1],
    };
  }

  async updateInitialOrganizationStatus(
    id: number,
    organization: ActivateOrganizationDto,
  ): Promise<OrganizationEntity> {
    let isAdmin = false;
    let doesBelongToOrganization = false;
    for (const role of organization.roles) {
      if (role.organizationId === id) doesBelongToOrganization = true;
      if (role.organizationId === id && role.role === Role.Admin)
        isAdmin = true;
    }
    if (!doesBelongToOrganization)
      throw new HttpException(
        `The user does not belong to current organization.`,
        HttpStatus.UNAUTHORIZED,
      );
    if (!isAdmin)
      throw new HttpException(
        `The user is not an admin of the organization.`,
        HttpStatus.UNAUTHORIZED,
      );

    const { status } =
      await this.organizationRepository.findStatusOfOrganization(id);

    if (status !== OrganizationStatusEnum.NEW) {
      throw new HttpException(
        `Can not activate organization without NEW status`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.updateOrganizationStatus(id, OrganizationStatusEnum.ACTIVE);
  }

  async updateOrganizationStatus(
    id: number,
    status: OrganizationStatusEnum,
  ): Promise<OrganizationEntity> {
    const organization: OrganizationEntity =
      await this.organizationRepository.findOneById(id);
    if (!organization)
      throw new NotFoundException(
        `The organization with ID ${id} was not found`,
      );
    if (organization.system)
      throw new BadRequestException(
        'Can not change status of system organization',
      );

    if (status === organization.status) {
      throw new BadRequestException(`Organization is already ${status}.`);
    }

    if (status === OrganizationStatusEnum.DEACTIVATED) {
      await this.gatewayRequests.deactivateOrganization(id);
    }
    if (
      status === OrganizationStatusEnum.ACTIVE &&
      organization.status !== OrganizationStatusEnum.NEW
    ) {
      const organizationAdmin: UserData =
        await this.userServiceRequest.getOrganizationAdmin(id);
      if (organizationAdmin.activated) {
        await this.gatewayRequests.activateOrganization(id);
      } else {
        status = OrganizationStatusEnum.NEW;
      }
    }
    return await this.organizationRepository.saveOrganization({
      ...organization,
      status,
    });
  }
}
