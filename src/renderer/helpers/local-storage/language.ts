const KEY = 'LANGUAGE';

export const getLang = (): string | null => {
  if (localStorage.getItem(KEY)) {
    return localStorage.getItem(KEY);
  }
  return null;
};

export const saveLang = (value: string) => localStorage.setItem(KEY, value);
