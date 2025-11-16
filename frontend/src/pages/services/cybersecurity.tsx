import { useEffect } from 'react';
import { useNavigate } from 'umi';

const CybersecurityPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to services catalog with category filter
    navigate('/services-catalog?category=Cybersecurity');
  }, [navigate]);

  return null;
};

export default CybersecurityPage;

