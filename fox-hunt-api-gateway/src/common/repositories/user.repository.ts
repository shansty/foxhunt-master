import { HttpException, Injectable, BadGatewayException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, MoreThan } from 'typeorm';
import { OrganizationEntity } from '../entities/organization.entity';
import { OrganizationUserRoleEntity } from '../entities/organizationUserRole.entity';
import { UserEntity } from '../entities/user.entity';
import { UserInvitationEntity } from '../entities/userInvitation.entity';
import { AppUser } from '../interfaces/appUser.interface';
import { compare, genSalt, hash } from 'bcryptjs';
import {
  saltRounds,
  publicOrganizationId,
  participantEmailTemplateInvitationId,
  participantRoleId,
  msInDay,
} from '../constants/commonConstants';
import { AxiosService } from '../services/axios.service';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrganizationUserRoleEntity)
    private organizationUserRoleRepository: Repository<OrganizationUserRoleEntity>,
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
    @InjectRepository(UserInvitationEntity)
    private userInvitationeRepository: Repository<UserInvitationEntity>,
    private readonly connection: Connection,
    private axiosService: AxiosService,
  ) {}

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  public async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { appUserId: id },
    });
  }

  public async authenticateUser(
    email: string,
    domain: string,
    password: string,
  ): Promise<AppUser> {
    const organization = await this.organizationRepository.findOne({
      where: {
        organizationDomain: domain,
      },
    });
    if (!organization)
      throw new HttpException('The provided credentials are incorrect', 401);

    const user: UserEntity = await this.userRepository
      .createQueryBuilder('app_user')
      .leftJoinAndSelect('app_user.organizationUserRoles', 'organizationRole')
      .leftJoinAndSelect('organizationRole.role', 'role')
      .where('email = :email', { email: email })
      .andWhere('organizationRole.isActive = true')
      .andWhere('organizationRole.organization_id = :org_id', {
        org_id: organization.organization_id,
      })
      .getOne();
    if (!user)
      throw new HttpException('The provided credentials are incorrect', 401);
    const isMatch = await compare(password, user.password);
    if (!isMatch)
      throw new HttpException('The provided credentials are incorrect', 401);

    const roles: string[] = user.organizationUserRoles.map((userRole) => {
      return userRole.role.role;
    });
    return {
      email: user.email,
      organizationId: organization.organization_id,
      roles: roles,
    };
  }

  public async createUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    birthDate: string,
    country: string,
    city: string,
  ): Promise<{ userId: number }> {
    const foundUser: UserEntity = await this.findUserByEmail(email);
    if (foundUser)
      throw new HttpException('The provided user already exists', 409);
    password = password
    const salt: string = await genSalt(saltRounds);
    const hashedPassword: string = await hash(password, salt);

    //TBD move transaction logic to separate class BasicTransaction
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userEntity: UserEntity = this.userRepository.create({
        email: "shirochina16@gmail.com",
        password: hashedPassword,
        isActivated: true,
        firstName: "Anastasiya",
        lastName: "Shyrochyna",
        birthDate,
        country: "Poland",
        city: "Warsaw",
      });
      const newUser: UserEntity = await queryRunner.manager.save(userEntity);

      const organizationUserRoleEntity: OrganizationUserRoleEntity =
        this.organizationUserRoleRepository.create({
          role_id: participantRoleId,
          userId: newUser.appUserId,
          organizationId: publicOrganizationId,
          isActive: false,
        });
      await queryRunner.manager.save(organizationUserRoleEntity);

      const token: string = uuidv4();

      const invitationCreationDate: Date = new Date();

      const newInvitationEntity: UserInvitationEntity =
        this.userInvitationeRepository.create({
          userId: newUser.appUserId,
          organizationId: publicOrganizationId,
          startDate: invitationCreationDate,
          endDate: new Date(invitationCreationDate.getTime() + msInDay),
          token,
          emailTemplateId: participantEmailTemplateInvitationId,
          status: 'NEW',
        });

      await queryRunner.manager.save(newInvitationEntity);

      // const { data } = await this.axiosService.sendAxiosRequest(
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: {
      //       verificationCode: token.substring(0, 6),
      //       toEmailAddresses: email,
      //     },
      //   },
      //   `https://${process.env.AMAZON_SES_URL}/production/sendMail`,
      // );

      // if (data?.statusCode === 502)
      //   throw new BadGatewayException(data?.body?.message);

      await queryRunner.commitTransaction();
      return {
        userId: newUser.appUserId,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(err);
    } finally {
      await queryRunner.release();
    }
  }

  public async activateUser(id: number, token: string): Promise<AppUser> {
    const userInvitation: UserInvitationEntity =
      await this.userInvitationeRepository.findOne({
        where: {
          userId: id,
          organizationId: publicOrganizationId,
          status: 'NEW',
          endDate: MoreThan(new Date().toISOString()),
        },
      });

    if (!userInvitation)
      throw new HttpException('The provided credentials are incorrect', 401);

    if (userInvitation?.token?.substring(0, 6) !== token)
      throw new HttpException('The provided code is incorrect', 401);

    //TBD move transaction logic to separate class BasicTransaction
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      userInvitation.status = 'ACCEPTED';
      await queryRunner.manager.save(userInvitation);

      const user = await this.findUserById(id);
      user.isActivated = true;
      await queryRunner.manager.save(user);

      await queryRunner.manager
        .createQueryBuilder()
        .update(OrganizationUserRoleEntity)
        .set({ isActive: true })
        .where('user_id = :user_id', { user_id: id })
        .andWhere('organization_id = :organization_id', {
          organization_id: publicOrganizationId,
        })
        .andWhere('role_id = :role_id', { role_id: participantRoleId })
        .execute();

      await queryRunner.commitTransaction();
      return {
        email: user.email,
        organizationId: publicOrganizationId,
        roles: ['PARTICIPANT'],
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
