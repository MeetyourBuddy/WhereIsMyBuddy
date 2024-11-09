import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
