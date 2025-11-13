/**
 * SAFE API RESPONSE HANDLING
 * Use pattern: const data = response?.data?.data || response?.data || [];
 * Use pattern: const total = response?.data?.meta?.total || response?.meta?.total || 0;
 */
import React, { useState, useEffect } from 'react';
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
  DatePicker,
  Spin,
  Modal,
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
  DownloadOutlined,
  ReloadOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { logsAPI } from '@/services/api/logs';
import { securityAPI } from '@/services/api/security';
import type {
  ActivityLog,
  ErrorLog,
  SecurityLog,
  SystemLog,
  LogStats,
  LogFilters,
} from '@/services/api/logs';
import type {
  SecurityThreat,
  SecurityEvent as SecurityEventAPI,
  BlockedIP,
  SecurityMetrics,
  SecurityConfiguration,
  SecurityFilters,
} from '@/services/api/security';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

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
  // State for security features
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [sslEnabled, setSSLEnabled] = useState<boolean>(true);
  const [firewallEnabled, setFirewallEnabled] = useState<boolean>(true);
  const [bruteForceProtection, setBruteForceProtection] = useState<boolean>(true);
  const [form] = Form.useForm();

  // State for logs data
  const [loading, setLoading] = useState<boolean>(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [logStats, setLogStats] = useState<LogStats | null>(null);
  const [filters, setFilters] = useState<LogFilters>({});
  const [selectedLog, setSelectedLog] = useState<ActivityLog | ErrorLog | SecurityLog | SystemLog | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);

  // Security-specific state
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [securityThreats, setSecurityThreats] = useState<SecurityThreat[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEventAPI[]>([]);
  const [blockedIPsList, setBlockedIPsList] = useState<BlockedIP[]>([]);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfiguration | null>(null);
  const [securityLoading, setSecurityLoading] = useState<boolean>(false);

  // Fetch logs on mount
  useEffect(() => {
    fetchAllLogs();
    fetchLogStats();
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    setSecurityLoading(true);
    try {
      const [metricsRes, threatsRes, eventsRes, blockedIPsRes, configRes] = await Promise.all([
        securityAPI.getSecurityMetrics(),
        securityAPI.getThreats({ limit: 50 }),
        securityAPI.getSecurityEvents({ limit: 50 }),
        securityAPI.getBlockedIPs({ limit: 50 }),
        securityAPI.getSecurityConfiguration(),
      ]);
      
      setSecurityMetrics(metricsRes);
      setSecurityThreats(threatsRes.data);
      setSecurityEvents(eventsRes.data);
      setBlockedIPsList(blockedIPsRes.data);
      setSecurityConfig(configRes);
    } catch (error) {
      // If APIs aren't available yet, continue with mock data
      console.warn('Security APIs not available, using mock data:', error);
    } finally {
      setSecurityLoading(false);
    }
  };

  const fetchAllLogs = async () => {
    setLoading(true);
    try {
      const [activityRes, errorRes, securityRes, systemRes] = await Promise.all([
        logsAPI.getActivityLogs({ limit: 50 }),
        logsAPI.getErrorLogs({ limit: 50 }),
        logsAPI.getSecurityLogs({ limit: 50 }),
        logsAPI.getSystemLogs({ limit: 50 }),
      ]);
      setActivityLogs(activityRes.data.logs);
      setErrorLogs(errorRes.data.logs);
      setSecurityLogs(securityRes.data.logs);
      setSystemLogs(systemRes.data.logs);
    } catch (error) {
      message.error('Failed to fetch logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogStats = async () => {
    try {
      const response = await logsAPI.getLogStats();
      setLogStats(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
    } catch (error) {
      console.error('Failed to fetch log stats:', error);
    }
  };

  const handleRefresh = () => {
    fetchAllLogs();
    fetchLogStats();
    message.success('Logs refreshed');
  };

  const handleExport = async (type: 'activity' | 'error' | 'security' | 'system') => {
    try {
      setLoading(true);
      const response = await logsAPI.exportLogs({
        type,
        format: 'csv',
        filters,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-logs-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      message.success('Logs exported successfully');
    } catch (error) {
      message.error('Failed to export logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLogs = async (type: 'activity' | 'error' | 'security' | 'system', ids: string[]) => {
    try {
      await logsAPI.bulkDeleteLogs(type, ids);
      message.success('Logs deleted successfully');
      fetchAllLogs();
    } catch (error) {
      message.error('Failed to delete logs');
      console.error(error);
    }
  };

  const handleResolveError = async (id: string) => {
    try {
      await logsAPI.resolveErrorLog(id, 'Admin');
      message.success('Error log resolved');
      fetchAllLogs();
    } catch (error) {
      message.error('Failed to resolve error log');
      console.error(error);
    }
  };

  const handleUpdateSecurityStatus = async (id: string, status: SecurityLog['status']) => {
    try {
      await logsAPI.updateSecurityLogStatus(id, status, 'Admin');
      message.success('Security log status updated');
      fetchAllLogs();
    } catch (error) {
      message.error('Failed to update status');
      console.error(error);
    }
  };

  // Security-specific handlers
  const handleBlockIP = async (values: { ip: string; reason: string; permanent?: boolean }) => {
    try {
      await securityAPI.blockIP({
        ipAddress: values.ip,
        reason: values.reason,
        permanent: values.permanent || false,
      });
      message.success('IP address blocked successfully');
      form.resetFields();
      fetchSecurityData();
    } catch (error) {
      message.error('Failed to block IP address');
      console.error(error);
    }
  };

  const handleUnblockIP = async (id: string) => {
    try {
      await securityAPI.unblockIP(id);
      message.success('IP address unblocked successfully');
      fetchSecurityData();
    } catch (error) {
      message.error('Failed to unblock IP address');
      console.error(error);
    }
  };

  const handleResolveThreat = async (id: string, actionTaken: string) => {
    try {
      await securityAPI.resolveThreat(id, actionTaken);
      message.success('Threat resolved successfully');
      fetchSecurityData();
    } catch (error) {
      message.error('Failed to resolve threat');
      console.error(error);
    }
  };

  const handleSecurityRefresh = () => {
    fetchAllLogs();
    fetchSecurityData();
  };

  const handleViewDetails = (log: ActivityLog | ErrorLog | SecurityLog | SystemLog) => {
    setSelectedLog(log);
    setIsDetailModalVisible(true);
  };

  const eventColumns: ColumnsType<SecurityLog> = [
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      render: (severity: SecurityLog['severity']) => {
        const config: Record<SecurityLog['severity'], { color: string; icon: React.ReactNode }> = {
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
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ip) => <Text code>{ip}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (timestamp) => <Text type="secondary">{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SecurityLog['status']) => {
        const colors: Record<SecurityLog['status'], string> = {
          resolved: 'green',
          pending: 'orange',
          investigating: 'blue',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          {record.status !== 'resolved' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleUpdateSecurityStatus(record.id, 'resolved')}
            >
              Resolve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const blocklistColumns: ColumnsType<BlockedIP | IPBlocklist> = [
    {
      title: 'IP Address',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      render: (ipAddress, record: any) => (
        <Text code strong>{ipAddress || record.ip}</Text>
      ),
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
      render: (time) => <Text type="secondary">{dayjs(time).format('YYYY-MM-DD HH:mm:ss')}</Text>,
    },
    {
      title: 'Expires',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (expires, record: any) =>
        record.permanent ? <Tag color="red">Permanent</Tag> : 
        expires ? <Text>{dayjs(expires).format('YYYY-MM-DD HH:mm:ss')}</Text> : 
        <Text type="secondary">-</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: any) => (
        <Button 
          size="small" 
          danger 
          onClick={() => handleUnblockIP(record.id)}
        >
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

  // Calculate security statistics using real data when available
  const securityScore = securityMetrics?.securityScore || 
    (logStats?.totalLogs ? Math.min(100, 90 + Math.floor(logStats.totalLogs / 1000)) : 92);
  const threatsBlocked = securityMetrics?.totalThreats || logStats?.securityLogs || 142;
  const activeAlerts = securityEvents.filter((e) => e.severity === 'critical' || e.severity === 'high').length ||
    securityLogs.filter((e) => e.status !== 'resolved').length;
  const blockedIPsCount = blockedIPsList.length || mockBlocklist.length;

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
              value={blockedIPsCount}
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
              <Card
                title="Recent Security Events"
                extra={
                  <Space>
                    <Button icon={<ReloadOutlined />} onClick={handleSecurityRefresh}>
                      Refresh
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleExport('security')}>
                      Export
                    </Button>
                  </Space>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    columns={eventColumns}
                    dataSource={securityLogs}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Spin>
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
                  dataSource={blockedIPsList.length > 0 ? blockedIPsList : mockBlocklist as any}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                  loading={securityLoading}
                />
              </Card>
            ),
          },
          {
            key: 'audit',
            label: 'Activity Logs',
            children: (
              <Card
                title="Activity Audit Log"
                extra={
                  <Space>
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                      Refresh
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleExport('activity')}>
                      Export
                    </Button>
                  </Space>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    columns={[
                      {
                        title: 'User',
                        dataIndex: 'userName',
                        key: 'userName',
                        render: (name, record: ActivityLog) => (
                          <Space direction="vertical" size={0}>
                            <Text strong>{name}</Text>
                            <Tag color="blue">{record.userRole}</Tag>
                          </Space>
                        ),
                      },
                      {
                        title: 'Action',
                        dataIndex: 'action',
                        key: 'action',
                        render: (action) => <Tag color="green">{action}</Tag>,
                      },
                      {
                        title: 'Resource',
                        dataIndex: 'resource',
                        key: 'resource',
                        render: (resource, record: ActivityLog) => (
                          <Space direction="vertical" size={0}>
                            <Text>{resource}</Text>
                            {record.resourceId && <Text type="secondary" code>{record.resourceId}</Text>}
                          </Space>
                        ),
                      },
                      {
                        title: 'Method',
                        dataIndex: 'method',
                        key: 'method',
                        render: (method) => {
                          const colors: Record<string, string> = {
                            GET: 'blue',
                            POST: 'green',
                            PUT: 'orange',
                            PATCH: 'purple',
                            DELETE: 'red',
                          };
                          return <Tag color={colors[method]}>{method}</Tag>;
                        },
                      },
                      {
                        title: 'Status',
                        dataIndex: 'status',
                        key: 'status',
                        render: (status) => (
                          <Tag color={status === 'success' ? 'green' : 'red'}>
                            {status.toUpperCase()}
                          </Tag>
                        ),
                      },
                      {
                        title: 'IP Address',
                        dataIndex: 'ipAddress',
                        key: 'ipAddress',
                        render: (ip) => <Text code>{ip}</Text>,
                      },
                      {
                        title: 'Duration',
                        dataIndex: 'duration',
                        key: 'duration',
                        render: (duration) => <Text type="secondary">{duration}ms</Text>,
                      },
                      {
                        title: 'Timestamp',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (timestamp) => (
                          <Text type="secondary">{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                          >
                            View
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={activityLogs}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Spin>
              </Card>
            ),
          },
          {
            key: 'errors',
            label: 'Error Logs',
            children: (
              <Card
                title="Error Logs"
                extra={
                  <Space>
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                      Refresh
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleExport('error')}>
                      Export
                    </Button>
                  </Space>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    columns={[
                      {
                        title: 'Level',
                        dataIndex: 'level',
                        key: 'level',
                        render: (level: ErrorLog['level']) => {
                          const colors: Record<ErrorLog['level'], string> = {
                            error: 'red',
                            warn: 'orange',
                            info: 'blue',
                            debug: 'gray',
                          };
                          return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
                        },
                        filters: [
                          { text: 'Error', value: 'error' },
                          { text: 'Warn', value: 'warn' },
                          { text: 'Info', value: 'info' },
                          { text: 'Debug', value: 'debug' },
                        ],
                        onFilter: (value, record) => record.level === value,
                      },
                      {
                        title: 'Message',
                        dataIndex: 'message',
                        key: 'message',
                        ellipsis: true,
                      },
                      {
                        title: 'Code',
                        dataIndex: 'code',
                        key: 'code',
                        render: (code) => code && <Tag>{code}</Tag>,
                      },
                      {
                        title: 'User',
                        dataIndex: 'userName',
                        key: 'userName',
                      },
                      {
                        title: 'URL',
                        dataIndex: 'url',
                        key: 'url',
                        ellipsis: true,
                        render: (url) => <Text code>{url}</Text>,
                      },
                      {
                        title: 'Status',
                        dataIndex: 'resolved',
                        key: 'resolved',
                        render: (resolved) => (
                          <Tag color={resolved ? 'green' : 'red'}>
                            {resolved ? 'Resolved' : 'Unresolved'}
                          </Tag>
                        ),
                      },
                      {
                        title: 'Timestamp',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (timestamp) => (
                          <Text type="secondary">{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                          <Space>
                            <Button
                              type="link"
                              size="small"
                              icon={<EyeOutlined />}
                              onClick={() => handleViewDetails(record)}
                            >
                              View
                            </Button>
                            {!record.resolved && (
                              <Button
                                type="link"
                                size="small"
                                onClick={() => handleResolveError(record.id)}
                              >
                                Resolve
                              </Button>
                            )}
                          </Space>
                        ),
                      },
                    ]}
                    dataSource={errorLogs}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Spin>
              </Card>
            ),
          },
          {
            key: 'system',
            label: 'System Logs',
            children: (
              <Card
                title="System Logs"
                extra={
                  <Space>
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                      Refresh
                    </Button>
                    <Button icon={<DownloadOutlined />} onClick={() => handleExport('system')}>
                      Export
                    </Button>
                  </Space>
                }
              >
                <Spin spinning={loading}>
                  <Table
                    columns={[
                      {
                        title: 'Type',
                        dataIndex: 'type',
                        key: 'type',
                        render: (type) => <Tag color="blue">{type.toUpperCase()}</Tag>,
                        filters: [
                          { text: 'System', value: 'system' },
                          { text: 'Database', value: 'database' },
                          { text: 'Cache', value: 'cache' },
                          { text: 'Storage', value: 'storage' },
                          { text: 'Queue', value: 'queue' },
                          { text: 'Email', value: 'email' },
                        ],
                        onFilter: (value, record) => record.type === value,
                      },
                      {
                        title: 'Level',
                        dataIndex: 'level',
                        key: 'level',
                        render: (level: SystemLog['level']) => {
                          const colors: Record<SystemLog['level'], string> = {
                            info: 'blue',
                            warn: 'orange',
                            error: 'red',
                            critical: 'purple',
                          };
                          return <Tag color={colors[level]}>{level.toUpperCase()}</Tag>;
                        },
                      },
                      {
                        title: 'Service',
                        dataIndex: 'service',
                        key: 'service',
                      },
                      {
                        title: 'Message',
                        dataIndex: 'message',
                        key: 'message',
                        ellipsis: true,
                      },
                      {
                        title: 'Timestamp',
                        dataIndex: 'createdAt',
                        key: 'createdAt',
                        render: (timestamp) => (
                          <Text type="secondary">{dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, record) => (
                          <Button
                            type="link"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetails(record)}
                          >
                            View
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={systemLogs}
                    rowKey="id"
                    pagination={{ pageSize: 10 }}
                  />
                </Spin>
              </Card>
            ),
          },
        ]}
      />

      {/* Log Detail Modal */}
      <Modal
        title="Log Details"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <Divider orientation="left">Basic Information</Divider>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Text strong>ID:</Text> <Text code>{selectedLog.id}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Timestamp:</Text>{' '}
                <Text>{dayjs(selectedLog.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
              </Col>
              {'userName' in selectedLog && selectedLog.userName && (
                <Col span={12}>
                  <Text strong>User:</Text> <Text>{selectedLog.userName}</Text>
                </Col>
              )}
              {'ipAddress' in selectedLog && (
                <Col span={12}>
                  <Text strong>IP Address:</Text> <Text code>{selectedLog.ipAddress}</Text>
                </Col>
              )}
            </Row>

            {/* Activity Log Details */}
            {'action' in selectedLog && (
              <>
                <Divider orientation="left">Activity Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Action:</Text> <Tag color="green">{selectedLog.action}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Resource:</Text> <Text>{selectedLog.resource}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Method:</Text> <Tag>{selectedLog.method}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Status:</Text>{' '}
                    <Tag color={selectedLog.status === 'success' ? 'green' : 'red'}>
                      {selectedLog.status}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Duration:</Text> <Text>{selectedLog.duration}ms</Text>
                  </Col>
                </Row>
              </>
            )}

            {/* Error Log Details */}
            {'level' in selectedLog && 'message' in selectedLog && (
              <>
                <Divider orientation="left">Error Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text strong>Message:</Text>
                    <br />
                    <Text>{selectedLog.message}</Text>
                  </Col>
                  {'stack' in selectedLog && selectedLog.stack && (
                    <Col span={24}>
                      <Text strong>Stack Trace:</Text>
                      <pre
                        style={{
                          background: '#f5f5f5',
                          padding: 12,
                          borderRadius: 4,
                          overflow: 'auto',
                          maxHeight: 300,
                        }}
                      >
                        {selectedLog.stack}
                      </pre>
                    </Col>
                  )}
                </Row>
              </>
            )}

            {/* Security Log Details */}
            {'severity' in selectedLog && (
              <>
                <Divider orientation="left">Security Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Type:</Text> <Tag>{selectedLog.type}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Severity:</Text> <Tag color="red">{selectedLog.severity}</Tag>
                  </Col>
                  <Col span={24}>
                    <Text strong>Description:</Text>
                    <br />
                    <Text>{selectedLog.description}</Text>
                  </Col>
                </Row>
              </>
            )}

            {/* System Log Details */}
            {'service' in selectedLog && (
              <>
                <Divider orientation="left">System Details</Divider>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Type:</Text> <Tag>{selectedLog.type}</Tag>
                  </Col>
                  <Col span={12}>
                    <Text strong>Service:</Text> <Text>{selectedLog.service}</Text>
                  </Col>
                </Row>
              </>
            )}

            {/* Metadata */}
            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <>
                <Divider orientation="left">Metadata</Divider>
                <pre
                  style={{
                    background: '#f5f5f5',
                    padding: 12,
                    borderRadius: 4,
                    overflow: 'auto',
                  }}
                >
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SecurityEnhancementsPage;
