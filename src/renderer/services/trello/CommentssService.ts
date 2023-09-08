import BaseAPIService, { Body, Method } from '../BaseAPIService';

class CommentsService extends BaseAPIService {
  getListForCard<T>(cardId: string) {
    return this.request<T>(`/${cardId}`, Method.get);
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

export default new CommentsService('/trello/comments');
