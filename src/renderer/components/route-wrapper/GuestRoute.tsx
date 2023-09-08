import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import { useUser } from '../../context/user.context';

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user } = useUser();

  const isAuthorized = !!user;

  if (isAuthorized) {
    return <Navigate to={RoutesPath.RECOGNIZE_IMAGE} replace />;
  }

  return children;
};

export default GuestRoute;
