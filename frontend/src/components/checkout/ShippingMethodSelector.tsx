import React, { useState } from 'react';
import {
  Modal,
  Form,
  Radio,
  Card,
  Space,
  Typography,
  Divider,
  Tag,
  Row,
  Col,
  Statistic,
  Alert,
  InputNumber,
} from 'antd';
import {
  TruckOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
  features: string[];
  recommended?: boolean;
}

interface ShippingMethodSelectorProps {
  visible: boolean;
  onCancel: () => void;
  onSelect: (method: ShippingMethod) => void;
  cartTotal: number;
}

const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Regular delivery service',
    price: 0,
    estimatedDays: '5-7 business days',
    icon: <TruckOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
    features: [
      'Free on orders over $50',
      'Tracking number included',
      'Signature not required',
    ],
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Faster delivery option',
    price: 15.99,
    estimatedDays: '2-3 business days',
    icon: <RocketOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
    features: [
      'Priority processing',
      'Real-time tracking',
      'Insurance included',
    ],
    recommended: true,
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next day delivery',
    price: 29.99,
    estimatedDays: '1 business day',
    icon: <ClockCircleOutlined style={{ fontSize: 32, color: '#ff9900' }} />,
    features: [
      'Next business day delivery',
      'Signature required',
      'Full insurance coverage',
      'Premium handling',
    ],
  },
  {
    id: 'economy',
    name: 'Economy Shipping',
    description: 'Budget-friendly option',
    price: 4.99,
    estimatedDays: '7-10 business days',
    icon: <DollarOutlined style={{ fontSize: 32, color: '#faad14' }} />,
    features: [
      'Most affordable option',
      'Basic tracking',
      'Perfect for non-urgent items',
    ],
  },
];

const ShippingMethodSelector: React.FC<ShippingMethodSelectorProps> = ({
  visible,
  onCancel,
  onSelect,
  cartTotal,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('standard');
  const [form] = Form.useForm();

  const handleConfirm = () => {
    const method = shippingMethods.find(m => m.id === selectedMethod);
    if (method) {
      onSelect(method);
    }
  };

  const getShippingPrice = (method: ShippingMethod) => {
    // Free standard shipping on orders over $50
    if (method.id === 'standard' && cartTotal >= 50) {
      return 0;
    }
    return method.price;
  };

  return (
    <Modal
      title="Select Shipping Method"
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={900}
      okText="Continue to Payment"
    >
      <Alert
        message="Choose your preferred delivery method"
        description={`Cart total: $${cartTotal.toFixed(2)} • Estimated delivery to your address`}
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form form={form} layout="vertical">
        <Form.Item name="shippingMethod">
          <Radio.Group
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            style={{ width: '100%' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {shippingMethods.map((method) => {
                const shippingPrice = getShippingPrice(method);
                const isFree = shippingPrice === 0;

                return (
                  <Card
                    key={method.id}
                    hoverable
                    onClick={() => setSelectedMethod(method.id)}
                    style={{
                      border: selectedMethod === method.id ? '2px solid #1890ff' : '1px solid #d9d9d9',
                      position: 'relative',
                    }}
                  >
                    {method.recommended && (
                      <Tag
                        color="green"
                        style={{ position: 'absolute', top: 8, right: 8 }}
                      >
                        Recommended
                      </Tag>
                    )}

                    <Radio value={method.id} style={{ width: '100%' }}>
                      <Row gutter={16} align="middle">
                        <Col flex="none">
                          {method.icon}
                        </Col>
                        <Col flex="auto">
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div>
                              <Text strong style={{ fontSize: 16 }}>
                                {method.name}
                              </Text>
                              {isFree && (
                                <Tag color="success" style={{ marginLeft: 8 }}>
                                  FREE
                                </Tag>
                              )}
                            </div>
                            <Text type="secondary">{method.description}</Text>
                            <Space wrap>
                              {method.features.map((feature, idx) => (
                                <Text key={idx} type="secondary" style={{ fontSize: 12 }}>
                                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />
                                  {feature}
                                </Text>
                              ))}
                            </Space>
                          </Space>
                        </Col>
                        <Col flex="none">
                          <Space direction="vertical" align="end" size="small">
                            <Text strong style={{ fontSize: 18, color: isFree ? '#52c41a' : '#ff9900' }}>
                              {isFree ? 'FREE' : `$${shippingPrice.toFixed(2)}`}
                            </Text>
                            <Tag color="blue">{method.estimatedDays}</Tag>
                          </Space>
                        </Col>
                      </Row>
                    </Radio>
                  </Card>
                );
              })}
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>

      <Divider />

      {/* Order Summary */}
      <Card style={{ background: '#fafafa' }}>
        <Row gutter={16}>
          <Col span={12}>
            <Space direction="vertical" size="small">
              <Text type="secondary">Subtotal:</Text>
              <Text type="secondary">Shipping:</Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong style={{ fontSize: 16 }}>Total:</Text>
            </Space>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Space direction="vertical" size="small">
              <Text>${cartTotal.toFixed(2)}</Text>
              <Text style={{ color: getShippingPrice(shippingMethods.find(m => m.id === selectedMethod)!) === 0 ? '#52c41a' : 'inherit' }}>
                {getShippingPrice(shippingMethods.find(m => m.id === selectedMethod)!) === 0 
                  ? 'FREE' 
                  : `$${getShippingPrice(shippingMethods.find(m => m.id === selectedMethod)!).toFixed(2)}`
                }
              </Text>
              <Divider style={{ margin: '8px 0' }} />
              <Text strong style={{ fontSize: 16, color: '#ff9900' }}>
                ${(cartTotal + getShippingPrice(shippingMethods.find(m => m.id === selectedMethod)!)).toFixed(2)}
              </Text>
            </Space>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};

export default ShippingMethodSelector;
