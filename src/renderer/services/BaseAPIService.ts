import axios from 'axios';
import { getToken } from '../helpers/local-storage/token';
import { config } from '../config';

export enum Method {
  get = 'GET',
  post = 'POST',
  delete = 'DELETE',
  update = 'UPDATE',
  put = 'PUT',
  patch = 'PATCH',
}

export type Body = Record<string, any> | FormData;

export const baseUrl = `${config.REACT_APP_BACKEND_URL}/api/v1`;

class BaseAPIService {
  constructor(private readonly serviceUrl: string) {}

  async request<T>(
    url: string,
    method: Method,
    body?: Body,
    customHeaders?: { [name: string]: string | undefined },
  ): Promise<T> {
    try {
      const { data } = await axios<T>({
        url: this.buildUrl(url),
        method,
        data: body,
        headers: this.getHeaders(body instanceof FormData, customHeaders),
      });

      return data;
    } catch (e) {
      throw e;
    }
  }

  private buildUrl(url: string) {
    return `${baseUrl}${this.serviceUrl}${url}`;
  }

  private getHeaders(
    isFormData: boolean,
    customHeaders?: { [name: string]: string | undefined },
  ) {
    const token = getToken();

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
      ...customHeaders,
    };
  }
}

export default BaseAPIService;
