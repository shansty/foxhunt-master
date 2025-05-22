import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeactivatedOrganizationEntity } from '../entities/deactivatedOrganization.entity';

@Injectable()
export class DeactivatedOrganizationsRepository {
  private readonly logger = new Logger(DeactivatedOrganizationsRepository.name);
  constructor(
    @InjectRepository(DeactivatedOrganizationEntity)
    private deactivatedOrganizationRepository: Repository<DeactivatedOrganizationEntity>,
  ) {}

  public async deactivateOrganization(organizationId: number): Promise<void> {
    await this.deactivatedOrganizationRepository.delete({ organizationId });
    await this.deactivatedOrganizationRepository.insert({
      organizationId,
      creationDate: new Date(),
    });
    this.logger.log(
      `Organization with organizationId = ${organizationId} was deactivated`,
    );
  }

  public async activateOrganization(organizationId: number): Promise<void> {
    await this.deactivatedOrganizationRepository.delete({ organizationId });
    this.logger.log(
      `Organization with organizationId = ${organizationId} was activated`,
    );
  }

  public async deleteRecordsByTokenExpirationTime(
    minDate: Date,
  ): Promise<{ affected?: number }> {
    const result = await this.deactivatedOrganizationRepository
      .createQueryBuilder()
      .delete()
      .from(DeactivatedOrganizationEntity)
      .where('created_date < :start_at', {
        start_at: minDate,
      })
      .execute();
    this.logger.verbose(
      `Organizations were deleted from deactivated_organizations_table: ${result.affected} items`,
    );
    return result;
  }

  public async getRecord(
    organizationId: number,
  ): Promise<DeactivatedOrganizationEntity[]> {
    const deactivatedOrganization =
      await this.deactivatedOrganizationRepository.find({
        where: { organizationId },
      });
    if (deactivatedOrganization)
      this.logger.verbose(`Organization with id = ${organizationId} was found`);
    return deactivatedOrganization;
  }
}
