import { LOADING_TYPE } from '../../constants';

const KEY = 'SYMBOL_COUNT';

export const getSymbolCount = (): LOADING_TYPE | null => {
  if (localStorage.getItem(KEY)) {
    return localStorage.getItem(KEY) as LOADING_TYPE;
  }
  return null;
};

export const saveSymbolCount = (value: string) =>
  localStorage.setItem(KEY, value);
