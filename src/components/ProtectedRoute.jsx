import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');

    if (requireAdmin) {
      if (!adminToken) {
        navigate('/');
        return;
      }
    } else {
      if (!token) {
        navigate('/');
        return;
      }
    }
  }, [navigate, requireAdmin]);

  return children;
};

export default ProtectedRoute;