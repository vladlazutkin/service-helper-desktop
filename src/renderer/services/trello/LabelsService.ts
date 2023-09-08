import BaseAPIService, { Body, Method } from '../BaseAPIService';

class LabelsService extends BaseAPIService {
  getListForBoard<T>(boardId: string) {
    return this.request<T>(`/${boardId}`, Method.get);
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

export default new LabelsService('/trello/labels');
