import BaseAPIService, { Body, Method } from './BaseAPIService';

class VideoService extends BaseAPIService {
  getList<T>() {
    return this.request<T>('/', Method.get);
  }

  getById<T>(id: string) {
    return this.request<T>(`/${id}`, Method.get);
  }

  youtubeDownload<T>(body: Body) {
    return this.request<T>('/youtube/download', Method.post, body);
  }

  youtubeDownloadFromPlaylist<T>(body: Body) {
    return this.request<T>(
      '/youtube/download-videos-from-playlist',
      Method.post,
      body
    );
  }

  youtubeDownloadAudio<T>(body: Body) {
    return this.request<T>('/youtube/download-audio', Method.post, body);
  }

  tikTokDownload<T>(body: Body) {
    return this.request<T>('/tik-tok/download', Method.post, body);
  }

  youtubeCreateInfo<T>(body: Body) {
    return this.request<T>('/youtube/create-info', Method.post, body);
  }

  youtubeRecognize<T>(body: Body) {
    return this.request<T>('/youtube/recognize', Method.post, body);
  }

  remove<T>(id: string) {
    return this.request<T>(`/${id}`, Method.delete);
  }
}

export default new VideoService('/video');
