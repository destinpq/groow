import React, { useState } from 'react';
import { Card, Row, Col, Statistic, Typography, Button, Space, Alert, Badge, Progress, Table, Modal, Form, Select, Input, Switch, Divider, Timeline, Tag } from 'antd';
import { CreditCardOutlined, StarOutlined, CheckCircleOutlined, ClockCircleOutlined, TrophyOutlined, UpgradeOutlined, GiftOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VendorSubscriptionManagement: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('professional');
  const [upgradeModalVisible, setUpgradeModalVisible] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState('');
  const [form] = Form.useForm();

  const subscriptionData = {
    planName: 'Professional',
    status: 'active',
    billingCycle: 'monthly',
    nextBilling: '2025-12-06',
    monthlyFee: 299.99,
    commission: 8.5,
    maxProducts: 1000,
    currentProducts: 342,
    features: ['Advanced Analytics', 'Priority Support', 'Bulk Operations', 'API Access'],
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 99.99,
      commission: 12.0,
      maxProducts: 100,
      features: ['Basic Analytics', 'Email Support', 'Standard Listings'],
      badge: null,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 299.99,
      commission: 8.5,
      maxProducts: 1000,
      features: ['Advanced Analytics', 'Priority Support', 'Bulk Operations', 'API Access'],
      badge: 'Current',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 599.99,
      commission: 6.0,
      maxProducts: 10000,
      features: ['Custom Analytics', '24/7 Phone Support', 'White-label Options', 'Dedicated Manager'],
      badge: 'Popular',
    },
  ];

  const usageHistory = [
    { date: '2025-11-06', products: 342, orders: 87, revenue: 12450, commission: 8.5 },
    { date: '2025-10-06', products: 298, orders: 74, revenue: 9850, commission: 8.5 },
    { date: '2025-09-06', products: 245, orders: 62, revenue: 8200, commission: 8.5 },
  ];

  const billingHistory = [
    { date: '2025-11-06', amount: 299.99, status: 'paid', method: 'Credit Card ****1234' },
    { date: '2025-10-06', amount: 299.99, status: 'paid', method: 'Credit Card ****1234' },
    { date: '2025-09-06', amount: 299.99, status: 'paid', method: 'Credit Card ****1234' },
    { date: '2025-08-06', amount: 299.99, status: 'failed', method: 'Credit Card ****1234' },
  ];

  const addOns = [
    { id: 'analytics-plus', name: 'Advanced Analytics Plus', price: 49.99, description: 'Enhanced reporting with custom dashboards' },
    { id: 'premium-support', name: 'Premium Support', price: 99.99, description: '24/7 priority support with dedicated rep' },
    { id: 'marketing-tools', name: 'Marketing Automation', price: 79.99, description: 'Email campaigns and promotional tools' },
  ];

  const handleUpgrade = async () => {
    try {
      const values = await form.validateFields();
      // Handle upgrade logic here
      setUpgradeModalVisible(false);
      setCurrentPlan(selectedUpgrade);
    } catch (error) {
      console.error('Upgrade failed:', error);
    }
  };

  const usageColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => `$${revenue.toLocaleString()}`,
    },
    {
      title: 'Commission Rate',
      dataIndex: 'commission',
      key: 'commission',
      render: (rate: number) => `${rate}%`,
    },
  ];

  const billingColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'paid' ? 'success' : 'error'} 
          text={status.toUpperCase()} 
        />
      ),
    },
    {
      title: 'Payment Method',
      dataIndex: 'method',
      key: 'method',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={2}>
          <CreditCardOutlined style={{ marginRight: 8 }} />
          Subscription Management
        </Title>
        <Text type="secondary">Phase 5 - Vendor subscription and billing management</Text>
      </div>

      {/* Current Plan Overview */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ textAlign: 'center' }}>
              <Badge.Ribbon text="Active" color="green">
                <Card size="small">
                  <StarOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
                  <Title level={4}>{subscriptionData.planName} Plan</Title>
                  <Text type="secondary">Monthly Billing</Text>
                </Card>
              </Badge.Ribbon>
            </div>
          </Col>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={4}>
                <Statistic
                  title="Monthly Fee"
                  value={subscriptionData.monthlyFee}
                  prefix="$"
                  precision={2}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Commission Rate"
                  value={subscriptionData.commission}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Products Used"
                  value={subscriptionData.currentProducts}
                  suffix={`/ ${subscriptionData.maxProducts}`}
                />
              </Col>
              <Col span={4}>
                <Statistic
                  title="Next Billing"
                  value={subscriptionData.nextBilling}
                  valueStyle={{ fontSize: '14px' }}
                />
              </Col>
              <Col span={8}>
                <div style={{ marginTop: 8 }}>
                  <Text strong>Product Usage:</Text>
                  <Progress 
                    percent={(subscriptionData.currentProducts / subscriptionData.maxProducts) * 100} 
                    status="active" 
                    style={{ marginTop: 4 }}
                  />
                  <Space wrap style={{ marginTop: 8 }}>
                    {subscriptionData.features.map((feature, index) => (
                      <Tag key={index} color="blue" icon={<CheckCircleOutlined />}>
                        {feature}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      <Alert
        message="Subscription Status"
        description="Your Professional plan is active and in good standing. Next billing date: December 6, 2025."
        type="success"
        showIcon
        style={{ marginBottom: 24 }}
        action={
          <Button size="small" type="primary" onClick={() => setUpgradeModalVisible(true)}>
            Upgrade Plan
          </Button>
        }
      />

      <Row gutter={16}>
        <Col span={16}>
          {/* Available Plans */}
          <Card title="Available Plans" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              {plans.map((plan) => (
                <Col span={8} key={plan.id}>
                  <Card
                    size="small"
                    style={{
                      border: plan.id === currentPlan ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      position: 'relative',
                    }}
                  >
                    {plan.badge && (
                      <div style={{
                        position: 'absolute',
                        top: -8,
                        right: 8,
                        background: plan.badge === 'Current' ? '#1890ff' : '#52c41a',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: '12px',
                      }}>
                        {plan.badge}
                      </div>
                    )}
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      <Title level={4}>{plan.name}</Title>
                      <Title level={2} style={{ color: '#1890ff', margin: 0 }}>
                        ${plan.price}
                      </Title>
                      <Text type="secondary">/month</Text>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Commission: {plan.commission}%</Text>
                      <br />
                      <Text>Max Products: {plan.maxProducts.toLocaleString()}</Text>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      {plan.features.map((feature, index) => (
                        <div key={index} style={{ marginBottom: 4 }}>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                          <Text>{feature}</Text>
                        </div>
                      ))}
                    </div>
                    {plan.id !== currentPlan && (
                      <Button 
                        type="primary" 
                        block 
                        onClick={() => {
                          setSelectedUpgrade(plan.id);
                          setUpgradeModalVisible(true);
                        }}
                      >
                        {plan.price > subscriptionData.monthlyFee ? 'Upgrade' : 'Downgrade'}
                      </Button>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Usage History */}
          <Card title="Usage History">
            <Table
              columns={usageColumns}
              dataSource={usageHistory}
              rowKey="date"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col span={8}>
          {/* Add-ons */}
          <Card title="Available Add-ons" style={{ marginBottom: 24 }}>
            {addOns.map((addon) => (
              <Card key={addon.id} size="small" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <Text strong>{addon.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {addon.description}
                    </Text>
                    <br />
                    <Text strong style={{ color: '#1890ff' }}>${addon.price}/month</Text>
                  </div>
                  <Button size="small" type="link">
                    Add
                  </Button>
                </div>
              </Card>
            ))}
          </Card>

          {/* Billing History */}
          <Card title="Recent Billing">
            <Timeline size="small">
              {billingHistory.slice(0, 4).map((bill, index) => (
                <Timeline.Item
                  key={index}
                  color={bill.status === 'paid' ? 'green' : 'red'}
                  dot={bill.status === 'paid' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
                >
                  <div>
                    <Text strong>${bill.amount}</Text>
                    <br />
                    <Text type="secondary">{bill.date}</Text>
                    <br />
                    <Badge status={bill.status === 'paid' ? 'success' : 'error'} text={bill.status.toUpperCase()} />
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
            <Button type="link" size="small">View All Billing History</Button>
          </Card>
        </Col>
      </Row>

      {/* Upgrade Modal */}
      <Modal
        title="Upgrade Subscription Plan"
        visible={upgradeModalVisible}
        onOk={handleUpgrade}
        onCancel={() => setUpgradeModalVisible(false)}
        width={600}
      >
        {selectedUpgrade && (
          <div>
            <Alert
              message="Plan Upgrade Confirmation"
              description={`You are upgrading to the ${plans.find(p => p.id === selectedUpgrade)?.name} plan.`}
              type="info"
              style={{ marginBottom: 16 }}
            />
            
            <Form form={form} layout="vertical">
              <Form.Item label="Billing Cycle" name="billingCycle" initialValue="monthly">
                <Select>
                  <Option value="monthly">Monthly - Pay each month</Option>
                  <Option value="yearly">Yearly - Save 20%</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="Payment Method" name="paymentMethod" initialValue="existing">
                <Select>
                  <Option value="existing">Use existing card ****1234</Option>
                  <Option value="new">Add new payment method</Option>
                </Select>
              </Form.Item>
              
              <Form.Item label="Promo Code (Optional)" name="promoCode">
                <Input placeholder="Enter promo code" />
              </Form.Item>
              
              <Form.Item name="autoRenew" valuePropName="checked" initialValue={true}>
                <Switch /> <Text>Enable auto-renewal</Text>
              </Form.Item>
              
              <Divider />
              
              <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4 }}>
                <Text strong>Billing Summary:</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Plan Fee:</Text>
                    <Text>${plans.find(p => p.id === selectedUpgrade)?.price}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Proration:</Text>
                    <Text>$0.00</Text>
                  </div>
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>Total:</Text>
                    <Text strong>${plans.find(p => p.id === selectedUpgrade)?.price}</Text>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorSubscriptionManagement;
