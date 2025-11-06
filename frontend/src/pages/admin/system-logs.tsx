import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Select,
  DatePicker,
  Input,
  Tag,
  Row,
  Col,
  Typography,
  Spin,
  Badge,
  Tooltip,
  Modal,
  message,
  Alert,
  Divider,
  Statistic,
} from 'antd';
import {
  SearchOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { systemLogsAPI } from '@/services/api';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
  module: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  endpoint?: string;
  statusCode?: number;
  responseTime?: number;
  stackTrace?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  createdAt: string;
}

interface LogStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  debug: number;
  last24Hours: number;
}

const SystemLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    level: '',
    source: '',
    dateRange: null as any,
    search: '',
  });
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const logLevels = [
    { value: 'info', label: 'Info', color: 'blue', icon: <InfoCircleOutlined /> },
    { value: 'warning', label: 'Warning', color: 'orange', icon: <WarningOutlined /> },
    { value: 'error', label: 'Error', color: 'red', icon: <CloseCircleOutlined /> },
    { value: 'debug', label: 'Debug', color: 'gray', icon: <ExclamationCircleOutlined /> },
  ];

  const logSources = [
    'api',
    'auth',
    'database',
    'payment',
    'email',
    'cron',
    'upload',
    'order',
    'product',
    'user',
  ];

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        level: filters.level || undefined,
        source: filters.source || undefined,
        search: filters.search || undefined,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString(),
      };

      const response = await systemLogsAPI.getAll(params);
      setLogs(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      message.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await systemLogsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch log stats');
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleTableChange = (page: any) => {
    setPagination(prev => ({
      ...prev,
      current: page.current,
      pageSize: page.pageSize,
    }));
  };

  const handleExport = async () => {
    try {
      const params = {
        level: filters.level || undefined,
        source: filters.source || undefined,
        search: filters.search || undefined,
        startDate: filters.dateRange?.[0]?.toISOString(),
        endDate: filters.dateRange?.[1]?.toISOString(),
        format: 'csv',
      };

      const response = await systemLogsAPI.export(params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `system-logs-${dayjs().format('YYYY-MM-DD')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      message.success('Logs exported successfully');
    } catch (error) {
      message.error('Failed to export logs');
    }
  };

  const handleClearLogs = () => {
    Modal.confirm({
      title: 'Clear System Logs',
      content: 'Are you sure you want to clear all system logs? This action cannot be undone.',
      icon: <ExclamationCircleOutlined />,
      okText: 'Clear All',
      okType: 'danger',
      onOk: async () => {
        try {
          await systemLogsAPI.clear();
          message.success('System logs cleared successfully');
          fetchLogs();
          fetchStats();
        } catch (error) {
          message.error('Failed to clear system logs');
        }
      },
    });
  };

  const handleViewDetails = (log: SystemLog) => {
    setSelectedLog(log);
    setDetailVisible(true);
  };

  const getLevelConfig = (level: string) => {
    return logLevels.find(l => l.value === level) || logLevels[0];
  };

  const columns = [
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (level: string) => {
        const config = getLevelConfig(level);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp: string) => (
        <Text style={{ fontSize: '12px' }}>
          {dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}
        </Text>
      ),
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      width: 100,
      render: (source: string) => (
        <Tag color="blue">{source}</Tag>
      ),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      render: (module: string) => (
        <Text code style={{ fontSize: '12px' }}>{module}</Text>
      ),
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      render: (message: string, record: SystemLog) => (
        <Tooltip title={message}>
          <Text style={{ fontSize: '12px' }}>
            {message.length > 80 ? `${message.substring(0, 80)}...` : message}
            {record.stackTrace && (
              <Badge
                count="Stack"
                style={{ backgroundColor: '#f50', marginLeft: 8, fontSize: '10px' }}
              />
            )}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'User',
      dataIndex: 'userEmail',
      key: 'userEmail',
      width: 150,
      render: (email: string, record: SystemLog) => (
        email ? (
          <Space direction="vertical" size={0}>
            <Text style={{ fontSize: '11px' }}>{email}</Text>
            {record.ip && (
              <Text type="secondary" style={{ fontSize: '10px' }}>
                {record.ip}
              </Text>
            )}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'API Details',
      key: 'apiDetails',
      width: 120,
      render: (_: any, record: SystemLog) => (
        record.method && record.endpoint ? (
          <Space direction="vertical" size={0}>
            <Tag color={record.method === 'GET' ? 'green' : record.method === 'POST' ? 'blue' : 'orange'}>
              {record.method}
            </Tag>
            <Text style={{ fontSize: '10px' }}>{record.endpoint}</Text>
            {record.statusCode && (
              <Badge
                count={record.statusCode}
                style={{
                  backgroundColor: record.statusCode < 400 ? '#52c41a' : '#f5222d',
                  fontSize: '10px',
                }}
              />
            )}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_: any, record: SystemLog) => (
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'System Logs',
        breadcrumb: {
          items: [
            { title: 'Admin' },
            { title: 'System Logs' },
          ],
        },
      }}
    >
      {/* Statistics Cards */}
      {stats && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Logs"
                value={stats.total}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Errors"
                value={stats.errors}
                valueStyle={{ color: '#f5222d' }}
                prefix={<CloseCircleOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Warnings"
                value={stats.warnings}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<WarningOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Last 24h"
                value={stats.last24Hours}
                valueStyle={{ color: '#52c41a' }}
                prefix={<InfoCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        {/* Filters */}
        <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Search
              placeholder="Search logs..."
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Log Level"
              allowClear
              style={{ width: '100%' }}
              value={filters.level || undefined}
              onChange={(value) => handleFilterChange('level', value)}
            >
              {logLevels.map(level => (
                <Option key={level.value} value={level.value}>
                  {level.icon} {level.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Source"
              allowClear
              style={{ width: '100%' }}
              value={filters.source || undefined}
              onChange={(value) => handleFilterChange('source', value)}
            >
              {logSources.map(source => (
                <Option key={source} value={source}>
                  {source}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange}
              onChange={(dates) => handleFilterChange('dateRange', dates)}
              showTime
            />
          </Col>
          <Col span={4}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  fetchLogs();
                  fetchStats();
                }}
              />
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearLogs}
              >
                Clear
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Warning for errors */}
        {stats && stats.errors > 0 && (
          <Alert
            message={`${stats.errors} error logs found`}
            description="Please review error logs for potential system issues."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} logs`,
            pageSizeOptions: ['25', '50', '100', '200'],
          }}
          onChange={handleTableChange}
          size="small"
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Log Details Modal */}
      <Modal
        title="Log Details"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedLog && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Level: </Text>
                    <Tag color={getLevelConfig(selectedLog.level).color}>
                      {getLevelConfig(selectedLog.level).label}
                    </Tag>
                  </div>
                  <div>
                    <Text strong>Timestamp: </Text>
                    <Text>{dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}</Text>
                  </div>
                  <div>
                    <Text strong>Source: </Text>
                    <Tag color="blue">{selectedLog.source}</Tag>
                  </div>
                  <div>
                    <Text strong>Module: </Text>
                    <Text code>{selectedLog.module}</Text>
                  </div>
                </Space>
              </Col>
              <Col span={12}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  {selectedLog.userEmail && (
                    <div>
                      <Text strong>User: </Text>
                      <Text>{selectedLog.userEmail}</Text>
                    </div>
                  )}
                  {selectedLog.ip && (
                    <div>
                      <Text strong>IP Address: </Text>
                      <Text code>{selectedLog.ip}</Text>
                    </div>
                  )}
                  {selectedLog.method && selectedLog.endpoint && (
                    <div>
                      <Text strong>API: </Text>
                      <Tag color="blue">{selectedLog.method}</Tag>
                      <Text code>{selectedLog.endpoint}</Text>
                    </div>
                  )}
                  {selectedLog.statusCode && (
                    <div>
                      <Text strong>Status: </Text>
                      <Badge
                        count={selectedLog.statusCode}
                        style={{
                          backgroundColor: selectedLog.statusCode < 400 ? '#52c41a' : '#f5222d',
                        }}
                      />
                    </div>
                  )}
                </Space>
              </Col>
            </Row>

            <Divider>Message</Divider>
            <div
              style={{
                padding: 12,
                backgroundColor: '#f5f5f5',
                borderRadius: 4,
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace',
                fontSize: '12px',
              }}
            >
              {selectedLog.message}
            </div>

            {selectedLog.stackTrace && (
              <>
                <Divider>Stack Trace</Divider>
                <div
                  style={{
                    padding: 12,
                    backgroundColor: '#fff2f0',
                    borderRadius: 4,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    border: '1px solid #ffccc7',
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  {selectedLog.stackTrace}
                </div>
              </>
            )}

            {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
              <>
                <Divider>Metadata</Divider>
                <pre
                  style={{
                    padding: 12,
                    backgroundColor: '#f0f5ff',
                    borderRadius: 4,
                    fontSize: '11px',
                    border: '1px solid #adc6ff',
                    maxHeight: 150,
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
    </PageContainer>
  );
};

export default SystemLogsPage;