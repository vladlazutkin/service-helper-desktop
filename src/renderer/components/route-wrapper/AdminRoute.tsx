import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import { useUser } from '../../context/user.context';
import { USER_ROLE } from '../../interfaces';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useUser();

  const isAuthorized = !!user;
  const isAdmin = isAuthorized && user.role === USER_ROLE.ADMIN;

  if (!isAuthorized) {
    return <Navigate to={RoutesPath.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={RoutesPath.RECOGNIZE_IMAGE} replace />;
  }

  return children;
};

export default AdminRoute;
