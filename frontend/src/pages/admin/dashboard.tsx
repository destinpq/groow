import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { 
  UserOutlined, 
  ShoppingOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined,
  TeamOutlined,
  ShopOutlined 
} from '@ant-design/icons';
import { productAPI } from '@/services/api/products';
import api from '@/services/api/client';

interface OrderStats {
  totalOrders: number;
  newOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

interface DashboardStats {
  totalProducts: number;
  totalCustomers: number;
  totalVendors: number;
  orderStats: OrderStats;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCustomers: 0,
    totalVendors: 0,
    orderStats: {
      totalOrders: 0,
      newOrders: 0,
      deliveredOrders: 0,
      totalRevenue: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [productsRes, orderStatsRes, customersRes, vendorsRes] = await Promise.all([
        productAPI.getAll({ page: 1, limit: 1 }),
        api.get<OrderStats>('/orders/stats'),
        api.get<any>('/users', { params: { role: 'customer', page: 1, limit: 1 } }),
        api.get<any>('/users', { params: { role: 'vendor', page: 1, limit: 1 } }),
      ]);

      setStats({
        totalProducts: productsRes.total || 0,
        totalCustomers: customersRes.data?.total || 0,
        totalVendors: vendorsRes.data?.total || 0,
        orderStats: orderStatsRes.data || {
          totalOrders: 0,
          newOrders: 0,
          deliveredOrders: 0,
          totalRevenue: 0,
        },
      });
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
      message.error(error?.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Spin spinning={loading}>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Products"
                value={stats.totalProducts}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Orders"
                value={stats.orderStats.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={stats.orderStats.totalRevenue}
                prefix={<DollarOutlined />}
                precision={2}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="New Orders"
                value={stats.orderStats.newOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Customers"
                value={stats.totalCustomers}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Vendors"
                value={stats.totalVendors}
                prefix={<ShopOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Delivered Orders"
                value={stats.orderStats.deliveredOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Active Products"
                value={stats.totalProducts}
                prefix={<ShoppingOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};

export default AdminDashboard;
