import PropTypes from 'prop-types';
import {
  geoTypeEnum,
  locationPackageCreationTypeEnum,
  locationPackageTypeEnum,
} from './enums';
import { DEFAULT_CENTER_COORDINATES } from 'src/constants/mapConst';

// Prop types cannot be required here
/* eslint-disable react/forbid-foreign-prop-types */
export const user = {
  defaultProps: {
    activated: null,
    city: '',
    country: '',
    dateOfBirth: new Date(),
    email: '',
    firstName: '',
    id: null,
    lastName: '',
  },
  propTypes: PropTypes.shape({
    activatedSince: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    dateOfBirth: PropTypes.string,
    email: PropTypes.string,
    firstName: PropTypes.string,
    id: PropTypes.number,
    isActivated: PropTypes.string,
    lastName: PropTypes.string,
  }),
};

export const organization = {
  defaultProps: {
    actualAddress: '',
    approximateEmployeesNumber: '',
    contactEmail: '',
    legalAddress: '',
    name: '',
    organizationDomain: '',
    rootUserEmail: '',
  },
  propTypes: PropTypes.shape({
    actualAddress: PropTypes.string,
    approximateEmployeesNumber: PropTypes.number,
    contactEmail: PropTypes.string,
    legalAddress: PropTypes.string,
    name: PropTypes.string,
    organizationDomain: PropTypes.string,
    rootUserEmail: PropTypes.string,
  }),
};

export const location = {
  defaultProps: {
    center: DEFAULT_CENTER_COORDINATES,
    coordinates: [],
    createdBy: { firstName: '', lastName: '' },
    description: '',
    forbiddenAreas: [],
    global: false,
    id: null,
    name: '',
    updatedBy: { firstName: '', lastName: '' },
    zoom: 10,
  },
  propTypes: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    createdBy: PropTypes.object,
    description: PropTypes.string,
    global: PropTypes.bool,
    id: PropTypes.number,
    name: PropTypes.string,
    updatedBy: PropTypes.object,
    zoom: PropTypes.number,
  }),
};

export const locationPackage = {
  defaultProps: {
    accessType: locationPackageTypeEnum.SYSTEM,
    assignmentType: locationPackageCreationTypeEnum.LIST_BASED,
    center: DEFAULT_CENTER_COORDINATES,
    coordinates: [],
    createdBy: { firstName: '', lastName: '' },
    creationDate: '',
    description: '',
    exactAreaMatch: true,
    locations: [],
    name: '',
    updateDate: '',
    updatedBy: { firstName: '', lastName: '' },
    zoom: 10,
  },
  propTypes: PropTypes.shape({
    accessType: PropTypes.oneOf([
      ...Object.values(locationPackageTypeEnum),
      '',
    ]),
    assignmentType: PropTypes.oneOf([
      ...Object.values(locationPackageCreationTypeEnum),
      '',
    ]),
    center: PropTypes.oneOfType(
      [PropTypes.array, PropTypes.object],
      PropTypes.arrayOf(PropTypes.number),
    ),
    coordinates: PropTypes.oneOfType(
      [PropTypes.array, PropTypes.object],
      PropTypes.arrayOf(PropTypes.number),
    ),
    createdBy: PropTypes.object,
    creationDate: PropTypes.string,
    description: PropTypes.string,
    exactAreaMatch: PropTypes.bool,
    locationPackageId: PropTypes.number,
    name: PropTypes.string,
    updatable: PropTypes.bool,
    updateDate: PropTypes.string,
    updatedBy: PropTypes.object,
    zoom: PropTypes.number,
  }),
};

export const geo = {
  defaultProps: {
    coordinates: [],
    type: geoTypeEnum.POLYGON,
  },
  propTypes: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    type: PropTypes.oneOf([...Object.values(geoTypeEnum), '']),
  }),
};

export const distanceType = {
  defaultProps: {
    distanceLength: 0,
    id: null,
    maxNumberOfFox: 0,
    name: '',
  },
  propTypes: PropTypes.shape({
    distanceLength: PropTypes.number,
    id: PropTypes.number,
    maxNumberOfFox: PropTypes.number,
    name: PropTypes.string,
  }),
};

export const foxPoint = {
  defaultProps: {
    coordinates: null,
    id: null,
    index: 0,
    label: '',
  },
  propTypes: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
    id: PropTypes.number,
    index: PropTypes.number,
    label: PropTypes.string,
  }),
};

export const competition = {
  defaultProps: {
    actualStartDate: null,
    coach: null,
    createdBy: null,
    createdDate: null,
    distanceType: null,
    expectedCompetitionDuration: null,
    finishPoint: null,
    foxAmount: 0,
    foxDuration: 0,
    foxRange: 3000,
    foxPoints: null,
    frequency: 0,
    hasSilenceInterval: false,
    id: null,
    isPrivate: false,
    location: null,
    name: '',
    notes: '',
    participants: null,
    startDate: null,
    startPoint: null,
    status: '',
    updatedDate: null,
    foxoringEnabled: false,
  },
  propTypes: PropTypes.shape({
    actualStartDate: PropTypes.string,
    coach: user.propTypes,
    createdBy: user.propTypes,
    createdDate: PropTypes.string,
    distanceType: distanceType.propTypes,
    expectedCompetitionDuration: PropTypes.string,
    finishPoint: PropTypes.arrayOf(PropTypes.number),
    foxAmount: PropTypes.number,
    foxDuration: PropTypes.number,
    foxRange: PropTypes.number,
    foxPoints: PropTypes.arrayOf(foxPoint.propTypes),
    frequency: PropTypes.number,
    hasSilenceInterval: PropTypes.bool,
    id: PropTypes.number,
    isPrivate: PropTypes.bool,
    location: location.propTypes,
    name: PropTypes.string,
    notes: PropTypes.string,
    participants: PropTypes.arrayOf(user.propTypes),
    startDate: PropTypes.string,
    startPoint: PropTypes.arrayOf(PropTypes.number),
    status: PropTypes.string,
    updatedDate: PropTypes.string,
    foxoringEnabled: PropTypes.bool,
  }),
};
