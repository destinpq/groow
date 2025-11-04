import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Avatar,
  Drawer,
  Descriptions,
  Typography,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  joinDate: string;
  avatar?: string;
}

const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234-567-8900',
    location: 'New York, USA',
    totalOrders: 15,
    totalSpent: 2499.85,
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Smith',
    email: 'sarah.smith@example.com',
    phone: '+1 234-567-8901',
    location: 'Los Angeles, USA',
    totalOrders: 8,
    totalSpent: 1299.92,
    status: 'active',
    joinDate: '2024-03-20',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+1 234-567-8902',
    location: 'Chicago, USA',
    totalOrders: 22,
    totalSpent: 4599.78,
    status: 'vip',
    joinDate: '2023-11-10',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 234-567-8903',
    location: 'Houston, USA',
    totalOrders: 3,
    totalSpent: 449.97,
    status: 'active',
    joinDate: '2024-09-05',
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.w@example.com',
    phone: '+1 234-567-8904',
    location: 'Miami, USA',
    totalOrders: 12,
    totalSpent: 1899.88,
    status: 'active',
    joinDate: '2024-02-28',
  },
];

const VendorCustomersPage: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'success',
      vip: 'gold',
      inactive: 'default',
    };
    return colors[status] || 'default';
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDrawerVisible(true);
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <Text strong>{name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders: number) => <Text strong>{orders}</Text>,
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (spent: number) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${spent.toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'VIP', value: 'vip' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewCustomer(record)}
        >
          View Profile
        </Button>
      ),
    },
  ];

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter((c) => c.status === 'vip').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / customers.reduce((sum, c) => sum + c.totalOrders, 0);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Customer Management</Title>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Customers"
              value={totalCustomers}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="VIP Customers"
              value={vipCustomers}
              prefix={<UserOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              precision={2}
              prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
              suffix="USD"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Avg Order Value"
              value={avgOrderValue}
              precision={2}
              prefix={<ShoppingOutlined style={{ color: '#722ed1' }} />}
              suffix="USD"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search customers..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
        </Row>

        {/* Customers Table */}
        <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
          }}
        />
      </Card>

      {/* Customer Detail Drawer */}
      <Drawer
        title="Customer Profile"
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedCustomer && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <div style={{ textAlign: 'center' }}>
              <Avatar size={80} icon={<UserOutlined />} src={selectedCustomer.avatar} />
              <Title level={4} style={{ marginTop: 16, marginBottom: 0 }}>
                {selectedCustomer.name}
              </Title>
              <Tag color={getStatusColor(selectedCustomer.status)} style={{ marginTop: 8 }}>
                {selectedCustomer.status.toUpperCase()}
              </Tag>
            </div>

            <Descriptions title="Contact Information" bordered column={1} size="small">
              <Descriptions.Item label="Email">{selectedCustomer.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedCustomer.phone}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedCustomer.location}</Descriptions.Item>
              <Descriptions.Item label="Member Since">
                {new Date(selectedCustomer.joinDate).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="Purchase Statistics" bordered column={1} size="small">
              <Descriptions.Item label="Total Orders">
                <Text strong style={{ fontSize: 16 }}>
                  {selectedCustomer.totalOrders}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Spent">
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                  ${selectedCustomer.totalSpent.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Average Order Value">
                <Text strong style={{ fontSize: 16, color: '#722ed1' }}>
                  ${(selectedCustomer.totalSpent / selectedCustomer.totalOrders).toFixed(2)}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Recent Orders" size="small">
              <Text type="secondary">Last 5 orders from this customer would appear here</Text>
            </Card>

            <Card title="Favorite Products" size="small">
              <Text type="secondary">Most purchased products would appear here</Text>
            </Card>
          </Space>
        )}
      </Drawer>
    </div>
  );
};

export default VendorCustomersPage;
