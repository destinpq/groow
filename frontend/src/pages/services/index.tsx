import { useEffect } from 'react';
import { useNavigate } from 'umi';

const ServicesIndex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog
    navigate('/services-catalog');
  }, [navigate]);

  return null;
};

export default ServicesIndex;

