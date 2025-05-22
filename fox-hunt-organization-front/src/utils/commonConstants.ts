import { Organization, OrganizationFormType } from '../types/Organization';
import { User } from '../types/RootUser';
import { organizationStatusEnum } from '../utils/enums';

export const LOCAL_DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export const REQUIRED_FIELD = 'Required field';

export const ACCEPT_ONLY_LETTERS = 'Only English letters allowed';

export const FOXHUNT_ORG_MANAGEMENT = 'Foxhunt Org Management';

export const FOXHUNT_ORG_MANAGEMENT_PORTAL = 'Foxhunt Org Management portal';

export const USER_INVITATION_LOCAL_DATE_FORMAT = 'DD/MM/YYYY (HH:mm:ss)';

export const FIRST_NAME_MIN_LENGTH = 1;

export const LAST_NAME_MIN_LENGTH = 1;

export const CITY_NAME_MIN_LENGTH = 1;

export const INVALID_EMAIL = 'The email entered is invalid';

export const EMAIL_REGEX =
  // eslint-disable-next-line max-len
  /^(?=.{1,254}$)(?=.{1,64}@)[-!#&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;

export const DEFAULT_USER_FORM_VALUES: User = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  country: '',
  city: '',
  email: '',
};

export const DEFAULT_ORGANIZATION_FORM_VALUES: OrganizationFormType = {
  name: '',
  legalAddress: '',
  actualAddress: '',
  organizationDomain: '',
  rootUserEmail: '',
  approximateEmployeesAmount: '',
  type: '',
};

export const DEFAULT_ORGANIZATION: Organization = {
  name: '',
  legalAddress: '',
  actualAddress: '',
  organizationDomain: '',
  rootUserEmail: '',
  approximateEmployeesAmount: '',
  type: '',
  id: -1,
  status: organizationStatusEnum.NEW,
  lastStatusChange: '',
  created: '',
  system: false,
};

export const DEFAULT_LOGIN_FORM_VALUES = {
  email: '',
  password: '',
};

export const NO_DATA_DEFAULT_MESSAGE = 'Foxhunt has no such information';
