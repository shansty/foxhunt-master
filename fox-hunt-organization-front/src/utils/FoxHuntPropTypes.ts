import PropTypes from 'prop-types';
import { DEFAULT_ORGANIZATION } from './commonConstants';
import {
  organizationStatusEnum,
  organizationTypeEnum,
  userInvitationStatusEnum,
} from './enums';
import { enumStringToReadableFormat } from './utils';

// Prop types cannot be required here
export const user = {
  defaultProps: {
    id: null,
    firstName: '',
    lastName: '',
    dateOfBirth: new Date(),
    country: '',
    city: '',
    email: '',
    isActivated: null,
  },
  propTypes: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dateOfBirth: PropTypes.instanceOf(Date),
    country: PropTypes.string,
    city: PropTypes.string,
    email: PropTypes.string,
    isActivated: PropTypes.string,
  }),
};

export const organization = {
  defaultProps: DEFAULT_ORGANIZATION,
  propTypes: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    legalAddress: PropTypes.string,
    actualAddress: PropTypes.string,
    organizationDomain: PropTypes.string,
    rootUserEmail: PropTypes.string,
    approximateEmployeesAmount: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    type: PropTypes.oneOf([
      ...Object.values(organizationTypeEnum),
      ...Object.values(organizationTypeEnum).map((val) =>
        enumStringToReadableFormat(val),
      ),
      '',
    ]),
    status: PropTypes.oneOf(Object.values(organizationStatusEnum)),
    lastStatusChange: PropTypes.string,
    created: PropTypes.string,
    userFeedbacks: PropTypes.array,
  }),
};

export const credentials = {
  defaultProps: {
    email: '',
    password: '',
  },
  propTypes: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
  }),
};

export const userInvitation = {
  defaultProps: {
    userInvitationId: null,
    startDate: new Date(),
    endDate: new Date(),
    token: '',
    status: organizationStatusEnum.NEW,
    userEntity: user,
    organizationEntity: organization,
  },
  propTypes: PropTypes.shape({
    userInvitationId: PropTypes.number,
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    token: PropTypes.string,
    status: PropTypes.oneOf([...Object.values(userInvitationStatusEnum), '']),
    userEntity: PropTypes.object,
    organizationEntity: PropTypes.object,
  }),
};
