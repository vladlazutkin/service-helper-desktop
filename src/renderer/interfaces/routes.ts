import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { RoutesPath } from '../constants/route-paths';
import { USER_ROLE } from './users';
import React from 'react';

export interface DrawerRoute {
  icon?: OverridableComponent<SvgIconTypeMap> & { muiName: string };
  path: RoutesPath;
  title: string;
  children?: DrawerRoute[];
}

export interface NavbarRoute {
  path: RoutesPath;
  title: string;
  role: USER_ROLE;
}

export interface RouteObject {
  path: RoutesPath;
  role: USER_ROLE | null;
  page: React.ReactNode;
}
