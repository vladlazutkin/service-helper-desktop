import BaseAPIService, { Body, Method } from '../BaseAPIService';

class BoardsService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }

  getById<T>(id: string) {
    return this.request<T>(`/${id}`, Method.get);
  }

  create<T>(body: Body) {
    return this.request<T>('/', Method.post, body);
  }

  edit<T>(id: string, body: Body) {
    return this.request<T>(`/${id}`, Method.patch, body);
  }

  remove<T>(id: string) {
    return this.request<T>(`/${id}`, Method.delete);
  }
}

export default new BoardsService('/trello/boards');
