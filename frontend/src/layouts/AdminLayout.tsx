import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'umi';
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  QuestionCircleOutlined,
  BarChartOutlined,
  TagsOutlined,
  DollarOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAuthenticated } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  // Auth guard - redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/settings'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: 'Products',
      children: [
        { key: '/admin/products', label: 'Products' },
        { key: '/admin/categories', label: 'Categories' },
        { key: '/admin/brands', label: 'Brands' },
      ],
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: 'Orders',
      children: [
        { key: '/admin/orders', label: 'All Orders' },
      ],
    },
    {
      key: 'vendors',
      icon: <ShopOutlined />,
      label: 'Vendors',
      children: [
        { key: '/admin/vendors', label: 'All Vendors' },
      ],
    },
    {
      key: 'customers',
      icon: <TeamOutlined />,
      label: 'Customers',
      children: [
        { key: '/admin/customers', label: 'All Customers' },
      ],
    },
    {
      key: 'rfq',
      icon: <QuestionCircleOutlined />,
      label: 'RFQ Management',
      children: [
        { key: '/admin/rfq', label: 'All RFQs' },
      ],
    },
    {
      key: 'cms',
      icon: <FileTextOutlined />,
      label: 'CMS',
      children: [
        { key: '/admin/cms/banners', label: 'Banners' },
        { key: '/admin/cms/pages', label: 'Pages' },
        { key: '/admin/cms/faqs', label: 'FAQs' },
      ],
    },
    {
      key: 'marketing',
      icon: <TagsOutlined />,
      label: 'Marketing',
      children: [
        { key: '/admin/deals-management', label: 'Deals' },
        { key: '/admin/coupon-management', label: 'Coupons' },
        { key: '/admin/promotions-campaigns', label: 'Promotions' },
      ],
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports (MIS)',
      children: [
        { key: '/admin/reports/sales', label: 'Sales Report' },
        { key: '/admin/reports/products', label: 'Product Report' },
        { key: '/admin/reports/vendors', label: 'Vendor Report' },
        { key: '/admin/reports/customers', label: 'Customer Report' },
        { key: '/admin/reports/rfq', label: 'RFQ Report' },
        { key: '/admin/reports/custom', label: 'Custom Reports' },
      ],
    },
    {
      key: 'finance',
      icon: <DollarOutlined />,
      label: 'Finance',
      children: [
        { key: '/admin/finance/transactions', label: 'Transactions' },
        { key: '/admin/finance/payouts', label: 'Vendor Payouts' },
        { key: '/admin/finance/refunds', label: 'Refunds' },
      ],
    },
    {
      key: 'support',
      icon: <CustomerServiceOutlined />,
      label: 'Support',
      children: [
        { key: '/admin/customer-support', label: 'Customer Support' },
      ],
    },
    {
      key: 'staff',
      icon: <TeamOutlined />,
      label: 'Staff & HRMS',
      children: [
        { key: '/admin/settings', label: 'Settings' },
      ],
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', 
          fontSize: collapsed ? 16 : 24, 
          fontWeight: 'bold',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {collapsed ? 'G' : 'Groow Admin'}
        </div>
        
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0 }}
        />
      </Sider>
      
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
          <div style={{ fontSize: 24, cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          
          <Space size="large">
            <Badge count={5}>
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>
            
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                <span>{user?.name || 'Admin'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        
        <Content style={{ 
          margin: '24px 16px',
          padding: 24, 
          background: '#fff',
          minHeight: 280,
          borderRadius: 8,
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
