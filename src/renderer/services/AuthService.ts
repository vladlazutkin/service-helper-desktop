import BaseAPIService, { Body, Method } from './BaseAPIService';

class AuthService extends BaseAPIService {
  login<T>(body: Body) {
    return this.request<T>('/login', Method.post, body);
  }

  register<T>(body: Body) {
    return this.request<T>('/register', Method.post, body);
  }

  loginSpotify<T>() {
    return this.request<T>('/login-spotify', Method.get);
  }
}

export default new AuthService('/auth');
