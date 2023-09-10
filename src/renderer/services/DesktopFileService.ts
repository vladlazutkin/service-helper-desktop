import BaseAPIService, { Method, Body } from './BaseAPIService';

class DesktopFileService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }

  create<T>(body: Body) {
    return this.request<T>('/', Method.post, body);
  }

  remove<T>(id: string) {
    return this.request<T>(`/${id}`, Method.delete);
  }
}

export default new DesktopFileService('/files');
