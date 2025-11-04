import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Drawer,
  Descriptions,
  message,
  Typography,
  Row,
  Col,
  Form,
  Modal,
  InputNumber,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface RFQ {
  id: number;
  rfqNumber: string;
  customer: string;
  productName: string;
  quantity: number;
  targetPrice: number;
  date: string;
  status: string;
  message: string;
  quotedPrice?: number;
}

const mockRFQs: RFQ[] = [
  {
    id: 1,
    rfqNumber: 'RFQ-2024-001',
    customer: 'ABC Corp',
    productName: 'Premium Wireless Headphones',
    quantity: 100,
    targetPrice: 299.99,
    date: '2024-11-01',
    status: 'new',
    message: 'Looking for bulk purchase. Need quote for 100 units.',
  },
  {
    id: 2,
    rfqNumber: 'RFQ-2024-002',
    customer: 'XYZ Ltd',
    productName: 'Smart Watch Pro',
    quantity: 50,
    targetPrice: 179.99,
    date: '2024-10-30',
    status: 'quoted',
    message: 'Need urgent delivery. Can you deliver within 2 weeks?',
    quotedPrice: 189.99,
  },
  {
    id: 3,
    rfqNumber: 'RFQ-2024-003',
    customer: 'Tech Solutions',
    productName: 'Laptop Backpack',
    quantity: 200,
    targetPrice: 39.99,
    date: '2024-10-28',
    status: 'accepted',
    message: 'Corporate bulk order for employee gifts.',
    quotedPrice: 42.99,
  },
];

