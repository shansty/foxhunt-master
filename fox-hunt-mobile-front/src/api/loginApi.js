import axios from 'axios';
import { PORT, BASE_URL } from '@env';

const loginApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/login`,
});

export default loginApi;
