import translation from '../i18n/translations/en.json';

export interface PaginationResponse<T> {
  data: T[];
  total: number;
}

export interface Achievement {
  _id: string;
  title: string;
  avatar: string;
  description: string;
  total: number;
  current: number;
}

export interface Notification {
  _id: string;
  title: string;
  description: string;
}

export interface NotificationSubscription {
  _id: string;
  endpoint: string;
  expirationTime?: number;
  keys: {
    auth: string;
    p256dh: string;
  };
  email: string;
}

export interface TikTokDownload {
  video?: {
    noWatermark: string;
  };
  images?: [{ url: string }];
}

interface SearchResult {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
    small_s3: string;
  };
}

export interface ImageSearchResult {
  total: number;
  results: SearchResult[];
}

declare module 'react-i18next' {
  interface Resources {
    translation: typeof translation;
  }
}

declare global {
  interface Window {
    google: any;
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      REACT_APP_BACKEND_URL: string;
      REACT_APP_GOOGLE_CLIENT_ID: string;
      REACT_APP_STRIPE_KEY: string;
    }
  }
}
