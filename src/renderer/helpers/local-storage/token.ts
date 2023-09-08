const TOKEN_KEY = 'APPLICATION_TOKEN';

export const getToken = () => {
  const tokenString = localStorage.getItem(TOKEN_KEY);
  if (!tokenString) {
    return null;
  }
  return tokenString;
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const addToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};
