const KEY = 'OPEN_DRAWER_ON_MOUSE';

export const getOpenDrawerOnMouse = (): boolean | null => {
  if (localStorage.getItem(KEY)) {
    return localStorage.getItem(KEY) === '1';
  }
  return null;
};

export const saveOpenDrawerOnMouse = (value: string) =>
  localStorage.setItem(KEY, value);
