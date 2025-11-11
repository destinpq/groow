import { useEffect } from 'react';
import { Navigate } from 'umi';

const AdminIndex = () => {
  // Redirect to admin dashboard
  return <Navigate to="/admin/dashboard" replace />;
};

export default AdminIndex;