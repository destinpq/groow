import { useEffect } from 'react';
import { useNavigate } from 'umi';

const DevOpsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog with category filter
    navigate('/services-catalog?category=DevOps');
  }, [navigate]);

  return null;
};

export default DevOpsPage;

