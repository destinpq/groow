import React, { useState, useEffect } from 'react';
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
  Spin,
  DatePicker,
} from 'antd';
import {
  SearchOutlined,
  EyeOutlined,
  MessageOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { rfqAPI } from '@/services/api/rfq';
import type { RFQ, CreateQuotationData, Quotation } from '@/services/api/rfq';
import { useAuthStore } from '@/store/auth';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VendorRFQPage: React.FC = () => {
  const { user } = useAuthStore();
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [quoteModalVisible, setQuoteModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('open');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();
  const [messageForm] = Form.useForm();

  // Fetch RFQs
  const fetchRFQs = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      
      const response = await rfqAPI.getAll(filters);
      
      // Filter by search text if provided
      let filteredData = response.data;
      if (searchText) {
        filteredData = filteredData.filter(
          (rfq) =>
            rfq.rfqNumber.toLowerCase().includes(searchText.toLowerCase()) ||
            rfq.title.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      setRfqs(filteredData);
    } catch (error) {
      message.error('Failed to fetch RFQs');
      console.error('Error fetching RFQs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quotations for selected RFQ
  const fetchQuotations = async (rfqId: string) => {
    try {
      const data = await rfqAPI.getQuotations(rfqId);
      // Filter to show only vendor's own quotations
      const vendorQuotations = data.filter((q) => q.vendorId === user?.id);
      setQuotations(vendorQuotations);
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  useEffect(() => {
    fetchRFQs();
  }, [statusFilter]);

  const getStatusColor = (status: RFQ['status']) => {
    const colors: Record<RFQ['status'], string> = {
      open: 'blue',
      quoted: 'orange',
      closed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  const handleViewRFQ = async (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setDrawerVisible(true);
    // Fetch vendor's quotations for this RFQ
    await fetchQuotations(rfq.id);
  };

  const handleSendQuote = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setQuoteModalVisible(true);
    form.setFieldsValue({
      quantity: rfq.quantity,
      budget: rfq.budget,
    });
  };

  const handleSubmitQuote = async (values: any) => {
    if (!selectedRFQ || !user?.id) return;
    
    try {
      const quotationData: CreateQuotationData = {
        rfqId: selectedRFQ.id,
        price: values.quotedPrice,
        quantity: values.quantity,
        moq: values.moq,
        deliveryTime: values.deliveryTime,
        validUntil: values.validUntil.toISOString(),
        notes: values.notes,
      };
      
      await rfqAPI.createQuotation(quotationData);
      message.success('Quote sent successfully');
      setQuoteModalVisible(false);
      form.resetFields();
      fetchRFQs(); // Refresh list
    } catch (error) {
      message.error('Failed to send quote');
      console.error('Error submitting quote:', error);
    }
  };

  const handleSendMessage = (rfq: RFQ) => {
    setSelectedRFQ(rfq);
    setMessageModalVisible(true);
  };

  const handleSubmitMessage = async (values: any) => {
    // This would integrate with a messaging API when available
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
      title: 'Customer ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <Text>{text}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Text strong>{qty} units</Text>,
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget: number) => (
        <Text type="secondary">${budget.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Quotations',
      dataIndex: 'quotationCount',
      key: 'quotationCount',
      render: (count: number) => (
        <Tag color={count > 0 ? 'blue' : 'default'}>{count} quotes</Tag>
      ),
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a, b) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: RFQ['status']) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
      filters: [
        { text: 'Open', value: 'open' },
        { text: 'Quoted', value: 'quoted' },
        { text: 'Closed', value: 'closed' },
        { text: 'Cancelled', value: 'cancelled' },
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
          {record.status === 'open' && (
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
    <Spin spinning={loading}>
      <div style={{ padding: 24 }}>
        <Card title={<Title level={3}>RFQ Management</Title>}>
          {/* Filters */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Search RFQs..."
                prefix={<SearchOutlined />}
                size="large"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={fetchRFQs}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select 
                placeholder="Status" 
                size="large" 
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
              >
                <Option value="all">All RFQs</Option>
                <Option value="open">Open</Option>
                <Option value="quoted">Quoted</Option>
                <Option value="closed">Closed</Option>
                <Option value="cancelled">Cancelled</Option>
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
                <Text type="secondary">Open Requests</Text>
                <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                  {rfqs.filter((r) => r.status === 'open').length}
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
                <Text type="secondary">Closed</Text>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  {rfqs.filter((r) => r.status === 'closed').length}
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
              <Descriptions.Item label="Customer ID">
                {selectedRFQ.customerId}
              </Descriptions.Item>
              <Descriptions.Item label="Title">
                {selectedRFQ.title}
              </Descriptions.Item>
              <Descriptions.Item label="Category">
                {selectedRFQ.category}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                <Text strong>{selectedRFQ.quantity} units</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Budget">
                {selectedRFQ.budget ? `$${selectedRFQ.budget.toFixed(2)}` : 'Not specified'}
              </Descriptions.Item>
              <Descriptions.Item label="Deadline">
                {dayjs(selectedRFQ.deadline).format('MMM DD, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Quotations Received">
                <Tag color="blue">{selectedRFQ.quotationCount} quotes</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={getStatusColor(selectedRFQ.status)}>
                  {selectedRFQ.status.toUpperCase()}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(selectedRFQ.createdAt).format('MMM DD, YYYY hh:mm A')}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Description" size="small">
              <Paragraph>{selectedRFQ.description}</Paragraph>
            </Card>

            {quotations.length > 0 && (
              <Card title="Your Quotations" size="small">
                {quotations.map((quote, index) => (
                  <div key={quote.id} style={{ marginBottom: 12, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text strong>Quote #{index + 1}</Text>
                      <Text>Price: ${quote.price.toFixed(2)} (Qty: {quote.quantity})</Text>
                      <Text>MOQ: {quote.moq} units</Text>
                      <Text>Delivery: {quote.deliveryTime}</Text>
                      <Text>Valid Until: {dayjs(quote.validUntil).format('MMM DD, YYYY')}</Text>
                      <Tag color={quote.status === 'pending' ? 'orange' : quote.status === 'accepted' ? 'success' : 'error'}>
                        {quote.status?.toUpperCase()}
                      </Tag>
                      {quote.notes && <Text type="secondary">Notes: {quote.notes}</Text>}
                    </Space>
                  </div>
                ))}
              </Card>
            )}

            <Space>
              {selectedRFQ.status === 'open' && (
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
              <Form.Item label="Customer Budget" name="budget">
                <InputNumber
                  prefix="$"
                  disabled
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Requested Quantity" name="quantity">
                <InputNumber disabled style={{ width: '100%' }} suffix="units" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="quotedPrice"
            label="Your Quoted Price (Total)"
            rules={[{ required: true, message: 'Please enter quoted price' }]}
          >
            <InputNumber
              prefix="$"
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Enter total price for the quantity"
            />
          </Form.Item>

          <Form.Item
            name="moq"
            label="Minimum Order Quantity (MOQ)"
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

          <Form.Item
            name="validUntil"
            label="Quote Valid Until"
            rules={[{ required: true, message: 'Please select valid until date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().endOf('day')}
            />
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
    </Spin>
  );
};

export default VendorRFQPage;
