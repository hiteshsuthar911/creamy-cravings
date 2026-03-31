import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem('creamy-cravings-admin-token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

