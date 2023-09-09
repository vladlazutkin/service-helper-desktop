import io, { Socket } from 'socket.io-client';
import React, { useContext } from 'react';
import { getToken } from '../helpers/local-storage/token';
import { config } from '../config';

export const socket = io(config.REACT_APP_BACKEND_URL, {
  query: { token: getToken() },
  autoConnect: false,
});
export const SocketContext = React.createContext<Socket>({} as Socket);

export const useSocket = () => {
  return useContext(SocketContext);
};
