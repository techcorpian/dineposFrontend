// src/layouts/AuthLayout.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AuthLayout: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  // If the token exists, redirect to /home
  if (token) {
    return <Navigate to="/home" />;
  }

  return (
        <Outlet />
  );
};

export default AuthLayout;
