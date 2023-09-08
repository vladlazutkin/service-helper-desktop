import React, { useContext } from 'react';
import { User } from '../interfaces';

interface UserContextProps {
  user: User | null;
  updateUser: (user: User) => void;
}

export const UserContext = React.createContext<UserContextProps>(
  {} as UserContextProps
);

export const useUser = () => {
  return useContext(UserContext);
};
