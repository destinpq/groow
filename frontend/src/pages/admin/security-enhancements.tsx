import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Statistic,
  Space,
  Switch,
  Button,
  Alert,
  Tabs,
  List,
  Form,
  Input,
  Select,
  Divider,
  Progress,
  message,
} from 'antd';
import {
  SafetyOutlined,
  LockOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  FireOutlined,
  SecurityScanOutlined,
  KeyOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface SecurityEvent {
  id: number;
  type: 'login_attempt' | 'password_change' | 'suspicious_activity' | 'blocked_ip' | 'api_abuse';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ip: string;
  timestamp: string;
  status: 'resolved' | 'pending' | 'investigating';
}

interface IPBlocklist {
  id: number;
  ip: string;
  reason: string;
  blockedAt: string;
  expiresAt: string | null;
  permanent: boolean;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 1,
    type: 'login_attempt',
    severity: 'high',
    description: 'Multiple failed login attempts detected',
    ip: '192.168.1.100',
    timestamp: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'resolved',
  },
  {
    id: 2,
    type: 'suspicious_activity',
    severity: 'critical',
    description: 'SQL injection attempt detected',
    ip: '45.123.67.89',
    timestamp: dayjs().subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'resolved',
  },
  {
    id: 3,
    type: 'api_abuse',
    severity: 'medium',
    description: 'Rate limit exceeded (500 req/min)',
    ip: '10.0.0.55',
    timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    status: 'investigating',
  },
  {
    id: 4,
    type: 'blocked_ip',
    severity: 'high',
    description: 'Malicious bot activity detected',
    ip: '203.45.12.78',
    timestamp: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
    status: 'resolved',
  },
];

