import { ProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Space, Tag, Avatar, message } from 'antd';
import { EyeOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'suspended';
  ordersCount: number;
  totalSpent: number;
  lastOrder: string;
  joinedAt: string;
}

const AdminCustomers = () => {
  const columns: ProColumns<CustomerType>[] = [
    {
      title: 'Customer',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <Space>
          <Avatar>{name[0]}</Avatar>
          <div>
            <div>{name}</div>
            <div style={{ fontSize: 12, color: '#999' }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
    },
    {
      title: 'Orders',
      dataIndex: 'ordersCount',
      key: 'ordersCount',
      width: 100,
      align: 'center',
      sorter: true,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 120,
      render: (spent) => `$${spent.toFixed(2)}`,
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Suspended', value: 'suspended' },
      ],
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'error'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Last Order',
      dataIndex: 'lastOrder',
      key: 'lastOrder',
      width: 120,
    },
    {
      title: 'Joined',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      width: 120,
      valueType: 'date',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />}>View</Button>
          {record.status === 'active' ? (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleSuspend(record.id)}>
              Suspend
            </Button>
          ) : (
            <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleActivate(record.id)}>
              Activate
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const mockData: CustomerType[] = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1234567890',
      status: 'active',
      ordersCount: 15,
      totalSpent: 3456.78,
      lastOrder: '2024-11-03',
      joinedAt: '2024-06-15',
    },
    {
      id: '2',
      name: 'Bob Williams',
      email: 'bob@example.com',
      phone: '+1234567891',
      status: 'active',
      ordersCount: 8,
      totalSpent: 1234.56,
      lastOrder: '2024-10-28',
      joinedAt: '2024-08-20',
    },
  ];

  const handleSuspend = (id: string) => {
    message.success('Customer suspended');
  };

  const handleActivate = (id: string) => {
    message.success('Customer activated');
  };

  return (
    <ProTable<CustomerType>
      columns={columns}
      dataSource={mockData}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      headerTitle="Customer Management"
      pagination={{
        defaultPageSize: 20,
        showSizeChanger: true,
      }}
    />
  );
};

export default AdminCustomers;
