import { useEffect } from 'react';
import { useNavigate } from 'umi';
import { Spin } from 'antd';
import { useAuthStore } from '@/store/auth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin/settings');
    } else if (user?.role === 'vendor') {
      navigate('/vendor/profile');
    } else {
      navigate('/customer/profile');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Spin size="large" />
    </div>
  );
};

export default ProfilePage;

