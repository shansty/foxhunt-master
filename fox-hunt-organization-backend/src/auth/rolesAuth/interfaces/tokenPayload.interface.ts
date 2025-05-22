import { Role } from '../enums/role.enum';

export interface TokenPayloadDto {
  email: string;
  roles: Role[];
  organizationId?: number;
}
