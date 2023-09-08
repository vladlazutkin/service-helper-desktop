import BaseAPIService, { Body, Method } from './BaseAPIService';

class NotificationsService extends BaseAPIService {
  getList<T>(params: Record<string, string>) {
    return this.request<T>(
      `/?${new URLSearchParams(params).toString()}`,
      Method.get
    );
  }

  getMySubscription<T>() {
    return this.request<T>('/me', Method.get);
  }

  create<T>(body: Body) {
    return this.request<T>('/', Method.post, body);
  }

  send<T>(body: Body) {
    return this.request<T>('/send', Method.post, body);
  }

  sendToId<T>(id: string, body: Body) {
    return this.request<T>(`/send/${id}`, Method.post, body);
  }

  remove<T>(id: string) {
    return this.request<T>(`/${id}`, Method.delete);
  }
}

export default new NotificationsService('/notification-subscriptions');
