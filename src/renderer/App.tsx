import React, { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { useSnackbar } from 'notistack';

import { routes } from './constants/routes';
import { LOADING_TYPE } from './constants';
import { RoutesPath } from './constants/route-paths';
import { UserContext } from './context/user.context';
import { TokenContext } from './context/token.context';
import { socket, SocketContext } from './context/socket.context';
import UserService from './services/UserService';
import { isMobile } from './helpers/isMobile';
import { getRandomInteger } from './helpers/getRandomInt';
import { addToken, clearToken, getToken } from './helpers/local-storage/token';
import { RouteObject, User, USER_ROLE } from './interfaces';
import Loader from './components/Loader';
import Drawer from './components/Drawer';
import Navbar from './components/Navbar';
import DidYouKnow from './components/DidYouKnow';
import GuestRoute from './components/route-wrapper/GuestRoute';
import AdminRoute from './components/route-wrapper/AdminRoute';
import IrregularVerbsTime from './components/IrrgularVerbsTime';
import ProtectedRoute from './components/route-wrapper/ProtectedRoute';

import facts from './assets/files/facts.json';
import irregularVerbs from './assets/files/irregular-verbs.json';
import { getType } from './helpers/local-storage/loadingType';
import { getSymbolCount } from './helpers/local-storage/didYouKnowSymbolCount';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getTheme, saveTheme } from './helpers/theme';

import './i18n';
import { config } from './config';

const lessThan100 = facts.filter((f) => f.body.length < 100);
const randomFact = lessThan100[getRandomInteger(0, lessThan100.length - 1)];
const randomIrregularVerb =
  irregularVerbs[getRandomInteger(0, irregularVerbs.length - 1)];

const initStartScreenType = () => {
  const type = getType() ?? LOADING_TYPE.MIXED;
  if (type === LOADING_TYPE.MIXED) {
    return Math.random() > 0.5
      ? LOADING_TYPE.IRREGULAR_VERBS
      : LOADING_TYPE.DID_YOU_KNOW;
  }
  return type;
};

const type = initStartScreenType();
const symbolCount = getSymbolCount();

function App() {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [hide, setHide] = useState(false);
  const [open, setOpen] = useState(false);

  const [dark, setDark] = useState<boolean>(true);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(() => {
    if (dark) {
      return createTheme({
        palette: {
          mode: 'dark',
          primary: {
            light: '#D3D3D3',
            main: '#696969',
            dark: '#282828',
          },
          secondary: {
            main: '#1e1e1e',
          },
          background: {
            default: '#212121',
          },
          text: {
            primary: '#fff',
          },
        },
      });
    }

    return createTheme({
      palette: {
        mode: 'light',
        secondary: {
          main: '#a09aff',
        },
      },
    });
  }, [dark]);

  useEffect(() => {
    const savedTheme = getTheme();
    if (savedTheme) {
      return setDark(savedTheme === 'dark');
    }
    if (prefersDarkMode) {
      setDark(true);
    }
  }, [prefersDarkMode]);

  const isAuthorized = !!user;

  const removeToken = () => {
    clearToken();
    setToken(null);
  };

  const updateToken = (token: string) => {
    addToken(token);
    setToken(token);
  };

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (
          error.response.status === 401 &&
          error.response.data?.message === 'INVALID_TOKEN'
        ) {
          removeToken();
          return enqueueSnackbar('Token is expired, please login again', {
            variant: 'error',
          });
        }
        if (
          error.response.status === 401 &&
          error.response.data?.message === 'ADMIN_ROLE_REQUIRED'
        ) {
          return enqueueSnackbar('Admin role only', {
            variant: 'error',
          });
        }
        if (error.response.status === 401) {
          return Promise.reject(error);
        }
        enqueueSnackbar('Something went wrong, try again later', {
          variant: 'error',
        });
        return Promise.reject(error);
      },
    );
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return setLoading(false);
    }

    setLoading(true);
    const time = Date.now();
    const readTime =
      type === LOADING_TYPE.DID_YOU_KNOW
        ? (randomFact.body.length / (symbolCount ? +symbolCount : 15)) * 1000
        : 3000;
    UserService.getMe<User>()
      .then((data) => setUser(data))
      .catch(() => removeToken())
      .finally(() => {
        let timeReadLeft = readTime - (Date.now() - time);
        // if (process.env.NODE_ENV === 'development') {
        timeReadLeft = 0;
        // }
        setTimeout(() => setLoading(false), Math.max(timeReadLeft, 0));
      });
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }
    socket.io.opts.query = { token: getToken() };
    socket.connect();
  }, [socket, token]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {type === LOADING_TYPE.DID_YOU_KNOW ? (
          <DidYouKnow fact={randomFact} />
        ) : (
          <IrregularVerbsTime verb={randomIrregularVerb} />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <UserContext.Provider value={{ user, updateUser: setUser }}>
          <TokenContext.Provider value={{ token, updateToken, removeToken }}>
            <CssBaseline />
            {isAuthorized && (
              <>
                <Navbar
                  onDarkModeSwitch={() => {
                    saveTheme(dark ? 'light' : 'dark');
                    setDark(!dark);
                  }}
                  darkMode={dark}
                  open={open}
                  toggleDrawer={() => {
                    setHide(false);
                    setOpen(true);
                  }}
                />
                <Drawer
                  open={open}
                  hide={hide}
                  onHide={setHide}
                  onOpen={setOpen}
                />
              </>
            )}
            <Box
              sx={{
                mt: isAuthorized ? (isMobile() ? '65px' : '75px') : 0,
                pb: 3,
                ml: hide || isMobile() ? 0 : '45px',
                minHeight: isAuthorized
                  ? isMobile()
                    ? 'calc(100vh - 65px)'
                    : 'calc(100vh - 75px)'
                  : '100vh',
              }}
            >
              <Routes>
                {routes.map((route) => {
                  const Wrapper = getRouteWrapper(route);
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<Wrapper key={route.path}>{route.page}</Wrapper>}
                    />
                  );
                })}
                <Route
                  path="*"
                  element={
                    <Navigate
                      to={
                        isAuthorized
                          ? RoutesPath.RECOGNIZE_IMAGE
                          : RoutesPath.LOGIN
                      }
                      replace
                    />
                  }
                />
              </Routes>
            </Box>
          </TokenContext.Provider>
        </UserContext.Provider>
      </SocketContext.Provider>
    </ThemeProvider>
  );
}

const getRouteWrapper = (route: RouteObject): any => {
  if (route.role === USER_ROLE.USER) {
    return ProtectedRoute;
  }
  if (route.role === USER_ROLE.ADMIN) {
    return AdminRoute;
  }
  return GuestRoute;
};

export default App;
