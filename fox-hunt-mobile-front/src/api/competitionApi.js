import axios from 'axios';
import { PORT, BASE_URL } from '@env';
import { authorisationHeadersInterceptor } from './utils/authorisationHeadersInterceptor';

const competitionApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/competitions`,
});
competitionApi.interceptors.request.use(authorisationHeadersInterceptor);

const activeCompetitionApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/active-competitions`,
});
activeCompetitionApi.interceptors.request.use(authorisationHeadersInterceptor);

export { competitionApi, activeCompetitionApi };
