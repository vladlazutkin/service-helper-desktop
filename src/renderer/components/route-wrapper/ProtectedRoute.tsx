import React from 'react';
import { Navigate } from 'react-router-dom';
import { RoutesPath } from '../../constants/route-paths';
import { useUser } from '../../context/user.context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUser();

  const isAuthorized = !!user;

  if (!isAuthorized) {
    return <Navigate to={RoutesPath.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
