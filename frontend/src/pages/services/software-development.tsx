import { useEffect } from 'react';
import { useNavigate } from 'umi';

const SoftwareDevelopmentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog with category filter
    navigate('/services-catalog?category=Software+Development');
  }, [navigate]);

  return null;
};

export default SoftwareDevelopmentPage;

