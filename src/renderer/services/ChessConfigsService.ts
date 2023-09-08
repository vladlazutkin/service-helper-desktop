import BaseAPIService, { Method } from './BaseAPIService';

class ChessConfigsService extends BaseAPIService {
  get<T>() {
    return this.request<T>('/', Method.get);
  }

  edit<T>(skinId: string) {
    return this.request<T>(`/${skinId}`, Method.post);
  }
}

export default new ChessConfigsService('/chess-configs');
