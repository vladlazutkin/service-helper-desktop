import BaseAPIService, { Method } from './BaseAPIService';

class UserService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }
}

export default new UserService('/achievements');
