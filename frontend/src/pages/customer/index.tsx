import { useEffect } from 'react';
import { Navigate } from 'umi';

const CustomerIndex = () => {
  // Redirect to customer dashboard
  return <Navigate to="/customer/dashboard" replace />;
};

export default CustomerIndex;