const mockBlocklist: IPBlocklist[] = [
  {
    id: 1,
    ip: '45.123.67.89',
    reason: 'SQL injection attempts',
    blockedAt: dayjs().subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    expiresAt: null,
    permanent: true,
  },
  {
    id: 2,
    ip: '203.45.12.78',
    reason: 'Bot activity',
    blockedAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
    expiresAt: dayjs().add(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    permanent: false,
  },
];

const SecurityEnhancementsPage: React.FC = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [sslEnabled, setSSLEnabled] = useState<boolean>(true);
  const [firewallEnabled, setFirewallEnabled] = useState<boolean>(true);
  const [bruteForceProtection, setBruteForceProtection] = useState<boolean>(true);
  const [form] = Form.useForm();

  const handleBlockIP = () => {
    message.success('IP address blocked successfully');
  };

  const handleUnblockIP = (ip: string) => {
    message.success(`IP ${ip} unblocked`);
  };

  const eventColumns: ColumnsType<SecurityEvent> = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: SecurityEvent['severity']) => {
        const config: Record<SecurityEvent['severity'], { color: string; icon: React.ReactNode }> = {
          low: { color: 'blue', icon: <CheckCircleOutlined /> },
          medium: { color: 'orange', icon: <WarningOutlined /> },
          high: { color: 'red', icon: <FireOutlined /> },
          critical: { color: 'purple', icon: <FireOutlined /> },
        };
        return (
          <Tag color={config[severity].color} icon={config[severity].icon}>
            {severity.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Low', value: 'low' },
        { text: 'Medium', value: 'medium' },
        { text: 'High', value: 'high' },
        { text: 'Critical', value: 'critical' },
      ],
      onFilter: (value, record) => record.severity === value,
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag>{type.replace('_', ' ').toUpperCase()}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (ip) => <Text code>{ip}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => <Text type="secondary">{timestamp}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SecurityEvent['status']) => {
        const colors: Record<SecurityEvent['status'], string> = {
          resolved: 'green',
          pending: 'orange',
          investigating: 'blue',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const blocklistColumns: ColumnsType<IPBlocklist> = [
    {
      title: 'IP Address',
      dataIndex: 'ip',
      key: 'ip',
      render: (ip) => <Text code strong>{ip}</Text>,
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Blocked At',
      dataIndex: 'blockedAt',
      key: 'blockedAt',
      render: (time) => <Text type="secondary">{time}</Text>,
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expires, record) =>
        record.permanent ? <Tag color="red">Permanent</Tag> : <Text>{expires}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" danger onClick={() => handleUnblockIP(record.ip)}>
          Unblock
        </Button>
      ),
    },
  ];

  const securityFeatures = [
    {
      title: 'SSL/TLS Encryption',
      description: '256-bit SSL encryption for all data transmission',
      enabled: sslEnabled,
      toggle: setSSLEnabled,
      icon: <LockOutlined />,
    },
    {
      title: 'Two-Factor Authentication',
      description: 'Require 2FA for admin and vendor accounts',
      enabled: twoFactorEnabled,
      toggle: setTwoFactorEnabled,
      icon: <KeyOutlined />,
    },
    {
      title: 'Web Application Firewall',
      description: 'Block malicious requests and common attacks',
      enabled: firewallEnabled,
      toggle: setFirewallEnabled,
      icon: <SecurityScanOutlined />,
    },
    {
      title: 'Brute Force Protection',
      description: 'Rate limiting and automatic IP blocking',
      enabled: bruteForceProtection,
      toggle: setBruteForceProtection,
      icon: <SafetyOutlined />,
    },
  ];

  const securityScore = 92;
  const threatsBlocked = 142;
  const activeAlerts = mockSecurityEvents.filter((e) => e.status !== 'resolved').length;
  const blockedIPs = mockBlocklist.length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <SecurityScanOutlined style={{ color: '#1890ff' }} /> Security Enhancements
        </Title>
        <Paragraph type="secondary">
          Manage security settings, monitor threats, and protect your platform
        </Paragraph>
      </div>

      <Alert
        message="Security Status: Good"
        description="All critical security features are enabled. No active threats detected."
        type="success"
        showIcon
        icon={<SafetyOutlined />}
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Security Score"
              value={securityScore}
              suffix="/100"
              prefix={<SecurityScanOutlined />}
              valueStyle={{ color: securityScore > 80 ? '#52c41a' : '#faad14' }}
            />
            <Progress percent={securityScore} showInfo={false} strokeColor="#52c41a" />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Threats Blocked"
              value={threatsBlocked}
              prefix={<FireOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
              suffix={
                <Tag color="green" style={{ marginLeft: 8 }}>
                  Today
                </Tag>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={activeAlerts}
              prefix={<WarningOutlined />}
              valueStyle={{ color: activeAlerts > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Blocked IPs"
              value={blockedIPs}
              prefix={<AuditOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="features"
        items={[
          {
            key: 'features',
            label: 'Security Features',
            children: (
              <Card title="Security Features Configuration">
                <List
                  dataSource={securityFeatures}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Switch
                          key="switch"
                          checked={item.enabled}
                          onChange={item.toggle}
                          checkedChildren="ON"
                          unCheckedChildren="OFF"
                        />,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              fontSize: 24,
                              color: item.enabled ? '#52c41a' : '#d9d9d9',
                            }}
                          >
                            {item.icon}
                          </div>
                        }
                        title={<Text strong>{item.title}</Text>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />

                <Divider />

                <Title level={5}>Additional Security Settings</Title>
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Session Timeout (minutes)">
                        <Select defaultValue="30" style={{ width: '100%' }}>
                          <Select.Option value="15">15 minutes</Select.Option>
                          <Select.Option value="30">30 minutes</Select.Option>
                          <Select.Option value="60">1 hour</Select.Option>
                          <Select.Option value="120">2 hours</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Max Login Attempts">
                        <Select defaultValue="5" style={{ width: '100%' }}>
                          <Select.Option value="3">3 attempts</Select.Option>
                          <Select.Option value="5">5 attempts</Select.Option>
                          <Select.Option value="10">10 attempts</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Password Minimum Length">
                        <Select defaultValue="8" style={{ width: '100%' }}>
                          <Select.Option value="6">6 characters</Select.Option>
                          <Select.Option value="8">8 characters</Select.Option>
                          <Select.Option value="12">12 characters</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="API Rate Limit (req/min)">
                        <Select defaultValue="100" style={{ width: '100%' }}>
                          <Select.Option value="50">50 requests</Select.Option>
                          <Select.Option value="100">100 requests</Select.Option>
                          <Select.Option value="200">200 requests</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button type="primary">Save Settings</Button>
                </Form>
              </Card>
            ),
          },
          {
            key: 'events',
            label: 'Security Events',
            children: (
              <Card title="Recent Security Events">
                <Table
                  columns={eventColumns}
                  dataSource={mockSecurityEvents}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'blocklist',
            label: 'IP Blocklist',
            children: (
              <Card
                title="Blocked IP Addresses"
                extra={
                  <Button type="primary" onClick={() => form.resetFields()}>
                    Add IP to Blocklist
                  </Button>
                }
              >
                <Form form={form} layout="inline" onFinish={handleBlockIP} style={{ marginBottom: 16 }}>
                  <Form.Item name="ip" rules={[{ required: true, message: 'Enter IP address' }]}>
                    <Input placeholder="Enter IP address" style={{ width: 200 }} />
                  </Form.Item>
                  <Form.Item name="reason" rules={[{ required: true, message: 'Enter reason' }]}>
                    <Input placeholder="Reason for blocking" style={{ width: 250 }} />
                  </Form.Item>
                  <Form.Item name="permanent" valuePropName="checked">
                    <Space>
                      <Text>Permanent:</Text>
                      <Switch />
                    </Space>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Block IP
                    </Button>
                  </Form.Item>
                </Form>

                <Table
                  columns={blocklistColumns}
                  dataSource={mockBlocklist}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'audit',
            label: 'Audit Log',
            children: (
              <Card title="Security Audit Log">
                <Alert
                  message="Audit Logging Enabled"
                  description="All security events are logged and retained for 90 days."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <List
                  dataSource={[
                    'Admin login from 192.168.1.1',
                    'Password changed for user@example.com',
                    'Two-factor authentication enabled',
                    'New API key generated',
                    'Firewall rule updated',
                  ]}
                  renderItem={(item, index) => (
                    <List.Item>
                      <Text type="secondary">{dayjs().subtract(index, 'hours').format('HH:mm:ss')}</Text>
                      <Text style={{ marginLeft: 16 }}>{item}</Text>
                    </List.Item>
                  )}
                />
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SecurityEnhancementsPage;
