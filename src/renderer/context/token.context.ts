import React, { useContext } from 'react';

interface TokenContextProps {
  updateToken: (token: string) => void;
  removeToken: () => void;
  token: string | null;
}

export const TokenContext = React.createContext<TokenContextProps>(
  {} as TokenContextProps
);

export const useToken = () => {
  return useContext(TokenContext);
};
