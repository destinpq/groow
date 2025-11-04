import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Select,
  Space,
  Statistic,
  Switch,
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Divider,
  Alert,
  Descriptions,
} from 'antd';
import {
  DollarOutlined,
  PercentageOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface TaxRate {
  country: string;
  state: string;
  rate: number;
  type: 'state' | 'local' | 'combined';
}

interface TaxJurisdiction {
  name: string;
  code: string;
  rate: number;
  type: string;
}

interface TaxCalculation {
  subtotal: number;
  taxableAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  jurisdictions: TaxJurisdiction[];
}

const mockTaxRates: TaxRate[] = [
  { country: 'USA', state: 'California', rate: 7.25, type: 'state' },
  { country: 'USA', state: 'New York', rate: 4.0, type: 'state' },
  { country: 'USA', state: 'Texas', rate: 6.25, type: 'state' },
  { country: 'USA', state: 'Florida', rate: 6.0, type: 'state' },
  { country: 'USA', state: 'Illinois', rate: 6.25, type: 'state' },
  { country: 'Canada', state: 'Ontario', rate: 13.0, type: 'combined' },
  { country: 'Canada', state: 'Quebec', rate: 14.975, type: 'combined' },
  { country: 'UK', state: 'England', rate: 20.0, type: 'state' },
  { country: 'Germany', state: 'All States', rate: 19.0, type: 'state' },
  { country: 'France', state: 'All States', rate: 20.0, type: 'state' },
];

const TaxCalculationPage: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('USA');
  const [selectedState, setSelectedState] = useState<string>('California');
  const [orderAmount, setOrderAmount] = useState<number>(100);
  const [shippingAmount, setShippingAmount] = useState<number>(10);
  const [taxExempt, setTaxExempt] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [autoCalculate, setAutoCalculate] = useState<boolean>(true);

  const countries = Array.from(new Set(mockTaxRates.map((r) => r.country)));
  const states = mockTaxRates.filter((r) => r.country === selectedCountry);

  const handleCalculateTax = () => {
    if (taxExempt) {
      setCalculation({
        subtotal: orderAmount,
        taxableAmount: 0,
        taxRate: 0,
        taxAmount: 0,
        total: orderAmount + shippingAmount,
        jurisdictions: [],
      });
      message.info('Order is tax exempt');
      return;
    }

    const taxRate = mockTaxRates.find(
      (r) => r.country === selectedCountry && r.state === selectedState
    );

    if (!taxRate) {
      message.error('Tax rate not found for selected location');
      return;
    }

    const subtotal = orderAmount;
    const taxableAmount = subtotal; // Simplified - in reality, some items may be exempt
    const taxAmount = (taxableAmount * taxRate.rate) / 100;
    const total = subtotal + shippingAmount + taxAmount;

    // Simulate multiple jurisdictions
    const jurisdictions: TaxJurisdiction[] = [
      {
        name: `${taxRate.state} State Tax`,
        code: taxRate.state.substring(0, 2).toUpperCase(),
        rate: taxRate.rate * 0.7,
        type: 'State',
      },
    ];

    if (taxRate.type === 'combined') {
      jurisdictions.push({
        name: 'Local Tax',
        code: 'LOC',
        rate: taxRate.rate * 0.3,
        type: 'Local',
      });
    }

    setCalculation({
      subtotal,
      taxableAmount,
      taxRate: taxRate.rate,
      taxAmount,
      total,
      jurisdictions,
    });

    message.success('Tax calculated successfully!');
  };

  const taxRateColumns: ColumnsType<TaxRate> = [
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      filters: countries.map((c) => ({ text: c, value: c })),
      onFilter: (value, record) => record.country === value,
    },
    {
      title: 'State/Province',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Tax Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => <Tag color="blue">{rate}%</Tag>,
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'combined' ? 'orange' : 'green'}>
          {type === 'combined' ? 'Combined' : 'State Only'}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <CalculatorOutlined style={{ color: '#1890ff' }} /> Tax Calculation Engine
        </Title>
        <Paragraph type="secondary">
          Automated tax calculation based on location and product taxability
        </Paragraph>
      </div>

      <Alert
        message="Compliance Notice"
        description="Tax rates are updated regularly to ensure compliance with local tax laws. Always verify rates before processing orders."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={16}>
        {/* Tax Calculator */}
        <Col xs={24} lg={12}>
          <Card
            title="Tax Calculator"
            extra={
              <Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Auto Calculate
                </Text>
                <Switch checked={autoCalculate} onChange={setAutoCalculate} size="small" />
              </Space>
            }
          >
            <Form layout="vertical" onValuesChange={autoCalculate ? handleCalculateTax : undefined}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Country">
                    <Select
                      value={selectedCountry}
                      onChange={setSelectedCountry}
                      options={countries.map((c) => ({ label: c, value: c }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="State/Province">
                    <Select
                      value={selectedState}
                      onChange={setSelectedState}
                      options={states.map((s) => ({ label: s.state, value: s.state }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Order Subtotal">
                <InputNumber
                  value={orderAmount}
                  onChange={(val) => setOrderAmount(val || 0)}
                  prefix="$"
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                />
              </Form.Item>

              <Form.Item label="Shipping Cost">
                <InputNumber
                  value={shippingAmount}
                  onChange={(val) => setShippingAmount(val || 0)}
                  prefix="$"
                  style={{ width: '100%' }}
                  min={0}
                  step={0.01}
                  precision={2}
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Switch checked={taxExempt} onChange={setTaxExempt} />
                  <Text>Tax Exempt Order</Text>
                  {taxExempt && <Tag color="orange">Exempt</Tag>}
                </Space>
              </Form.Item>

              {!autoCalculate && (
                <Button
                  type="primary"
                  block
                  icon={<CalculatorOutlined />}
                  onClick={handleCalculateTax}
                >
                  Calculate Tax
                </Button>
              )}
            </Form>

            {calculation && (
              <>
                <Divider />
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Alert
                    message="Tax Calculation Result"
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />

                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Subtotal">
                      ${calculation.subtotal.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Shipping">
                      ${shippingAmount.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Taxable Amount">
                      ${calculation.taxableAmount.toFixed(2)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tax Rate">
                      <Tag color="blue">{calculation.taxRate}%</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tax Amount">
                      <Text strong style={{ color: '#ff9900' }}>
                        ${calculation.taxAmount.toFixed(2)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Total">
                      <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                        ${calculation.total.toFixed(2)}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>

                  {calculation.jurisdictions.length > 0 && (
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>
                        Tax Breakdown by Jurisdiction
                      </Text>
                      <Space direction="vertical" style={{ width: '100%' }}>
                        {calculation.jurisdictions.map((j, idx) => (
                          <Card key={idx} size="small">
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Space>
                                <EnvironmentOutlined />
                                <div>
                                  <Text strong>{j.name}</Text>
                                  <div>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                      {j.type}
                                    </Text>
                                  </div>
                                </div>
                              </Space>
                              <div style={{ textAlign: 'right' }}>
                                <Tag color="blue">{j.rate.toFixed(2)}%</Tag>
                                <div>
                                  <Text type="secondary" style={{ fontSize: 11 }}>
                                    ${((calculation.taxableAmount * j.rate) / 100).toFixed(2)}
                                  </Text>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </Space>
                    </div>
                  )}
                </Space>
              </>
            )}
          </Card>
        </Col>

        {/* Tax Rates & Statistics */}
        <Col xs={24} lg={12}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Average Tax Rate"
                  value={
                    mockTaxRates.reduce((sum, r) => sum + r.rate, 0) / mockTaxRates.length
                  }
                  precision={2}
                  suffix="%"
                  prefix={<PercentageOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Supported Regions"
                  value={mockTaxRates.length}
                  prefix={<EnvironmentOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Tax Rates Database">
            <Table
              columns={taxRateColumns}
              dataSource={mockTaxRates}
              rowKey={(record) => `${record.country}-${record.state}`}
              pagination={{ pageSize: 8 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Tax Rules */}
      <Card title="Tax Calculation Rules" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Card type="inner" title="Product Taxability">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Physical goods are taxable</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Digital products may be exempt</Text>
                </div>
                <div>
                  <WarningOutlined style={{ color: '#ff9900', marginRight: 8 }} />
                  <Text>Groceries have special rates</Text>
                </div>
                <div>
                  <WarningOutlined style={{ color: '#ff9900', marginRight: 8 }} />
                  <Text>Clothing exemptions vary</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card type="inner" title="Nexus Requirements">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Physical presence required</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Economic nexus thresholds</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Marketplace facilitator rules</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Affiliate nexus considerations</Text>
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card type="inner" title="Exemptions">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Resale certificates</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Non-profit organizations</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Government entities</Text>
                </div>
                <div>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  <Text>Export sales</Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default TaxCalculationPage;
