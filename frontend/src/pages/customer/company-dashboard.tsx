import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Tabs, Table, Button, Space, Alert, Progress, Badge, Tag, Divider } from 'antd';
import { BuildOutlined, TeamOutlined, ShoppingCartOutlined, DollarOutlined, CreditCardOutlined, UserOutlined, FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CompanyDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const companyData = {
    companyName: 'TechCorp Solutions Ltd.',
    companyType: 'Enterprise',
    employees: 250,
    creditLimit: 50000,
    creditUsed: 23750,
    creditAvailable: 26250,
    monthlySpend: 8950,
    totalOrders: 145,
    pendingApprovals: 3,
    activeUsers: 12,
  };

  const recentOrders = [
    {
      id: 'ORD-2025-001',
      date: '2025-11-06',
      amount: 2450.00,
      status: 'delivered',
      items: 15,
      approver: 'John Smith',
      department: 'IT',
    },
    {
      id: 'ORD-2025-002',
      date: '2025-11-05',
      amount: 890.00,
      status: 'pending',
      items: 8,
      approver: 'Pending',
      department: 'Marketing',
    },
    {
      id: 'ORD-2025-003',
      date: '2025-11-04',
      amount: 3200.00,
      status: 'approved',
      items: 24,
      approver: 'Sarah Johnson',
      department: 'Operations',
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      role: 'Purchase Manager',
      department: 'IT',
      permissions: ['approve', 'order', 'view'],
      lastActive: '2025-11-06',
      totalOrders: 45,
      monthlySpend: 12450,
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@techcorp.com',
      role: 'Department Head',
      department: 'Operations',
      permissions: ['approve', 'order', 'view', 'manage'],
      lastActive: '2025-11-06',
      totalOrders: 32,
      monthlySpend: 8900,
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@techcorp.com',
      role: 'Procurement Specialist',
      department: 'Finance',
      permissions: ['order', 'view'],
      lastActive: '2025-11-05',
      totalOrders: 28,
      monthlySpend: 5600,
    },
  ];

  const approvalWorkflow = [
    {
      id: 1,
      orderId: 'ORD-2025-004',
      requester: 'Alice Brown',
      amount: 1850.00,
      department: 'HR',
      items: 12,
      submittedDate: '2025-11-06 09:30',
      priority: 'normal',
      status: 'pending',
    },
    {
      id: 2,
      orderId: 'ORD-2025-005',
      requester: 'Bob Wilson',
      amount: 4200.00,
      department: 'Engineering',
      items: 18,
      submittedDate: '2025-11-06 08:15',
      priority: 'high',
      status: 'pending',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'green';
      case 'approved': return 'blue';
      case 'pending': return 'orange';
      case 'cancelled': return 'red';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'normal': return 'blue';
      case 'low': return 'gray';
      default: return 'default';
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge status={status === 'delivered' ? 'success' : status === 'pending' ? 'processing' : 'default'} text={status.toUpperCase()} />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">View</Button>
          <Button size="small" type="link">Track</Button>
        </Space>
      ),
    },
  ];

  const teamColumns = [
    {
      title: 'Team Member',
      key: 'member',
      render: (record: any) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Role & Department',
      key: 'role',
      render: (record: any) => (
        <div>
          <Text>{record.role}</Text>
          <br />
          <Tag color="blue">{record.department}</Tag>
        </div>
      ),
    },
    {
      title: 'Permissions',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map(permission => (
            <Tag key={permission} color="green" size="small">
              {permission}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Monthly Spend',
      dataIndex: 'monthlySpend',
      key: 'monthlySpend',
      render: (spend: number) => `$${spend.toLocaleString()}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small">Edit</Button>
          <Button size="small" type="link">History</Button>
        </Space>
      ),
    },
  ];

  const approvalColumns = [
    {
      title: 'Order Details',
      key: 'order',
      render: (record: any) => (
        <div>
          <Text strong>{record.orderId}</Text>
          <br />
          <Text type="secondary">{record.requester}</Text>
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <Text strong>${amount.toLocaleString()}</Text>,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: () => (
        <Space>
          <Button size="small" type="primary">Approve</Button>
          <Button size="small" danger>Reject</Button>
          <Button size="small">Details</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <BuildOutlined style={{ marginRight: 8 }} />
          Company Dashboard
        </Title>
        <Text type="secondary">Phase 5 - B2B enterprise account management</Text>
      </div>

      {/* Company Overview */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <BuildOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 8 }} />
              <Title level={4}>{companyData.companyName}</Title>
              <Tag color="gold">{companyData.companyType} Account</Tag>
            </div>
          </Col>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={4}>
                <Statistic
                  title="Employees"
                  value={companyData.employees}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Credit Limit"
                  value={companyData.creditLimit}
                  prefix="$"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Available Credit"
                  value={companyData.creditAvailable}
                  prefix="$"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Monthly Spend"
                  value={companyData.monthlySpend}
                  prefix="$"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Total Orders"
                  value={companyData.totalOrders}
                  prefix={<ShoppingCartOutlined />}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Active Users"
                  value={companyData.activeUsers}
                  prefix={<UserOutlined />}
                />
              </Col>
            </Row>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <Text strong>Credit Utilization:</Text>
              <Progress 
                percent={(companyData.creditUsed / companyData.creditLimit) * 100} 
                status="active"
                format={() => `$${companyData.creditUsed.toLocaleString()} / $${companyData.creditLimit.toLocaleString()}`}
                style={{ marginTop: 8 }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      <Alert
        message="Company Account Status"
        description="Your enterprise account is in good standing with $26,250 available credit. 3 orders pending approval."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary">
            View Credit Details
          </Button>
        }
        closable
      />

      <Tabs defaultActiveKey="overview">
        <TabPane tab="Order Overview" key="overview">
          <Card title="Recent Company Orders">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </TabPane>

        <TabPane tab="Team Management" key="team">
          <Card 
            title="Team Members & Permissions"
            extra={
              <Button type="primary" icon={<UserOutlined />}>
                Add Team Member
              </Button>
            }
          >
            <Table
              columns={teamColumns}
              dataSource={teamMembers}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab={`Approval Queue (${companyData.pendingApprovals})`} key="approvals">
          <Card title="Pending Purchase Approvals">
            <Alert
              message="Approval Workflow"
              description="Orders over $1,000 or from restricted categories require manager approval before processing."
              type="info"
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={approvalColumns}
              dataSource={approvalWorkflow}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </TabPane>

        <TabPane tab="Credit & Billing" key="billing">
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Credit Management">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Credit Limit:</Text>
                    <Text strong>${companyData.creditLimit.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Used:</Text>
                    <Text>${companyData.creditUsed.toLocaleString()}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Available:</Text>
                    <Text strong style={{ color: '#52c41a' }}>${companyData.creditAvailable.toLocaleString()}</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <Button type="primary" block icon={<CreditCardOutlined />}>
                    Request Credit Increase
                  </Button>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Billing Information">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Billing Address:</Text>
                    <br />
                    <Text>123 Business Park Drive</Text>
                    <br />
                    <Text>Suite 500, Tech City, TC 12345</Text>
                  </div>
                  <div>
                    <Text strong>Payment Terms:</Text>
                    <br />
                    <Text>Net 30 Days</Text>
                  </div>
                  <div>
                    <Text strong>Tax ID:</Text>
                    <br />
                    <Text>12-3456789</Text>
                  </div>
                  <Button type="default" block icon={<FileTextOutlined />}>
                    Download Invoice
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CompanyDashboard;
