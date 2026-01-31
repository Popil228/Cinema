import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';

interface ProtectedRouteProps {
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ adminOnly = false }) => {
  const auth = useContext(AuthContext);

  if (auth?.isLoading) {
    return <div>Завантаження...</div>; 
  }

  // Якщо користувач не авторизований — на логін
  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Якщо потрібен тільки адмін, а користувач не адмін — на головну
  // Поки без перевірки на адміна
  if (adminOnly && !auth.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
