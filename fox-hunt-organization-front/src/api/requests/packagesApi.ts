import {
  organizationPackagesApiInstance,
  packagesApiInstance,
} from '../ApiInstances';
import {
  OrganizationPackage,
  Package,
  UpdateOrganizationPackage,
} from '../../types/Packages';

const packagesApi = {
  getAllOrganizationPackages: () =>
    organizationPackagesApiInstance.get<OrganizationPackage[]>(''),
  getAllPackages: () =>
    packagesApiInstance.get<Package[]>('/system?accessType=SHARED'),
  updateOrganizationPackage: (updatePackage: UpdateOrganizationPackage) =>
    organizationPackagesApiInstance.patch<UpdateOrganizationPackage>(
      '',
      updatePackage,
    ),
};

export default packagesApi;
