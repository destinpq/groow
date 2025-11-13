import { useEffect } from 'react';
import { Navigate } from 'umi';

const VendorIndex = () => {
  // Redirect to vendor dashboard
  return <Navigate to="/vendor/dashboard" replace />;
};

export default VendorIndex;