import axios from 'axios';
import { PORT, BASE_URL } from '@env';
import { authorisationHeadersInterceptor } from './utils/authorisationHeadersInterceptor';

const usersApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/users`,
});
usersApi.interceptors.request.use(authorisationHeadersInterceptor);

export default usersApi;
