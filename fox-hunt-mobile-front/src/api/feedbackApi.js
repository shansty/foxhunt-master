import axios from 'axios';
import { PORT, BASE_URL } from '@env';
import { authorisationHeadersInterceptor } from './utils/authorisationHeadersInterceptor';

const feedbackApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/user-feedbacks`,
});
feedbackApi.interceptors.request.use(authorisationHeadersInterceptor);

export { feedbackApi };
