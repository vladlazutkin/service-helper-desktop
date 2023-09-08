import BaseAPIService, { Body, Method } from './BaseAPIService';

class GoogleService extends BaseAPIService {
  login<T>(body: Body) {
    return this.request<T>('/login', Method.post, body);
  }
}

export default new GoogleService('/auth/google');
