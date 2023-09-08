import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Base from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Divider from '@mui/material/Divider';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Tooltip from '@mui/material/Tooltip';
import { RoutesPath } from '../constants/route-paths';
import { drawerWidth, openDrawerButtonId } from '../constants/sizes';
import { createDrawerRoutes } from '../constants/drawer-routes';
import { isMobile } from '../helpers/isMobile';
import { DrawerRoute } from '../interfaces';
import i18next from 'i18next';
import { getOpenDrawerOnMouse } from '../helpers/local-storage/openDrawerOnMouse';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: theme.palette.secondary.main,
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: '55px',
  overflowX: 'hidden',
  backgroundColor: theme.palette.secondary.main,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const DrawerContainer = styled(Base)(({ theme, open }) => ({
  width: open ? drawerWidth : 0,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  whiteSpace: 'nowrap',
  ...(!isMobile() && {
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
}));

interface DrawerProps {
  open: boolean;
  onOpen: (open: boolean) => void;
  hide: boolean;
  onHide: (open: boolean) => void;
}

const Drawer = ({ open, onOpen, hide, onHide }: DrawerProps) => {
  const [openNested, setOpenNested] = useState<Record<string, boolean>>({
    [RoutesPath.GAMES]: false,
  });

  const [drawerRoutes, setDrawerRoutes] =
    useState<DrawerRoute[]>(createDrawerRoutes);

  const navigate = useNavigate();

  const toggleDrawer = () => {
    onOpen(!open);
  };

  const navigateTo = (to: string) => {
    onOpen(false);
    navigate(to);
  };

  const hasOpenNested = !!Object.values(openNested).find((open) => open);

  useEffect(() => {
    if (hasOpenNested) {
      onOpen(true);
    }
  }, [hasOpenNested]);

  useEffect(() => {
    if (!open) {
      setOpenNested({ [RoutesPath.GAMES]: false });
    }
  }, [open]);

  useEffect(() => {
    i18next.on('languageChanged', () => setDrawerRoutes(createDrawerRoutes));
  }, []);

  return (
    <ClickAwayListener
      onClickAway={(e) => {
        // @ts-ignore
        if (e.target?.closest(`#${openDrawerButtonId}`)) {
          return;
        }
        onOpen(false);
      }}
    >
      <DrawerContainer
        anchor="left"
        open={open}
        disableDiscovery
        variant={isMobile() ? 'temporary' : 'permanent'}
        onOpen={toggleDrawer}
        onClose={toggleDrawer}
        sx={{ visibility: hide ? 'hidden' : 'visible' }}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List
          sx={{ height: '100%' }}
          onMouseEnter={() => {
            if (getOpenDrawerOnMouse() ?? true) {
              onOpen(true);
            }
          }}
          onMouseLeave={() => {
            if (getOpenDrawerOnMouse() ?? true) {
              onOpen(false);
            }
          }}
        >
          {drawerRoutes.map((route) => {
            const expanded = openNested[route.path];
            const hasNested = !!route.children;

            return (
              <div key={route.path}>
                <ListItem disablePadding>
                  <Tooltip title={open ? null : route.title} placement="right">
                    <ListItemButton
                      onClick={(e) => {
                        if (hasNested) {
                          setOpenNested((prev) => ({
                            ...prev,
                            [route.path]: !expanded,
                          }));
                          return e.stopPropagation();
                        }
                        navigateTo(route.path);
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: '40px' }}>
                        {/*// @ts-ignore*/}
                        {<route.icon />}
                      </ListItemIcon>
                      <ListItemText
                        sx={{
                          opacity: open ? 1 : 0,
                          transition: 'opacity .3s ease-in-out',
                        }}
                        primary={route.title}
                      />
                      {!!route.children &&
                        (expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                {!!route.children && expanded && (
                  <List sx={{ ml: '20px' }}>
                    {route.children.map((route) => (
                      <ListItem key={route.path} disablePadding>
                        <ListItemButton onClick={() => navigateTo(route.path)}>
                          <ListItemIcon sx={{ minWidth: '40px' }}>
                            {/*// @ts-ignore*/}
                            {<route.icon />}
                          </ListItemIcon>
                          <ListItemText primary={route.title} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </div>
            );
          })}
        </List>
        {!open && (
          <IconButton
            sx={{
              minWidth: '55px',
              minHeight: '55px',
              mt: 'auto ',
              mr: 'auto',
            }}
            onClick={() => onHide(true)}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </DrawerContainer>
    </ClickAwayListener>
  );
};

export default Drawer;