const VendorRFQPage: React.FC = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>(mockRFQs);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'blue',
      quoted: 'orange',
      accepted: 'success',
      rejected: 'error',
      expired: 'default',
    };
    return colors[status] || 'default';
  };

  const handleViewRFQ = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setDrawerVisible(true);
  };

  const handleSendQuote = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setQuoteModalVisible(true);
    form.setFieldsValue({
      quantity: rfq.quantity,
      targetPrice: rfq.targetPrice,
    });
  };

  const handleSubmitQuote = (values: any) => {
    console.log('Quote submitted:', values);
    if (selectedRFQ) {
      setRfqs(
        rfqs.map((r) =>
          r.id === selectedRFQ.id
            ? { ...r, status: 'quoted', quotedPrice: values.quotedPrice }
            : r
        )
      );
      message.success('Quote sent successfully');
      setQuoteModalVisible(false);
      form.resetFields();
    }
  };

  const handleSendMessage = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setMessageModalVisible(true);
  };

  const handleSubmitMessage = (values: any) => {
    console.log('Message sent:', values);
    message.success('Message sent to customer');
    setMessageModalVisible(false);
    messageForm.resetFields();
  };

  const columns: ColumnsType<RFQ> = [
    {
      title: 'RFQ Number',
      dataIndex: 'rfqNumber',
      key: 'rfqNumber',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Text strong>{qty} units</Text>,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Target Price',
      dataIndex: 'targetPrice',
      key: 'targetPrice',
      render: (price: number) => (
        <Text type="secondary">${price.toFixed(2)}/unit</Text>
      ),
    },
    {
      title: 'Quoted Price',
      dataIndex: 'quotedPrice',
      key: 'quotedPrice',
      render: (price?: number) =>
        price ? (
          <Text strong style={{ color: '#52c41a' }}>
            ${price.toFixed(2)}/unit
          </Text>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'New', value: 'new' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Accepted', value: 'accepted' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewRFQ(record)}
          >
            View
          </Button>
          {record.status === 'new' && (
            <Button
              type="link"
              icon={<SendOutlined />}
              onClick={() => handleSendQuote(record)}
            >
              Send Quote
            </Button>
          )}
          <Button
            type="link"
            icon={<MessageOutlined />}
            onClick={() => handleSendMessage(record)}
          >
            Message
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title={<Title level={3}>RFQ Management</Title>}>
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search RFQs..."
              prefix={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select placeholder="Status" size="large" style={{ width: '100%' }}>
              <Option value="all">All RFQs</Option>
              <Option value="new">New</Option>
              <Option value="quoted">Quoted</Option>
              <Option value="accepted">Accepted</Option>
              <Option value="rejected">Rejected</Option>
              <Option value="expired">Expired</Option>
            </Select>
          </Col>
        </Row>

        {/* Stats */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Total RFQs</Text>
              <Title level={3} style={{ margin: 0 }}>
                {rfqs.length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">New Requests</Text>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {rfqs.filter((r) => r.status === 'new').length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Quoted</Text>
              <Title level={3} style={{ margin: 0, color: '#faad14' }}>
                {rfqs.filter((r) => r.status === 'quoted').length}
              </Title>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Text type="secondary">Accepted</Text>
              <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                {rfqs.filter((r) => r.status === 'accepted').length}
              </Title>
            </Card>
          </Col>
        </Row>

        {/* RFQ Table */}
        <Table
          columns={columns}
          dataSource={rfqs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} RFQs`,
          }}
        />
      </Card>

      {/* RFQ Detail Drawer */}
      <Drawer
        title={`RFQ Details - ${selectedRFQ?.rfqNumber}`}
        placement="right"
        width={600}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {selectedRFQ && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Descriptions title="RFQ Information" bordered column={1} size="small">
              <Descriptions.Item label="RFQ Number">
                {selectedRFQ.rfqNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                {selectedRFQ.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Product">
                {selectedRFQ.productName}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                <Text strong>{selectedRFQ.quantity} units</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Target Price">
                ${selectedRFQ.targetPrice.toFixed(2)}/unit
              </Descriptions.Item>
              {selectedRFQ.quotedPrice && (
                <Descriptions.Item label="Your Quote">
                  <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                    ${selectedRFQ.quotedPrice.toFixed(2)}/unit
                  </Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Date">
                {new Date(selectedRFQ.date).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedRFQ.status)}>
                  {selectedRFQ.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Card title="Customer Message" size="small">
              <Paragraph>{selectedRFQ.message}</Paragraph>
            </Card>

            <Space>
              {selectedRFQ.status === 'new' && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={() => handleSendQuote(selectedRFQ)}
                >
                  Send Quote
                </Button>
              )}
              <Button
                icon={<MessageOutlined />}
                onClick={() => handleSendMessage(selectedRFQ)}
              >
                Send Message
              </Button>
            </Space>
          </Space>
        )}
      </Drawer>

      {/* Quote Modal */}
      <Modal
        title="Send Quote"
        open={quoteModalVisible}
        onCancel={() => setQuoteModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitQuote}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Customer Target Price" name="targetPrice">
                <InputNumber
                  prefix="$"
                  suffix="/unit"
                  disabled
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Quantity" name="quantity">
                <InputNumber disabled style={{ width: '100%' }} suffix="units" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="quotedPrice"
            label="Your Quoted Price (per unit)"
            rules={[{ required: true, message: 'Please enter quoted price' }]}
          >
            <InputNumber
              prefix="$"
              suffix="/unit"
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Enter your price"
            />
          </Form.Item>

          <Form.Item
            name="moq"
            label="Minimum Order Quantity"
            rules={[{ required: true, message: 'Please enter MOQ' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              placeholder="Enter MOQ"
              suffix="units"
            />
          </Form.Item>

          <Form.Item
            name="deliveryTime"
            label="Estimated Delivery Time"
            rules={[{ required: true, message: 'Please enter delivery time' }]}
          >
            <Input placeholder="e.g., 7-10 business days" />
          </Form.Item>

          <Form.Item name="terms" label="Payment Terms">
            <Select placeholder="Select payment terms">
              <Option value="advance">100% Advance</Option>
              <Option value="50-50">50% Advance, 50% on Delivery</Option>
              <Option value="net30">Net 30 Days</Option>
              <Option value="net60">Net 60 Days</Option>
            </Select>
          </Form.Item>

          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={4} placeholder="Add any additional information..." />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setQuoteModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                Send Quote
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Message Modal */}
      <Modal
        title="Send Message to Customer"
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        footer={null}
      >
        <Form form={messageForm} layout="vertical" onFinish={handleSubmitMessage}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please enter subject' }]}
          >
            <Input placeholder="Enter subject" />
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter message' }]}
          >
            <TextArea rows={6} placeholder="Type your message..." />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setMessageModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<MessageOutlined />}>
                Send Message
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorRFQPage;
