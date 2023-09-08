import BaseAPIService, { Body, Method } from './BaseAPIService';

class ChessSkinsService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }

  buy<T>(body: Body) {
    return this.request<T>('/buy', Method.post, body);
  }
}

export default new ChessSkinsService('/chess-skins');
