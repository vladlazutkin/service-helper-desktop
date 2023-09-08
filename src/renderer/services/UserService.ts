import BaseAPIService, { Body, Method } from './BaseAPIService';

class UserService extends BaseAPIService {
  getList<T>(params: Record<string, string>) {
    return this.request<T>(
      `/?${new URLSearchParams(params).toString()}`,
      Method.get
    );
  }

  switchToAdmin<T>(id: string) {
    return this.request<T>('/switch-admin', Method.post, { id });
  }

  delete<T>(id: string, what: string[]) {
    return this.request<T>(`/${id}`, Method.delete, { what });
  }

  getMe<T>() {
    return this.request<T>('/me', Method.get);
  }

  updateEmail<T>(body: Body) {
    return this.request<T>('/update-email', Method.post, body);
  }

  updatePassword<T>(body: Body) {
    return this.request<T>('/update-password', Method.post, body);
  }

  updateProfileIcon<T>(body: Body) {
    return this.request<T>('/update-profile-icon', Method.post, body);
  }
}

export default new UserService('/users');
