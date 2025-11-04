import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  InputNumber,
  Space,
  Divider,
  Tag,
  Table,
  Alert,
} from 'antd';
import {
  DollarOutlined,
  SwapOutlined,
  InfoCircleOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.12 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.53 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.36 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', rate: 0.88 },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', rate: 7.83 },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.35 },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪', rate: 10.87 },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷', rate: 1320.50 },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴', rate: 10.72 },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', rate: 1.67 },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽', rate: 17.15 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷', rate: 4.98 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', rate: 18.65 },
];

const popularPairs: ExchangeRate[] = [
  {
    from: 'USD',
    to: 'EUR',
    rate: 0.92,
    change: 0.005,
    changePercent: 0.55,
    lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    from: 'USD',
    to: 'GBP',
    rate: 0.79,
    change: -0.003,
    changePercent: -0.38,
    lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    from: 'USD',
    to: 'JPY',
    rate: 149.50,
    change: 1.20,
    changePercent: 0.81,
    lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    from: 'EUR',
    to: 'GBP',
    rate: 0.86,
    change: -0.002,
    changePercent: -0.23,
    lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    from: 'GBP',
    to: 'USD',
    rate: 1.27,
    change: 0.004,
    changePercent: 0.32,
    lastUpdated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
];

const CurrencyConverterPage: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(100);
  const [convertedAmount, setConvertedAmount] = useState<number>(0);

  useEffect(() => {
    calculateConversion();
  }, [fromCurrency, toCurrency, amount]);

  const calculateConversion = () => {
    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
    const result = (amount / fromRate) * toRate;
    setConvertedAmount(Number(result.toFixed(2)));
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const getExchangeRate = () => {
    const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
    return (toRate / fromRate).toFixed(4);
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find((c) => c.code === code)?.symbol || code;
  };

  const columns: ColumnsType<ExchangeRate> = [
    {
      title: 'Currency Pair',
      key: 'pair',
      render: (_, record) => (
        <Text strong>
          {record.from}/{record.to}
        </Text>
      ),
    },
    {
      title: 'Exchange Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => <Text>{rate.toFixed(4)}</Text>,
    },
    {
      title: 'Change',
      key: 'change',
      render: (_, record) => {
        const isPositive = record.change >= 0;
        return (
          <Space>
            {isPositive ? (
              <RiseOutlined style={{ color: '#52c41a' }} />
            ) : (
              <FallOutlined style={{ color: '#ff4d4f' }} />
            )}
            <Text style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
              {isPositive ? '+' : ''}
              {record.change.toFixed(4)} ({isPositive ? '+' : ''}
              {record.changePercent.toFixed(2)}%)
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (time) => <Text type="secondary">{dayjs(time).format('MMM DD, HH:mm')}</Text>,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <DollarOutlined style={{ color: '#52c41a' }} /> Currency Converter
        </Title>
        <Paragraph type="secondary">
          Real-time currency conversion with up-to-date exchange rates
        </Paragraph>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={14}>
          <Card
            title="Convert Currency"
            extra={
              <Tag color="blue" icon={<InfoCircleOutlined />}>
                Updated {dayjs().format('MMM DD, YYYY HH:mm')}
              </Tag>
            }
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Row gutter={16} align="middle">
                <Col xs={24} sm={11}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">From</Text>
                  </div>
                  <Select
                    size="large"
                    value={fromCurrency}
                    onChange={setFromCurrency}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {currencies.map((currency) => (
                      <Option key={currency.code} value={currency.code}>
                        <Space>
                          <span>{currency.flag}</span>
                          <Text>{currency.code}</Text>
                          <Text type="secondary">- {currency.name}</Text>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                  <div style={{ marginTop: 12 }}>
                    <InputNumber
                      size="large"
                      value={amount}
                      onChange={(value) => setAmount(value || 0)}
                      style={{ width: '100%' }}
                      min={0}
                      precision={2}
                      formatter={(value) => `${getCurrencySymbol(fromCurrency)} ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => Number(value?.replace(/[^\d.]/g, '') || 0)}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={2} style={{ textAlign: 'center' }}>
                  <div style={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SwapOutlined
                      style={{ fontSize: 24, color: '#1890ff', cursor: 'pointer' }}
                      onClick={handleSwapCurrencies}
                    />
                  </div>
                </Col>

                <Col xs={24} sm={11}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">To</Text>
                  </div>
                  <Select
                    size="large"
                    value={toCurrency}
                    onChange={setToCurrency}
                    style={{ width: '100%' }}
                    showSearch
                    optionFilterProp="children"
                  >
                    {currencies.map((currency) => (
                      <Option key={currency.code} value={currency.code}>
                        <Space>
                          <span>{currency.flag}</span>
                          <Text>{currency.code}</Text>
                          <Text type="secondary">- {currency.name}</Text>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                  <div style={{ marginTop: 12 }}>
                    <div
                      style={{
                        height: 50,
                        background: '#f0f2f5',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                      }}
                    >
                      <Text strong style={{ fontSize: 20, color: '#52c41a' }}>
                        {getCurrencySymbol(toCurrency)} {convertedAmount.toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </Col>
              </Row>

              <Divider />

              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: 24,
                  borderRadius: 12,
                  color: 'white',
                }}
              >
                <Row justify="space-between" align="middle">
                  <Col>
                    <div>
                      <Text style={{ color: 'white', opacity: 0.9, fontSize: 14 }}>Exchange Rate</Text>
                    </div>
                    <div>
                      <Text strong style={{ color: 'white', fontSize: 28 }}>
                        1 {fromCurrency} = {getExchangeRate()} {toCurrency}
                      </Text>
                    </div>
                  </Col>
                  <Col>
                    <div style={{ textAlign: 'right' }}>
                      <Text style={{ color: 'white', opacity: 0.9, fontSize: 14 }}>Inverse Rate</Text>
                      <div>
                        <Text strong style={{ color: 'white', fontSize: 20 }}>
                          1 {toCurrency} = {(1 / Number(getExchangeRate())).toFixed(4)} {fromCurrency}
                        </Text>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <Alert
                message="Currency Conversion Information"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                    <li>Exchange rates are updated every 15 minutes</li>
                    <li>Actual rates may vary slightly based on payment method</li>
                    <li>Additional fees may apply for international transactions</li>
                    <li>Rates shown are for reference purposes only</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Popular Currency Pairs" style={{ marginBottom: 16 }}>
            <Table
              columns={columns}
              dataSource={popularPairs}
              rowKey={(record) => `${record.from}-${record.to}`}
              pagination={false}
              size="small"
            />
          </Card>

          <Card title="Quick Conversions">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {[10, 50, 100, 500, 1000].map((value) => {
                const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
                const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
                const converted = ((value / fromRate) * toRate).toFixed(2);
                return (
                  <Row key={value} justify="space-between" align="middle" style={{ padding: '8px 0' }}>
                    <Col>
                      <Text>
                        {getCurrencySymbol(fromCurrency)} {value.toLocaleString()}
                      </Text>
                    </Col>
                    <Col>
                      <SwapOutlined style={{ color: '#1890ff' }} />
                    </Col>
                    <Col>
                      <Text strong style={{ color: '#52c41a' }}>
                        {getCurrencySymbol(toCurrency)} {Number(converted).toLocaleString()}
                      </Text>
                    </Col>
                  </Row>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CurrencyConverterPage;
