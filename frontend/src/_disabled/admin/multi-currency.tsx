import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Space,
  Button,
  Statistic,
  Select,
  DatePicker,
  Tabs,
  Alert,
  List,
  Avatar,
  message,
  Spin,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Tooltip,
  Popconfirm,
  Badge,
  Divider,
  Progress,
  Empty,
  Dropdown,
  Upload,
  Radio,
  Checkbox,
} from 'antd';
import {
  DollarOutlined,
  GlobalOutlined,
  SwapOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  FlagOutlined,
  BankOutlined,
  SwapRightOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  SyncOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/charts';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { currencyAPI, Currency, ExchangeRate, CurrencyStats, CurrencySettings } from '../../services/api/currency';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { TabPane } = Tabs;

const MultiCurrencyPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [stats, setStats] = useState<CurrencyStats | null>(null);
  const [settings, setSettings] = useState<CurrencySettings | null>(null);
  const [activeTab, setActiveTab] = useState('currencies');
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [rateHistoryModalOpen, setRateHistoryModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [selectedRatePair, setSelectedRatePair] = useState<{ from: string; to: string } | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);
  const [form] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const [refreshing, setRefreshing] = useState(false);

  // Load data
  useEffect(() => {
    loadCurrencies();
    loadExchangeRates();
    loadStats();
    loadSettings();
  }, [dateRange]);

  const loadCurrencies = async () => {
    setLoading(true);
    try {
      const response = await currencyAPI.getAll({ limit: 100 });
      setCurrencies(response.currencies);
    } catch (error) {
      console.error('Error loading currencies:', error);
      message.error('Failed to load currencies');
    } finally {
      setLoading(false);
    }
  };

  const loadExchangeRates = async () => {
    try {
      const rates = await currencyAPI.getExchangeRates();
      setExchangeRates(rates);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      message.error('Failed to load exchange rates');
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await currencyAPI.getStats({
        start: dateRange[0].format('YYYY-MM-DD'),
        end: dateRange[1].format('YYYY-MM-DD'),
      });
      setStats(statsData);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const settingsData = await currencyAPI.getSettings();
      setSettings(settingsData);
      settingsForm.setFieldsValue(settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
      message.error('Failed to load currency settings');
    }
  };

  const handleCreateCurrency = async (values: any) => {
    try {
      setLoading(true);
      await currencyAPI.create({
        code: values.code.toUpperCase(),
        name: values.name,
        symbol: values.symbol,
        symbolPosition: values.symbolPosition,
        decimalPlaces: values.decimalPlaces,
        thousandsSeparator: values.thousandsSeparator,
        decimalSeparator: values.decimalSeparator,
        isActive: values.isActive || false,
        isDefault: false,
        exchangeRate: values.exchangeRate || 1,
        countryCode: values.countryCode,
        displayFormat: values.displayFormat,
      });
      message.success('Currency created successfully');
      setCreateModalOpen(false);
      form.resetFields();
      loadCurrencies();
    } catch (error) {
      console.error('Error creating currency:', error);
      message.error('Failed to create currency');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCurrency = async (values: any) => {
    if (!selectedCurrency) return;
    
    try {
      setLoading(true);
      await currencyAPI.update(selectedCurrency.id, values);
      message.success('Currency updated successfully');
      setEditModalOpen(false);
      setSelectedCurrency(null);
      form.resetFields();
      loadCurrencies();
    } catch (error) {
      console.error('Error updating currency:', error);
      message.error('Failed to update currency');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCurrency = async (currencyId: string) => {
    try {
      await currencyAPI.delete(currencyId);
      message.success('Currency deleted successfully');
      loadCurrencies();
    } catch (error) {
      console.error('Error deleting currency:', error);
      message.error('Failed to delete currency');
    }
  };

  const handleSetDefault = async (currencyId: string) => {
    try {
      await currencyAPI.setDefault(currencyId);
      message.success('Default currency updated successfully');
      loadCurrencies();
    } catch (error) {
      console.error('Error setting default currency:', error);
      message.error('Failed to set default currency');
    }
  };

  const handleToggleActive = async (currency: Currency) => {
    try {
      if (currency.isActive) {
        await currencyAPI.deactivate(currency.id);
        message.success('Currency deactivated');
      } else {
        await currencyAPI.activate(currency.id);
        message.success('Currency activated');
      }
      loadCurrencies();
    } catch (error) {
      console.error('Error toggling currency status:', error);
      message.error('Failed to update currency status');
    }
  };

  const handleRefreshRates = async () => {
    setRefreshing(true);
    try {
      const result = await currencyAPI.refreshExchangeRates();
      message.success(`${result.updated} exchange rates updated successfully`);
      if (result.failed.length > 0) {
        message.warning(`Failed to update rates for: ${result.failed.join(', ')}`);
      }
      loadExchangeRates();
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
      message.error('Failed to refresh exchange rates');
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateSettings = async (values: any) => {
    try {
      setLoading(true);
      await currencyAPI.updateSettings(values);
      message.success('Currency settings updated successfully');
      setSettingsModalOpen(false);
      loadSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'csv' | 'xlsx' | 'json', type: 'currencies' | 'rates') => {
    try {
      setLoading(true);
      let blob: Blob;
      if (type === 'currencies') {
        blob = await currencyAPI.exportCurrencies(format);
      } else {
        blob = await currencyAPI.exportExchangeRates(format);
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${dayjs().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success(`${type} exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (from: string, to: string, amount: number) => {
    try {
      const result = await currencyAPI.convert(from, to, amount);
      return result;
    } catch (error) {
      console.error('Error converting currency:', error);
      message.error('Failed to convert currency');
      return null;
    }
  };

  const currencyColumns: ColumnsType<Currency> = [
    {
      title: 'Currency',
      key: 'currency',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            size="small"
            style={{ marginRight: 8, backgroundColor: '#1890ff' }}
          >
            {record.flag || record.code[0]}
          </Avatar>
          <div>
            <Text strong>{record.code}</Text>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.name}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol, record) => (
        <Text code>
          {record.symbolPosition === 'before' ? symbol : ''}
          1,234.56
          {record.symbolPosition === 'after' ? ` ${symbol}` : ''}
        </Text>
      ),
    },
    {
      title: 'Exchange Rate',
      dataIndex: 'exchangeRate',
      key: 'exchangeRate',
      render: (rate) => (
        <Text strong>{rate.toFixed(4)}</Text>
      ),
      sorter: (a, b) => a.exchangeRate - b.exchangeRate,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Space>
          <Tag color={record.isActive ? 'green' : 'red'}>
            {record.isActive ? 'Active' : 'Inactive'}
          </Tag>
          {record.isDefault && (
            <Tag color="gold" icon={<TrophyOutlined />}>
              Default
            </Tag>
          )}
        </Space>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Default', value: 'default' },
      ],
      onFilter: (value, record) => {
        if (value === 'active') return record.isActive;
        if (value === 'inactive') return !record.isActive;
        if (value === 'default') return record.isDefault;
        return true;
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.lastUpdated).unix() - dayjs(b.lastUpdated).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedCurrency(record);
                form.setFieldsValue(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title={record.isActive ? 'Deactivate' : 'Activate'}>
            <Button
              type="text"
              icon={record.isActive ? <CloseCircleOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleActive(record)}
              style={{ color: record.isActive ? '#ff4d4f' : '#52c41a' }}
            />
          </Tooltip>
          {!record.isDefault && (
            <Tooltip title="Set as Default">
              <Button
                type="text"
                icon={<TrophyOutlined />}
                onClick={() => handleSetDefault(record.id)}
                style={{ color: '#faad14' }}
              />
            </Tooltip>
          )}
          <Tooltip title="View Rate History">
            <Button
              type="text"
              icon={<LineChartOutlined />}
              onClick={() => {
                setSelectedRatePair({ from: record.code, to: settings?.defaultCurrency || 'USD' });
                setRateHistoryModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this currency?"
              onConfirm={() => handleDeleteCurrency(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                disabled={record.isDefault}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const ratesColumns: ColumnsType<ExchangeRate> = [
    {
      title: 'Currency Pair',
      key: 'pair',
      render: (_, record) => (
        <Text strong>
          {record.fromCurrency}/{record.toCurrency}
        </Text>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => <Text strong>{rate.toFixed(6)}</Text>,
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: 'Source',
      dataIndex: 'source',
      key: 'source',
      render: (source) => (
        <Tag color={source === 'api' ? 'blue' : source === 'manual' ? 'orange' : 'green'}>
          {source.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Provider',
      dataIndex: 'provider',
      key: 'provider',
      render: (provider) => provider || '-',
    },
    {
      title: 'Last Updated',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => dayjs(timestamp).format('MMM DD, HH:mm'),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View History">
            <Button
              type="text"
              icon={<LineChartOutlined />}
              onClick={() => {
                setSelectedRatePair({ from: record.fromCurrency, to: record.toCurrency });
                setRateHistoryModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const exportMenuItems = [
    {
      key: 'currencies-csv',
      label: (
        <Space>
          <FileTextOutlined />
          Export Currencies (CSV)
        </Space>
      ),
      onClick: () => handleExport('csv', 'currencies'),
    },
    {
      key: 'currencies-xlsx',
      label: (
        <Space>
          <FileExcelOutlined />
          Export Currencies (Excel)
        </Space>
      ),
      onClick: () => handleExport('xlsx', 'currencies'),
    },
    {
      key: 'rates-csv',
      label: (
        <Space>
          <FileTextOutlined />
          Export Rates (CSV)
        </Space>
      ),
      onClick: () => handleExport('csv', 'rates'),
    },
    {
      key: 'rates-xlsx',
      label: (
        <Space>
          <FileExcelOutlined />
          Export Rates (Excel)
        </Space>
      ),
      onClick: () => handleExport('xlsx', 'rates'),
    },
  ];

  const revenueByCurrentData = stats?.revenueByCurrency ? 
    Object.entries(stats.revenueByCurrency).map(([code, revenue]) => ({
      currency: code,
      revenue: revenue,
    })) : [];

  const conversionVolumeData = stats?.conversionVolume || [];

  return (
    <Spin spinning={loading} tip="Loading currency data...">
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={3}>
                <GlobalOutlined style={{ color: '#1890ff' }} /> Multi-Currency Management
              </Title>
              <Paragraph type="secondary">
                Manage currencies, exchange rates, and international pricing with real-time data
              </Paragraph>
            </div>
            <Space>
              <RangePicker
                value={dateRange}
                onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
              />
              <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                <Button icon={<DownloadOutlined />}>
                  Export
                </Button>
              </Dropdown>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSettingsModalOpen(true)}
              >
                Settings
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalOpen(true)}
              >
                Add Currency
              </Button>
            </Space>
          </div>
        </div>

        {/* Alert */}
        <Alert
          message="Multi-Currency Support"
          description="Manage global currencies with real-time exchange rates, automatic conversions, and localized pricing. Monitor currency performance and revenue analytics."
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Active Currencies"
                value={stats?.activeCurrencies || 0}
                prefix={<GlobalOutlined />}
                valueStyle={{ color: '#52c41a' }}
                suffix={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    /{stats?.totalCurrencies || 0} total
                  </Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total Conversions"
                value={stats?.totalConversions || 0}
                prefix={<SwapOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Revenue (Multi-Currency)"
                value={Object.values(stats?.revenueByCurrency || {}).reduce((sum, val) => sum + val, 0)}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#722ed1' }}
                precision={2}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Exchange Rate Updates"
                value={exchangeRates.filter(r => dayjs(r.timestamp).isAfter(dayjs().subtract(1, 'day'))).length}
                prefix={<SyncOutlined />}
                valueStyle={{ color: '#faad14' }}
                suffix={
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    /24h
                  </Text>
                }
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane
            tab={
              <span>
                <GlobalOutlined />
                Currencies ({currencies.length})
              </span>
            }
            key="currencies"
          >
            <Card
              extra={
                <Space>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={loadCurrencies}
                    loading={loading}
                  >
                    Refresh
                  </Button>
                </Space>
              }
            >
              <Table
                columns={currencyColumns}
                dataSource={currencies}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} currencies`,
                }}
                scroll={{ x: 1200 }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SwapRightOutlined />
                Exchange Rates ({exchangeRates.length})
              </span>
            }
            key="rates"
          >
            <Card
              extra={
                <Space>
                  <Button
                    icon={<SyncOutlined />}
                    onClick={handleRefreshRates}
                    loading={refreshing}
                    type="primary"
                  >
                    Refresh Rates
                  </Button>
                </Space>
              }
            >
              <Table
                columns={ratesColumns}
                dataSource={exchangeRates}
                rowKey={(record) => `${record.fromCurrency}-${record.toCurrency}`}
                pagination={{
                  pageSize: 15,
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} exchange rates`,
                }}
              />
            </Card>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BarChartOutlined />
                Analytics
              </span>
            }
            key="analytics"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card title="Revenue by Currency">
                  <Column
                    data={revenueByCurrentData}
                    xField="currency"
                    yField="revenue"
                    label={{
                      position: 'top',
                      style: {
                        fill: '#000000',
                        opacity: 0.6,
                      },
                    }}
                    height={300}
                  />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Top Currencies by Usage">
                  <List
                    dataSource={stats?.topCurrencies || []}
                    renderItem={(currency, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              style={{
                                backgroundColor: ['#1890ff', '#52c41a', '#faad14', '#722ed1'][index % 4],
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          }
                          title={`${currency.code} - ${currency.name}`}
                          description={`${currency.conversions} conversions • $${currency.revenue.toLocaleString()} revenue`}
                        />
                        <div style={{ textAlign: 'right' }}>
                          <Text strong>{currency.percentage.toFixed(1)}%</Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
              <Col xs={24}>
                <Card title="Conversion Volume Trend">
                  <Area
                    data={conversionVolumeData}
                    xField="date"
                    yField="volume"
                    height={300}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        {/* Create Currency Modal */}
        <Modal
          title="Add New Currency"
          open={createModalOpen}
          onCancel={() => {
            setCreateModalOpen(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateCurrency}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="Currency Code"
                  rules={[
                    { required: true, message: 'Please enter currency code' },
                    { len: 3, message: 'Currency code must be 3 characters' },
                  ]}
                >
                  <Input placeholder="USD" maxLength={3} style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Currency Name"
                  rules={[{ required: true, message: 'Please enter currency name' }]}
                >
                  <Input placeholder="US Dollar" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="symbol"
                  label="Symbol"
                  rules={[{ required: true, message: 'Please enter symbol' }]}
                >
                  <Input placeholder="$" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="symbolPosition"
                  label="Symbol Position"
                  rules={[{ required: true, message: 'Please select position' }]}
                >
                  <Select>
                    <Select.Option value="before">Before ($100)</Select.Option>
                    <Select.Option value="after">After (100$)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="decimalPlaces"
                  label="Decimal Places"
                  rules={[{ required: true, message: 'Please enter decimal places' }]}
                >
                  <InputNumber min={0} max={4} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="exchangeRate"
                  label="Exchange Rate (to default currency)"
                  rules={[{ required: true, message: 'Please enter exchange rate' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.0001}
                    precision={4}
                    style={{ width: '100%' }}
                    placeholder="1.0000"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="countryCode"
                  label="Country Code"
                >
                  <Input placeholder="US" maxLength={2} style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="displayFormat"
                  label="Display Format"
                  rules={[{ required: true, message: 'Please enter display format' }]}
                >
                  <Input placeholder="$1,234.56" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setCreateModalOpen(false);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Add Currency
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Edit Currency Modal */}
        <Modal
          title="Edit Currency"
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setSelectedCurrency(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleUpdateCurrency}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Currency Name"
                  rules={[{ required: true, message: 'Please enter currency name' }]}
                >
                  <Input placeholder="US Dollar" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="symbol"
                  label="Symbol"
                  rules={[{ required: true, message: 'Please enter symbol' }]}
                >
                  <Input placeholder="$" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="symbolPosition"
                  label="Symbol Position"
                  rules={[{ required: true, message: 'Please select position' }]}
                >
                  <Select>
                    <Select.Option value="before">Before ($100)</Select.Option>
                    <Select.Option value="after">After (100$)</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="exchangeRate"
                  label="Exchange Rate"
                  rules={[{ required: true, message: 'Please enter exchange rate' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.0001}
                    precision={4}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="isActive"
                  label="Active"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => {
                  setEditModalOpen(false);
                  setSelectedCurrency(null);
                  form.resetFields();
                }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Currency
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>

        {/* Settings Modal */}
        <Modal
          title="Currency Settings"
          open={settingsModalOpen}
          onCancel={() => setSettingsModalOpen(false)}
          footer={null}
          width={800}
        >
          <Form
            form={settingsForm}
            layout="vertical"
            onFinish={handleUpdateSettings}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="defaultCurrency"
                  label="Default Currency"
                  rules={[{ required: true, message: 'Please select default currency' }]}
                >
                  <Select placeholder="Select default currency">
                    {currencies.map(currency => (
                      <Select.Option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fallbackCurrency"
                  label="Fallback Currency"
                  rules={[{ required: true, message: 'Please select fallback currency' }]}
                >
                  <Select placeholder="Select fallback currency">
                    {currencies.map(currency => (
                      <Select.Option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="rateProvider"
                  label="Exchange Rate Provider"
                  rules={[{ required: true, message: 'Please select rate provider' }]}
                >
                  <Select>
                    <Select.Option value="fixer">Fixer.io</Select.Option>
                    <Select.Option value="openexchangerates">Open Exchange Rates</Select.Option>
                    <Select.Option value="currencylayer">CurrencyLayer</Select.Option>
                    <Select.Option value="exchangeratesapi">ExchangeRates API</Select.Option>
                    <Select.Option value="manual">Manual</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="updateFrequency"
                  label="Update Frequency"
                  rules={[{ required: true, message: 'Please select update frequency' }]}
                >
                  <Select>
                    <Select.Option value="realtime">Real-time</Select.Option>
                    <Select.Option value="hourly">Hourly</Select.Option>
                    <Select.Option value="daily">Daily</Select.Option>
                    <Select.Option value="weekly">Weekly</Select.Option>
                    <Select.Option value="manual">Manual</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="markupPercentage"
                  label="Markup Percentage"
                  rules={[{ required: true, message: 'Please enter markup percentage' }]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    step={0.1}
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="autoUpdateRates"
                  label="Auto Update Rates"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="detectUserCurrency"
                  label="Detect User Currency"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="showCurrencySelector"
                  label="Show Currency Selector"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Space>
                <Button onClick={() => setSettingsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Settings
                </Button>
              </Space>
            </div>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default MultiCurrencyPage;
