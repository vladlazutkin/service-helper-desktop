import BaseAPIService, { Body, Method } from './BaseAPIService';

class ImagesService extends BaseAPIService {
  recognize<T>(body: Body) {
    return this.request<T>('/recognize', Method.post, body);
  }

  search<T>(params: Record<string, string>) {
    return this.request<T>(
      `/search?${new URLSearchParams(params).toString()}`,
      Method.get
    );
  }
}

export default new ImagesService('/image');
