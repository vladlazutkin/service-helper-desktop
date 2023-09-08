import BaseAPIService, { Method } from './BaseAPIService';

class ChessGamesService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }

  remove<T>(id: string) {
    return this.request<T>(`/${id}`, Method.delete);
  }
}

export default new ChessGamesService('/chess-games');
