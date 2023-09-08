import { LOADING_TYPE } from '../../constants';

const LOADING_TYPE_KEY = 'LOADING_TYPE';

export const getType = (): LOADING_TYPE | null => {
  if (localStorage.getItem(LOADING_TYPE_KEY)) {
    return localStorage.getItem(LOADING_TYPE_KEY) as LOADING_TYPE;
  }
  return null;
};

export const saveType = (value: string) =>
  localStorage.setItem(LOADING_TYPE_KEY, value);
