const KEY = 'USER_THEME';

export const getTheme = (): string | null => {
  if (localStorage.getItem(KEY)) {
    return localStorage.getItem(KEY);
  }
  return null;
};

export const saveTheme = (value: string) => localStorage.setItem(KEY, value);
