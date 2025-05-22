import { Injectable } from '@nestjs/common';
import { DeactivatedOrganizationsRepository } from '../common/repositories/deactivated-organizations.repository';
import { configService } from '../config/config.service';

@Injectable()
export class DeactivationService {
  constructor(
    private deactivatedOrganizationsRepository: DeactivatedOrganizationsRepository,
  ) {}

  public async deactivateOrganization(organizationId: number): Promise<void> {
    await this.deactivatedOrganizationsRepository.deactivateOrganization(
      organizationId,
    );
  }

  public async activateOrganization(organizationId: number): Promise<void> {
    await this.deactivatedOrganizationsRepository.activateOrganization(
      organizationId,
    );
  }

  public async deleteExpiredDeactivationRecords(): Promise<void> {
    const minDate = new Date(
      Date.now() - +configService.getTokenExpirationTime(),
    );

    await this.deactivatedOrganizationsRepository.deleteRecordsByTokenExpirationTime(
      minDate,
    );
  }

  public async isOrganizationDeactivated(
    organizationId: number,
  ): Promise<boolean> {
    return (
      (await this.deactivatedOrganizationsRepository.getRecord(organizationId))
        .length > 0
    );
  }
}
