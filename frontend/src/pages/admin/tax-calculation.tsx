/**
 * ⚠️ SAFE API RESPONSE HANDLING - ALWAYS USE THIS PATTERN:
 * 
 * const dataArray = response?.data?.data || response?.data || [];
 * const total = response?.data?.meta?.total || response?.meta?.total || response?.total || 0;
 * 
 * Before using .map()/.filter()/.forEach():
 * setItems(Array.isArray(dataArray) ? dataArray : []);
 */

import React, { useState, useEffect } from 'react';
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
  Spin,
  Modal,
} from 'antd';
import {
  DollarOutlined,
  PercentageOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { taxAPI } from '@/services/api/tax';
import type { 
  TaxRate, 
  TaxCalculation, 
  TaxStats,
  CreateTaxRateDto,
  UpdateTaxRateDto,
} from '@/services/api/tax';

const { Title, Text, Paragraph } = Typography;

const TaxCalculationPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);
  const [stats, setStats] = useState<TaxStats | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<string>('USA');
  const [selectedState, setSelectedState] = useState<string>('California');
  const [orderAmount, setOrderAmount] = useState<number>(100);
  const [shippingAmount, setShippingAmount] = useState<number>(10);
  const [taxExempt, setTaxExempt] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<TaxCalculation | null>(null);
  const [autoCalculate, setAutoCalculate] = useState<boolean>(true);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTaxRate, setSelectedTaxRate] = useState<TaxRate | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTaxRates();
    fetchStats();
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchTaxRates = async () => {
    try {
      setLoading(true);
      const response = await taxAPI.getAll();
      setTaxRates(response.data || response);
    } catch (error) {
      message.error('Failed to load tax rates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await taxAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const fetchCountries = async () => {
    try {
      const countriesData = await taxAPI.getCountries();
      setCountries(countriesData);
      if (countriesData.length > 0 && !selectedCountry) {
        setSelectedCountry(countriesData[0]);
      }
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const fetchStates = async (country: string) => {
    try {
      const statesData = await taxAPI.getStates(country);
      setStates(statesData);
      if (statesData.length > 0) {
        setSelectedState(statesData[0]);
      }
    } catch (error) {
      console.error('Failed to load states:', error);
    }
  };

  const handleCalculateTax = async () => {
    try {
      const calculationData = await taxAPI.calculate({
        country: selectedCountry,
        state: selectedState,
        subtotal: orderAmount,
        shippingAmount,
        taxExempt,
      });
      
      setCalculation(calculationData);
      message.success('Tax calculated successfully!');
    } catch (error) {
      message.error('Failed to calculate tax');
    }
  };

  const handleCreate = () => {
    setSelectedTaxRate(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (taxRate: TaxRate) => {
    setSelectedTaxRate(taxRate);
    form.setFieldsValue(taxRate);
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const taxRateData: CreateTaxRateDto | UpdateTaxRateDto = {
        country: values.country,
        countryCode: values.countryCode,
        state: values.state,
        stateCode: values.stateCode,
        city: values.city,
        zipCode: values.zipCode,
        rate: values.rate,
        type: values.type,
        enabled: values.enabled !== undefined ? values.enabled : true,
        priority: values.priority || 0,
      };

      if (selectedTaxRate) {
        await taxAPI.update(selectedTaxRate.id, taxRateData);
        message.success('Tax rate updated successfully');
      } else {
        await taxAPI.create(taxRateData as CreateTaxRateDto);
        message.success('Tax rate created successfully');
      }

      setIsModalVisible(false);
      await fetchTaxRates();
      await fetchStats();
    } catch (error) {
      message.error(selectedTaxRate ? 'Failed to update tax rate' : 'Failed to create tax rate');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Tax Rate',
      content: 'Are you sure you want to delete this tax rate?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await taxAPI.delete(id);
          message.success('Tax rate deleted successfully');
          await fetchTaxRates();
          await fetchStats();
        } catch (error) {
          message.error('Failed to delete tax rate');
        }
      },
    });
  };

  const handleToggleStatus = async (id: number, enabled: boolean) => {
    try {
      await taxAPI.toggleStatus(id, enabled);
      message.success(`Tax rate ${enabled ? 'enabled' : 'disabled'} successfully`);
      await fetchTaxRates();
    } catch (error) {
      message.error('Failed to update tax rate status');
    }
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
      render: (state) => state || '-',
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      render: (city) => city || '-',
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
      render: (type) => {
        const colorMap: Record<string, string> = {
          state: 'green',
          federal: 'blue',
          local: 'purple',
          combined: 'orange',
          vat: 'cyan',
          gst: 'magenta',
        };
        return <Tag color={colorMap[type] || 'default'}>{type?.toUpperCase() || '-'}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled, record) => (
        <Switch
          checked={enabled}
          onChange={(checked) => handleToggleStatus(record.id, checked)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
    <Spin spinning={loading} tip="Loading tax data...">
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={3}>
            <CalculatorOutlined style={{ color: '#1890ff' }} /> Tax Calculation Engine
          </Title>
          <Paragraph type="secondary">
            Automated tax calculation based on location and product taxability
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Create Tax Rate
        </Button>
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
                      placeholder="Select State"
                      value={selectedState}
                      onChange={setSelectedState}
                      disabled={!selectedCountry}
                      options={states.map((s) => ({ label: s, value: s }))}
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
                  value={stats?.averageRate || 0}
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
                  value={stats?.totalRates || 0}
                  prefix={<EnvironmentOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Tax Rates Database">
            <Table
              columns={taxRateColumns}
              dataSource={taxRates}
              rowKey="id"
              pagination={{ pageSize: 8 }}
              size="small"
              loading={loading}
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
    </Spin>

    {/* Create/Edit Modal */}
    <Modal
      title={selectedTaxRate ? 'Edit Tax Rate' : 'Create Tax Rate'}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setSelectedTaxRate(null);
        form.resetFields();
      }}
      onOk={() => form.submit()}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Please enter country' }]}
            >
              <Input placeholder="e.g., United States" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Country Code"
              name="countryCode"
              rules={[{ required: true, message: 'Please enter country code' }]}
            >
              <Input placeholder="e.g., US" maxLength={2} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="State/Province"
              name="state"
            >
              <Input placeholder="e.g., California" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="State Code"
              name="stateCode"
            >
              <Input placeholder="e.g., CA" maxLength={3} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="City (Optional)"
              name="city"
            >
              <Input placeholder="e.g., Los Angeles" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="ZIP Code (Optional)"
              name="zipCode"
            >
              <Input placeholder="e.g., 90001" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tax Rate (%)"
              name="rate"
              rules={[
                { required: true, message: 'Please enter tax rate' },
                { type: 'number', min: 0, max: 100, message: 'Rate must be between 0 and 100' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="e.g., 7.25"
                precision={2}
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tax Type"
              name="type"
              rules={[{ required: true, message: 'Please select tax type' }]}
            >
              <Select
                placeholder="Select type"
                options={[
                  { label: 'State', value: 'state' },
                  { label: 'Federal', value: 'federal' },
                  { label: 'Local', value: 'local' },
                  { label: 'Combined', value: 'combined' },
                  { label: 'VAT', value: 'vat' },
                  { label: 'GST', value: 'gst' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Priority"
              name="priority"
              tooltip="Higher priority rates are applied first"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="e.g., 1"
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="enabled"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
    </>
  );
};

export default TaxCalculationPage;
