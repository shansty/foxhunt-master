import { authApiInstance } from '../ApiInstances';

interface AuthCred {
  email: string;
  password: string;
}
interface AuthResp {
  token: string;
  refreshToken: string;
}

const authApi = {
  login: (cred: AuthCred) => {
    return authApiInstance.post<AuthResp>('/authentication/system', cred, {
      withCredentials: true,
    });
  },
  refreshToken: (refreshToken: string) =>
    authApiInstance.post<AuthResp>(`/refresh?refreshToken=${refreshToken}`),
  logout: (refreshToken: string) =>
    authApiInstance.post<AuthResp>(
      '/logout',
      { refreshToken: refreshToken },
      { withCredentials: true },
    ),
};

export default authApi;
