import axios from "axios";
import { PORT, BASE_URL } from '@env';

const tooltipApi = axios.create({
  baseURL: `${BASE_URL}:${PORT}/api/v1/tooltips`,
});

export default tooltipApi;
