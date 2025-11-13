import { useEffect } from 'react';
import { Layout, Menu, Badge } from 'antd';
import { Outlet, useNavigate, useLocation } from 'umi';
import {
  HomeOutlined,
  CodeOutlined,
  CloudOutlined,
  SafetyOutlined,
  SettingOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const { Header, Content, Footer } = Layout;

const CustomerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuthStore();

  // Auth guard - redirect if not authenticated or not customer
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'customer') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'Home' },
    { 
      key: '/services',
      label: 'IT Services',
      icon: <CodeOutlined />,
      children: [
        { key: '/services/software-development', icon: <CodeOutlined />, label: 'Software Development' },
        { key: '/services/cloud-services', icon: <CloudOutlined />, label: 'Cloud Services' },
        { key: '/services/cybersecurity', icon: <SafetyOutlined />, label: 'Cybersecurity' },
        { key: '/services/devops', icon: <SettingOutlined />, label: 'DevOps' },
        { key: '/services/consulting', icon: <TeamOutlined />, label: 'IT Consulting' },
      ]
    },
    { 
      key: '/cart', 
      icon: <Badge count={0}><ShoppingCartOutlined /></Badge>, 
      label: 'Cart' 
    },
    ...(isAuthenticated 
      ? [
          { key: '/profile', icon: <UserOutlined />, label: 'Profile' },
          { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', onClick: handleLogout }
        ] 
      : [
          { key: '/login', icon: <UserOutlined />, label: 'Login' }
        ]
    ),
  ];

  return (
    <Layout>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', background: '#001529' }}>
        <div style={{ float: 'left', color: 'white', fontSize: 24, fontWeight: 'bold', marginRight: 50 }}>
          Groow
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => key !== 'logout' && navigate(key)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: '80px 50px', minHeight: 'calc(100vh - 134px)' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Groow IT Services Marketplace ©2024 Created with UmiJS & Ant Design
      </Footer>
    </Layout>
  );
};

export default CustomerLayout;
