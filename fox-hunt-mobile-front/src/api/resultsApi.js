import axios from 'axios';
import { PORT, BASE_URL } from '@env';
import { authorisationHeadersInterceptor } from './utils/authorisationHeadersInterceptor';

const commandCompetitionResultsApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/competitions/results`,
});
commandCompetitionResultsApi.interceptors.request.use(authorisationHeadersInterceptor);

export default commandCompetitionResultsApi;
