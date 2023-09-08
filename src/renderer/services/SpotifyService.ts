import BaseAPIService, { Body, Method } from './BaseAPIService';

class SpotifyService extends BaseAPIService {
  search<T>(body: Body) {
    return this.request<T>('/search', Method.post, body);
  }

  createPlaylist<T>(body: Body) {
    return this.request<T>('/create-playlist', Method.post, body);
  }
}

export default new SpotifyService('/spotify');
