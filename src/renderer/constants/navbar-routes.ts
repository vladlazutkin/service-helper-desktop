import { RoutesPath } from './route-paths';
import { NavbarRoute, USER_ROLE } from '../interfaces';
import i18n from 'renderer/i18n';

export const createNavbarRoutes = (): NavbarRoute[] => [
  {
    path: RoutesPath.PROFILE,
    title: i18n.t('navbar.menu.profile'),
    role: USER_ROLE.USER,
  },
  {
    path: RoutesPath.SKINS,
    title: i18n.t('navbar.menu.skins'),
    role: USER_ROLE.USER,
  },
  {
    path: RoutesPath.ACHIEVEMENTS,
    title: i18n.t('navbar.menu.achievements'),
    role: USER_ROLE.USER,
  },
  {
    path: RoutesPath.ADMIN_PANEL,
    title: i18n.t('navbar.menu.adminPanel'),
    role: USER_ROLE.ADMIN,
  },
  {
    path: RoutesPath.SETTINGS,
    title: i18n.t('navbar.menu.settings'),
    role: USER_ROLE.USER,
  },
];
