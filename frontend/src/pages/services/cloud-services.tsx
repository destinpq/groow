import { useEffect } from 'react';
import { useNavigate } from 'umi';

const CloudServicesPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog with category filter
    navigate('/services-catalog?category=Cloud+Services');
  }, [navigate]);

  return null;
};

export default CloudServicesPage;

