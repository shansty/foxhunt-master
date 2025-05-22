import { featureOrganizationApiInstance } from '../ApiInstances';
import {
  FeatureOrganization,
  UpdateFeatureOrganization,
} from '../../types/FeatureOrganization';

const featureOrganizationApi = {
  getAll: () => featureOrganizationApiInstance.get<FeatureOrganization[]>(''),
  patch: (features: UpdateFeatureOrganization) =>
    featureOrganizationApiInstance.post<any>('', features),
};

export default featureOrganizationApi;
