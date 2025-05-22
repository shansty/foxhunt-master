import axios from "axios";
import { PORT, BASE_URL } from '@env';
import { authorisationHeadersInterceptor } from "./utils/authorisationHeadersInterceptor";

const helpContentApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/help-content`,
});
helpContentApi.interceptors.request.use(authorisationHeadersInterceptor);

export default helpContentApi;
