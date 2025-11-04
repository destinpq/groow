import { useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'umi';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  WalletOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';

const { Header, Sider, Content } = Layout;

const VendorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuthStore();

  // Auth guard - redirect if not authenticated or not vendor
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'vendor') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/vendor', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/vendor/products', icon: <ShoppingOutlined />, label: 'My Products' },
    { key: '/vendor/orders', icon: <ShoppingCartOutlined />, label: 'Orders' },
    { key: '/vendor/wallet', icon: <WalletOutlined />, label: 'Wallet' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        <div style={{ height: 32, margin: 16, color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          Groow Vendor
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
        <Menu
          theme="dark"
          mode="inline"
          style={{ position: 'absolute', bottom: 0, width: '100%' }}
          items={[{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout' }]}
          onClick={handleLogout}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }}>
          <h1>Vendor Portal</h1>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default VendorLayout;
