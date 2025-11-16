import { useEffect } from 'react';
import { useNavigate } from 'umi';

const ConsultingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog with category filter
    navigate('/services-catalog?category=IT+Consulting');
  }, [navigate]);

  return null;
};

export default ConsultingPage;

