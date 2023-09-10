import React, { useEffect, useState } from 'react';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import { useToken } from '../context/token.context';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar/AppBar';
import {
  Achievement,
  NavbarRoute,
  Notification,
  USER_ROLE,
} from '../interfaces';
import { RoutesPath } from '../constants/route-paths';
import { getImg } from '../helpers/getImg';
import { useUser } from '../context/user.context';
import { useSocket } from '../context/socket.context';
import { isMobile } from '../helpers/isMobile';
import { drawerWidth, openDrawerButtonId } from '../constants/sizes';
import { createNavbarRoutes } from '../constants/navbar-routes';
import { Switch, useTheme } from '@mui/material';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

interface NavbarProps {
  open: boolean;
  toggleDrawer: () => void;
  onDarkModeSwitch: () => void;
  darkMode: boolean;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open &&
    !isMobile() && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
}));

const Navbar = ({
  toggleDrawer,
  open,
  darkMode,
  onDarkModeSwitch,
}: NavbarProps) => {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );
  const [anchorElNotifications, setAnchorElNotification] =
    React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [navbarRoutes, setNavbarRoutes] =
    useState<NavbarRoute[]>(createNavbarRoutes);

  const { user } = useUser();
  const navigate = useNavigate();
  const theme = useTheme();
  const { removeToken } = useToken();
  const socket = useSocket();
  const { t } = useTranslation();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenNotificationsMenu = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotification(null);
  };

  const handleLogOut = () => {
    removeToken();
  };

  useEffect(() => {
    const onUpdateAchievement = (data: Achievement) => {
      const isDone = data.current >= data.total;
      if (!isDone) {
        return;
      }
      return setNotifications((prev) => [
        {
          _id: Date.now().toString(),
          title: isDone ? 'Achievement gained' : 'Achievement updated',
          description: isDone
            ? `Achievement ${data.title} gained. View on Achievement page`
            : `Achievement ${data.title} progressed. New progress: ${data.current} of ${data.total}`,
        },
        ...prev,
      ]);
    };
    if (socket.connected) {
      socket.on('achievement-update', onUpdateAchievement);
    } else {
      socket.on('connect', () => {
        socket.on('achievement-update', onUpdateAchievement);
      });
    }
  }, [socket]);

  const location = useLocation();
  const data = matchRoutes(
    Object.values(RoutesPath).map((value) => ({ path: value })),
    location,
  );
  const path = data ? data[0].route.path : '';

  useEffect(() => {
    i18next.on('languageChanged', () => setNavbarRoutes(createNavbarRoutes()));
  }, []);

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{ backgroundColor: theme.palette.secondary.main }}
    >
      <Toolbar>
        {!open && (
          <IconButton
            id={openDrawerButtonId}
            color="inherit"
            onClick={toggleDrawer}
            edge="start"
            sx={{
              mr: 2,
              pl: isMobile() ? '10px' : '4px',
            }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography
          className="title"
          variant="h6"
          component="div"
          sx={{
            fontSize: isMobile() ? '1rem' : '1.2rem',
            flexGrow: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {getTitle(path as RoutesPath)}
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flexGrow: 0 }}
        >
          <Switch checked={darkMode} onChange={onDarkModeSwitch} />
          <Badge badgeContent={notifications.length} color="success" max={99}>
            <IconButton onClick={handleOpenNotificationsMenu} edge="start">
              <NotificationsNoneIcon fontSize="medium" />
            </IconButton>
          </Badge>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              alt={user?.email ?? 'profile icon'}
              src={user?.profileIcon ? getImg(user.profileIcon) : undefined}
            />
          </IconButton>
          <Menu
            anchorEl={anchorElNotifications}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{ maxHeight: '460px' }}
            open={Boolean(anchorElNotifications)}
            onClose={handleCloseNotificationsMenu}
          >
            {!notifications.length && (
              <MenuItem
                sx={{ height: '50px' }}
                onClick={handleCloseNotificationsMenu}
              >
                <Typography textAlign="center">
                  No notifications here
                </Typography>
              </MenuItem>
            )}
            {notifications.map((n, i) => (
              <div key={n._id}>
                <MenuItem
                  sx={{ maxWidth: '400px', minWidth: '200px' }}
                  onClick={() => {
                    navigate(RoutesPath.ACHIEVEMENTS);
                    handleCloseNotificationsMenu();
                  }}
                >
                  <Stack alignItems="start">
                    <Typography textAlign="center">{n.title}</Typography>
                    <Typography
                      whiteSpace="break-spaces"
                      variant="body2"
                      color="text.secondary"
                    >
                      {n.description}
                    </Typography>
                  </Stack>
                </MenuItem>
                {i !== notifications.length - 1 && <Divider />}
              </div>
            ))}
          </Menu>
          <Menu
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {navbarRoutes.map((route) => {
              if (
                route.role === USER_ROLE.ADMIN &&
                user?.role !== USER_ROLE.ADMIN
              ) {
                return null;
              }
              return (
                <MenuItem
                  key={route.path}
                  onClick={() => {
                    navigate(route.path);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">{route.title}</Typography>
                </MenuItem>
              );
            })}
            <Divider />
            <MenuItem onClick={handleLogOut}>
              <Typography textAlign="center">
                {t('navbar.menu.logOut')}
              </Typography>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

const getTitle = (path: RoutesPath) => {
  const map = new Map<RoutesPath, string>([
    [RoutesPath.NOTES, 'Notes'],
    [RoutesPath.BOARDS, 'Trello boards'],
    [RoutesPath.AUDIO_TUNE, 'Audio Tune'],
    [RoutesPath.BOARD_BY_ID, 'Trello'],
    [RoutesPath.RECOGNIZE_IMAGE, 'Image recognize'],
    [RoutesPath.RECOGNIZE_VIDEO, 'Video recognize'],
    [RoutesPath.RECOGNIZE_VIDEO_BY_ID, 'Video recognize'],
    [RoutesPath.DOWNLOAD_IMAGE_FROM_CLIPBOARD, 'Download from clipboard'],
    [RoutesPath.DOWNLOAD_YOUTUBE_VIDEO, 'Youtube download'],
    [RoutesPath.DOWNLOAD_YOUTUBE_AUDIO, 'Youtube download audio'],
    [
      RoutesPath.DOWNLOAD_YOUTUBE_VIDEOS_FROM_PLAYLIST,
      'YT download videos from playlist',
    ],
    [RoutesPath.DOWNLOAD_TIK_TOK_VIDEO, 'TikTok download'],
    [RoutesPath.GAMES_CHESS, 'Chess'],
    [RoutesPath.GAMES_SAPPER, 'Sapper'],
    [RoutesPath.GAMES_CHESS_BY_ID, 'Chess'],
    [RoutesPath.GAMES_CHECKERS, 'Checkers'],
    [RoutesPath.GAMES_CUBELLO, 'Cubello'],
    [RoutesPath.GAMES_CUBCHIK, 'Cubchik'],
    [RoutesPath.GAMES_ARKANOID, 'Arkanoid'],
    [RoutesPath.GAMES_CALL, 'Call'],
    [RoutesPath.PROFILE, 'Profile'],
    [RoutesPath.GAMES_TERRARIA, 'Terraria'],
    [RoutesPath.ACHIEVEMENTS, 'Achievements'],
    [RoutesPath.GAMES, 'Games'],
    [RoutesPath.SKINS, 'Skins'],
    [RoutesPath.ADMIN_PANEL, 'Admin panel'],
    [RoutesPath.IMAGES, 'Images'],
    [RoutesPath.SETTINGS, 'Settings'],
    [RoutesPath.DESKTOP_MANAGEMENT, 'Desktop Management'],
  ]);

  return map.get(path) ?? 'Title';
};

export default Navbar;
