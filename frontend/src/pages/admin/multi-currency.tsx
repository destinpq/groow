import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Table,
  Tag,
  Statistic,
  Space,
  Switch,
  Button,
  InputNumber,
  Alert,
  Divider,
  message,
} from 'antd';
import {
  DollarOutlined,
  SwapOutlined,
  GlobalOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
  change24h: number;
}

interface ConversionHistory {
  id: number;
  from: string;
  to: string;
  amount: number;
  result: number;
  rate: number;
  timestamp: string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.0, change24h: 0 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92, change24h: -0.15 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79, change24h: 0.23 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.50, change24h: 0.45 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36, change24h: -0.08 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.52, change24h: 0.12 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.88, change24h: -0.05 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.24, change24h: 0.18 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.12, change24h: 0.35 },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽', rate: 17.15, change24h: -0.22 },
];

const MultiCurrencyPage: React.FC = () => {
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(100);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(true);
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(dayjs().format('HH:mm:ss'));

  const baseCurrencyData = currencies.find((c) => c.code === baseCurrency);
  const targetCurrencyData = currencies.find((c) => c.code === selectedCurrency);

  useEffect(() => {
    if (autoUpdate) {
      const interval = setInterval(() => {
        handleRefreshRates();
      }, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [autoUpdate]);

  useEffect(() => {
    handleConvert();
  }, [amount, baseCurrency, selectedCurrency]);

  const handleConvert = () => {
    if (!baseCurrencyData || !targetCurrencyData) return;

    // Convert to USD first, then to target currency
    const amountInUSD = amount / baseCurrencyData.rate;
    const result = amountInUSD * targetCurrencyData.rate;
    setConvertedAmount(result);
  };

  const handleSaveConversion = () => {
    if (!baseCurrencyData || !targetCurrencyData) return;

    const rate = targetCurrencyData.rate / baseCurrencyData.rate;
    const newHistory: ConversionHistory = {
      id: Date.now(),
      from: baseCurrency,
      to: selectedCurrency,
      amount,
      result: convertedAmount,
      rate,
      timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    setHistory([newHistory, ...history]);
    message.success('Conversion saved to history');
  };

  const handleRefreshRates = () => {
    // Simulate rate refresh
    setLastUpdated(dayjs().format('HH:mm:ss'));
    message.success('Exchange rates updated');
  };

  const handleSwapCurrencies = () => {
    setBaseCurrency(selectedCurrency);
    setSelectedCurrency(baseCurrency);
    message.info('Currencies swapped');
  };

  const currencyColumns: ColumnsType<Currency> = [
    {
      title: 'Currency',
      key: 'currency',
      render: (_, record) => (
        <Space>
          <span style={{ fontSize: 24 }}>{record.flag}</span>
          <div>
            <Text strong>{record.code}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.name}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Symbol',
      dataIndex: 'symbol',
      key: 'symbol',
      render: (symbol) => <Text code>{symbol}</Text>,
    },
    {
      title: 'Exchange Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate, record) => (
        <Text strong>
          1 USD = {rate.toFixed(4)} {record.code}
        </Text>
      ),
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: '24h Change',
      dataIndex: 'change24h',
      key: 'change24h',
      render: (change) => {
        const isPositive = change >= 0;
        return (
          <Tag color={isPositive ? 'green' : 'red'} icon={isPositive ? <RiseOutlined /> : <FallOutlined />}>
            {isPositive ? '+' : ''}
            {change.toFixed(2)}%
          </Tag>
        );
      },
      sorter: (a, b) => a.change24h - b.change24h,
    },
  ];

  const historyColumns: ColumnsType<ConversionHistory> = [
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      render: (code) => <Tag color="green">{code}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const currency = currencies.find((c) => c.code === record.from);
        return `${currency?.symbol || ''}${amount.toFixed(2)}`;
      },
    },
    {
      title: 'Result',
      dataIndex: 'result',
      key: 'result',
      render: (result, record) => {
        const currency = currencies.find((c) => c.code === record.to);
        return (
          <Text strong>
            {currency?.symbol || ''}
            {result.toFixed(2)}
          </Text>
        );
      },
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => rate.toFixed(4),
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ];

  const rate = targetCurrencyData && baseCurrencyData
    ? targetCurrencyData.rate / baseCurrencyData.rate
    : 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3}>
              <GlobalOutlined style={{ color: '#1890ff' }} /> Multi-Currency Support
            </Title>
            <Paragraph type="secondary">
              Real-time currency conversion and exchange rates
            </Paragraph>
          </div>
          <Space>
            <Text type="secondary">Auto Update</Text>
            <Switch checked={autoUpdate} onChange={setAutoUpdate} />
          </Space>
        </div>
      </div>

      <Alert
        message="Live Exchange Rates"
        description={`Rates last updated at ${lastUpdated}. Auto-update is ${autoUpdate ? 'enabled' : 'disabled'}.`}
        type="info"
        showIcon
        action={
          <Button size="small" icon={<ReloadOutlined />} onClick={handleRefreshRates}>
            Refresh
          </Button>
        }
        style={{ marginBottom: 24 }}
      />

      <Row gutter={16}>
        {/* Currency Converter */}
        <Col xs={24} lg={12}>
          <Card title="Currency Converter">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {/* From Currency */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  From
                </Text>
                <Space.Compact style={{ width: '100%' }}>
                  <Select
                    value={baseCurrency}
                    onChange={setBaseCurrency}
                    style={{ width: '40%' }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {currencies.map((c) => (
                      <Select.Option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </Select.Option>
                    ))}
                  </Select>
                  <InputNumber
                    value={amount}
                    onChange={(val) => setAmount(val || 0)}
                    style={{ width: '60%' }}
                    min={0}
                    step={0.01}
                    precision={2}
                    prefix={baseCurrencyData?.symbol}
                  />
                </Space.Compact>
              </div>

              {/* Swap Button */}
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="dashed"
                  icon={<SwapOutlined />}
                  onClick={handleSwapCurrencies}
                  size="large"
                >
                  Swap
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  To
                </Text>
                <Space.Compact style={{ width: '100%' }}>
                  <Select
                    value={selectedCurrency}
                    onChange={setSelectedCurrency}
                    style={{ width: '40%' }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {currencies.map((c) => (
                      <Select.Option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </Select.Option>
                    ))}
                  </Select>
                  <InputNumber
                    value={convertedAmount}
                    style={{ width: '60%' }}
                    disabled
                    precision={2}
                    prefix={targetCurrencyData?.symbol}
                  />
                </Space.Compact>
              </div>

              <Divider />

              {/* Exchange Rate Info */}
              <Card size="small" style={{ background: '#f0f2f5' }}>
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Exchange Rate:</Text>
                    <Text strong>1 {baseCurrency} = {rate.toFixed(4)} {selectedCurrency}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Inverse Rate:</Text>
                    <Text>1 {selectedCurrency} = {(1 / rate).toFixed(4)} {baseCurrency}</Text>
                  </div>
                </Space>
              </Card>

              <Button type="primary" block icon={<DollarOutlined />} onClick={handleSaveConversion}>
                Save Conversion
              </Button>
            </Space>
          </Card>

          {/* Conversion History */}
          {history.length > 0 && (
            <Card title="Conversion History" style={{ marginTop: 16 }}>
              <Table
                columns={historyColumns}
                dataSource={history}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                size="small"
              />
            </Card>
          )}
        </Col>

        {/* Exchange Rates & Stats */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Supported Currencies"
                  value={currencies.length}
                  prefix={<GlobalOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Conversions Today"
                  value={history.length}
                  prefix={<SwapOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="All Exchange Rates">
            <Table
              columns={currencyColumns}
              dataSource={currencies}
              rowKey="code"
              pagination={false}
              size="small"
              scroll={{ y: 400 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MultiCurrencyPage;
