import { config } from '../config';

export const getImg = (url: string) => {
  if (url.includes('http')) {
    return url;
  }
  return `${config.REACT_APP_BACKEND_URL}/${url}`;
};
