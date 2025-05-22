import { featuresApiInstance } from '../ApiInstances';
import { Feature } from '../../types/Feature';

type Id = number;

const featuresApi = {
  getAll: () => {
    return featuresApiInstance.get<Feature[]>('');
  },
  patch: (feature: Partial<Feature>, id?: Id) =>
    featuresApiInstance.patch<Feature>(`/${id}`, feature),
};

export default featuresApi;
