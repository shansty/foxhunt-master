import { organizationsApiInstance } from '../ApiInstances';
import { Organization, OrganizationStatus } from '../../types/Organization';
import { Feedbacks } from '../../types/Feedback';

type Id = number;
type Domain = string;

const organizationsApi = {
  getAll: () => organizationsApiInstance.get<Organization[]>(''),
  create: (organization: Organization) =>
    organizationsApiInstance.post('', organization),
  domainExists: (domain: Domain) =>
    organizationsApiInstance.get(`/${domain}/exists`),
  findById: (id: Id) => organizationsApiInstance.get<Organization>(`/${id}`),
  patch: (organization: Partial<Organization>, id?: Id) =>
    organizationsApiInstance.patch<Organization>(`/${id}`, organization),
  getUserFeedbacksByOrganizationId: (
    id: Id,
    params: { [key: string]: string | number },
  ) =>
    organizationsApiInstance.get<Feedbacks>(`/${id}/user-feedback`, { params }),
  getSystemOrganization: () => organizationsApiInstance.get('/system'),
  changeOrganizationStatus: (id: Id, status: OrganizationStatus) =>
    organizationsApiInstance.put(`/${id}/status`, { status }),
};

export default organizationsApi;
