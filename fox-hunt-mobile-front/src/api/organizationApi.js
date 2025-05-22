import axios from 'axios';
import { PORT, BASE_URL } from '@env';

export default axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/organizations`,
});
