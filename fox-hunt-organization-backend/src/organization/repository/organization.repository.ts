import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationEntity } from '../../common/entities/organization.entity';
import { IOrganization } from '../../common/interfaces/organization.interface';
import { ILike, Repository } from 'typeorm';
import { UpdateOrganizationDto } from '../dto/updateOrganization.dto';

@Injectable()
export class OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationEntity)
    private organizationRepository: Repository<OrganizationEntity>,
  ) {}

  async findAll(
    name: string,
    sort: string,
    order: string,
  ): Promise<OrganizationEntity[]> {
    return await this.organizationRepository.find({
      where: [{ name: ILike(`%${name}%`) }],
      order: { [sort]: order },
    });
  }

  async findByLimit(
    page: number,
    pageSize: number,
    name: string,
    sort: string,
    order: string,
  ): Promise<OrganizationEntity[]> {
    return await this.organizationRepository.find({
      skip: page * pageSize,
      take: pageSize,
      where: [{ name: ILike(`%${name}%`) }],
      order: { [sort]: order },
    });
  }

  async findByIds(ids: number[]): Promise<OrganizationEntity[]> {
    return await this.organizationRepository.find({
      where: ids.map((id) => ({ id })),
    });
  }

  async findOneById(id: number): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOne(id);
  }

  async findOneByDomain(domain: string): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOne({
      where: {
        organizationDomain: domain,
      },
    });
  }

  async findOneSystemOrganization(): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOne({
      where: {
        system: true,
      },
    });
  }

  createOrganizationEntity(
    organization: IOrganization | UpdateOrganizationDto,
  ): OrganizationEntity {
    return this.organizationRepository.create(organization);
  }

  async updateOrganization(
    id: string,
    organization: UpdateOrganizationDto,
  ): Promise<any> {
    const queryResponse = await this.organizationRepository
      .createQueryBuilder()
      .update(OrganizationEntity, organization)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return queryResponse.raw[0];
  }

  async findStatusOfOrganization(id: number): Promise<OrganizationEntity> {
    return await this.organizationRepository.findOneOrFail({
      where: {
        id: id,
      },
      select: ['status'],
    });
  }

  async saveOrganization(
    organization: OrganizationEntity,
  ): Promise<OrganizationEntity> {
    return await this.organizationRepository.save(organization);
  }
}
