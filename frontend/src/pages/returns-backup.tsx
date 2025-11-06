import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Steps, 
  Timeline, 
  Alert, 
  Space, 
  Tag, 
  Row, 
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Table,
  Badge,
  Spin,
  Empty,
  Tooltip,
  Statistic,
  Progress,
  Descriptions,
  Tabs
} from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RetweetOutlined,
  PlusOutlined,
  UploadOutlined,
  EyeOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TruckOutlined,
  QuestionCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  CommentOutlined,
  CalendarOutlined,
  TagsOutlined,
  CameraOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { returnsAPI, contactAPI } from '../services/api/help';
import type { ReturnRequest } from '../services/api/help';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ReturnPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [form] = Form.useForm();
  
  // Data states
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [returnPolicy, setReturnPolicy] = useState<any>(null);
  const [returnStats, setReturnStats] = useState({
    totalReturns: 0,
    pendingReturns: 0,
    approvedReturns: 0,
    completedReturns: 0
  });

  // File upload state
  const [fileList, setFileList] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [policyRes, returnsRes] = await Promise.all([
        returnsAPI.getReturnPolicy(),
        returnsAPI.getReturns({ page: 1, limit: 10 })
      ]);

      setReturnPolicy(policyRes.data || null);
      setReturns(returnsRes.data?.data || []);
      
      // Calculate stats
      const totalReturns = returnsRes.data?.total || 0;
      const pendingReturns = returnsRes.data?.data?.filter((r: ReturnRequest) => r.status === 'pending').length || 0;
      const approvedReturns = returnsRes.data?.data?.filter((r: ReturnRequest) => r.status === 'approved').length || 0;
      const completedReturns = returnsRes.data?.data?.filter((r: ReturnRequest) => r.status === 'refunded').length || 0;
      
      setReturnStats({
        totalReturns,
        pendingReturns,
        approvedReturns,
        completedReturns
      });
    } catch (error) {
      console.error('Error loading return data:', error);
      
      // Set fallback data
      setReturnPolicy({
        timeLimit: 30,
        conditions: [
          'Product received is defective or damaged',
          'Wrong item was shipped',
          'Product does not match description',
          'Changed your mind (within 30 days)',
          'Product arrived late beyond promised date'
        ],
        process: [
          'Request Return',
          'Get Approval',
          'Pack & Ship',
          'Inspection',
          'Refund Processed'
        ],
        excludedItems: [
          'Personalized or custom-made items',
          'Perishable goods (food, flowers, etc.)',
          'Intimate or sanitary goods',
          'Digital products or downloadable software',
          'Items without original packaging or tags',
          'Products damaged due to misuse'
        ],
        refundMethods: [
          'Credit/Debit Card',
          'PayPal',
          'Wallet Credit',
          'Bank Transfer'
        ]
      });
      
      setReturns([
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          customerId: 'customer1',
          productDetails: [
            {
              productId: 'prod1',
              productName: 'Premium Wireless Headphones',
              sku: 'WH-001',
              quantity: 1,
              price: 149.99,
              image: 'https://example.com/headphones.jpg'
            }
          ],
          reason: 'Defective product',
          reasonCode: 'defective',
          description: 'Left speaker not working properly',
          status: 'approved',
          returnMethod: 'pickup',
          refundAmount: 149.99,
          refundMethod: 'original-payment',
          images: [],
          notes: 'Quality inspection required',
          timeline: [
            {
              status: 'pending',
              timestamp: new Date('2024-01-15'),
              note: 'Return request submitted',
              updatedBy: 'Customer'
            },
            {
              status: 'approved',
              timestamp: new Date('2024-01-16'),
              note: 'Return approved by support team',
              updatedBy: 'Support Team'
            }
          ],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-16')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReturn = async (values: any) => {
    try {
      setReturnsLoading(true);
      
      const formData = {
        orderNumber: values.orderNumber,
        productIds: values.productIds,
        reason: values.reason,
        reasonCode: values.reasonCode,
        description: values.description,
        returnMethod: values.returnMethod,
        images: fileList.map(file => file.originFileObj).filter(Boolean)
      };

      await returnsAPI.createReturn(formData);
      
      message.success('Return request submitted successfully!');
      setCreateModalVisible(false);
      form.resetFields();
      setFileList([]);
      
      // Reload returns
      loadInitialData();
    } catch (error) {
      console.error('Error creating return:', error);
      message.error('Failed to submit return request');
    } finally {
      setReturnsLoading(false);
    }
  };

  const handleTrackReturn = async (returnId: string) => {
    try {
      const response = await returnsAPI.trackReturn(returnId);
      setSelectedReturn(response.data);
      setTrackModalVisible(true);
    } catch (error) {
      console.error('Error tracking return:', error);
      message.error('Failed to load return details');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'orange',
      'approved': 'blue',
      'rejected': 'red',
      'in-transit': 'purple',
      'received': 'cyan',
      'refunded': 'green'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      'pending': <ClockCircleOutlined />,
      'approved': <CheckCircleOutlined />,
      'rejected': <ExclamationCircleOutlined />,
      'in-transit': <TruckOutlined />,
      'received': <CheckCircleOutlined />,
      'refunded': <DollarOutlined />
    };
    return icons[status] || <QuestionCircleOutlined />;
  };

  const returnColumns = [
    {
      title: 'Return ID',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => <Text strong>#{id}</Text>
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber: string) => (
        <Button type="link" onClick={() => navigate(`/customer/orders/${orderNumber}`)}>
          {orderNumber}
        </Button>
      )
    },
    {
      title: 'Product',
      dataIndex: 'productDetails',
      key: 'product',
      render: (products: any[]) => (
        <div>
          <Text strong>{products[0]?.productName}</Text>
          <br />
          <Text type="secondary">{products[0]?.sku}</Text>
        </div>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string, record: ReturnRequest) => (
        <div>
          <Text>{reason}</Text>
          <br />
          <Tag color="blue">{record.reasonCode}</Tag>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'refundAmount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong>${amount.toFixed(2)}</Text>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          color={getStatusColor(status)} 
          text={status.replace('-', ' ').toUpperCase()}
        />
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: Date) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ReturnRequest) => (
        <Space>
          <Button 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleTrackReturn(record.id)}
          >
            Track
          </Button>
          {record.status === 'pending' && (
            <Button 
              size="small" 
              danger
              onClick={() => handleCancelReturn(record.id)}
            >
              Cancel
            </Button>
          )}
        </Space>
      )
    }
  ];

  const handleCancelReturn = async (returnId: string) => {
    try {
      await returnsAPI.cancelReturn(returnId, 'Customer requested cancellation');
      message.success('Return request cancelled');
      loadInitialData();
    } catch (error) {
      console.error('Error cancelling return:', error);
      message.error('Failed to cancel return');
    }
  };

  const beforeUpload = (file: any) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SyncOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <Title level={2} style={{ marginBottom: 8 }}>
            Return & Refund Policy
          </Title>
          <Text type="secondary">Our commitment to your satisfaction</Text>
        </div>

        {/* Stats Overview */}
        <Row gutter={16} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={6}>
            <Statistic 
              title="Total Returns" 
              value={returnStats.totalReturns} 
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic 
              title="Pending" 
              value={returnStats.pendingReturns} 
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic 
              title="Approved" 
              value={returnStats.approvedReturns} 
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} sm={6}>
            <Statistic 
              title="Completed" 
              value={returnStats.completedReturns} 
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
        </Row>

        <Tabs defaultActiveKey="policy">
          <TabPane tab="Return Policy" key="policy">
            {/* Key Highlights */}
            <Alert
              message={`${returnPolicy?.timeLimit || 30}-Day Return Policy`}
              description="We offer hassle-free returns within 30 days of delivery for most products. Your satisfaction is our priority."
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
              style={{ marginBottom: 32 }}
            />

            {/* Return Eligibility */}
            <Title level={3} style={{ marginTop: 32 }}>
              Return Eligibility
            </Title>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row gutter={24}>
                <Col xs={24} lg={12}>
                  <div>
                    <Text strong style={{ color: '#52c41a' }}>
                      ✓ Eligible for Return:
                    </Text>
                    <ul style={{ marginTop: 8 }}>
                      {(returnPolicy?.conditions || []).map((condition: string, index: number) => (
                        <li key={index}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div>
                    <Text strong style={{ color: '#ff4d4f' }}>
                      ✗ Not Eligible for Return:
                    </Text>
                    <ul style={{ marginTop: 8 }}>
                      {(returnPolicy?.excludedItems || []).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Return Process */}
            <Title level={3}>How to Return an Item</Title>
            <Steps
              direction="vertical"
              current={-1}
              style={{ marginBottom: 32 }}
            >
              <Step
                title="Request Return"
                description="Log into your account and go to 'My Orders'. Select the item you want to return and click 'Return Item'. Provide a reason for the return."
                icon={<ClockCircleOutlined />}
              />
              <Step
                title="Get Approval"
                description="Our team will review your request within 24-48 hours. You'll receive an email with return instructions and a prepaid shipping label (if applicable)."
                icon={<CheckCircleOutlined />}
              />
              <Step
                title="Pack & Ship"
                description="Pack the item securely in its original packaging. Attach the return label and drop it off at the designated shipping location."
                icon={<SyncOutlined />}
              />
              <Step
                title="Inspection"
                description="Once we receive your return, we'll inspect the item to ensure it meets our return criteria. This usually takes 3-5 business days."
                icon={<CheckCircleOutlined />}
              />
              <Step
                title="Refund Processed"
                description="After inspection, your refund will be processed to your original payment method within 5-7 business days."
                icon={<CheckCircleOutlined />}
              />
            </Steps>

            {/* Refund Timeline */}
            <Title level={3}>Refund Timeline</Title>
            <Timeline style={{ marginBottom: 32 }}>
              <Timeline.Item color="blue">
                <Text strong>Day 1-2:</Text> Return request submitted and approved
              </Timeline.Item>
              <Timeline.Item color="green">
                <Text strong>Day 3-7:</Text> Item received at our warehouse
              </Timeline.Item>
              <Timeline.Item color="orange">
                <Text strong>Day 8-10:</Text> Quality inspection completed
              </Timeline.Item>
              <Timeline.Item color="purple">
                <Text strong>Day 11-15:</Text> Refund initiated
              </Timeline.Item>
              <Timeline.Item>
                <Text strong>Day 16-20:</Text> Refund appears in your account (depending on your bank)
              </Timeline.Item>
            </Timeline>

            {/* Refund Methods */}
            <Title level={3}>Refund Methods</Title>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Tag color="blue">Credit/Debit Card</Tag>
                  <Text> - Refunded to original card within 5-7 business days</Text>
                </div>
                <div>
                  <Tag color="green">PayPal</Tag>
                  <Text> - Refunded to PayPal account within 2-3 business days</Text>
                </div>
                <div>
                  <Tag color="purple">Wallet Credit</Tag>
                  <Text> - Instant credit to your GROOW wallet (optional)</Text>
                </div>
                <div>
                  <Tag color="orange">Bank Transfer</Tag>
                  <Text> - Refunded within 7-10 business days</Text>
                </div>
              </Space>
            </Card>

            {/* Contact Support */}
            <Card style={{ marginTop: 32, background: '#f5f5f5' }}>
              <Title level={4}>
                <QuestionCircleOutlined /> Need Help?
              </Title>
              <Paragraph>
                If you have questions about returns or need assistance, our customer support team is
                here to help:
              </Paragraph>
              <Space direction="vertical">
                <Text><MailOutlined /> Email: returns@groow.com</Text>
                <Text><PhoneOutlined /> Phone: +1 (555) 123-4567</Text>
                <Text><CommentOutlined /> Live Chat: Available 24/7</Text>
              </Space>
            </Card>
          </TabPane>

          <TabPane tab="My Returns" key="returns">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={() => setCreateModalVisible(true)}
                >
                  Create Return Request
                </Button>
                <Button 
                  icon={<SyncOutlined />}
                  onClick={loadInitialData}
                >
                  Refresh
                </Button>
              </Space>
            </div>

            {returns.length === 0 ? (
              <Empty description="No return requests found" />
            ) : (
              <Table
                columns={returnColumns}
                dataSource={returns}
                rowKey="id"
                pagination={{
                  total: returnStats.totalReturns,
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => 
                    `${range[0]}-${range[1]} of ${total} returns`
                }}
              />
            )}
          </TabPane>
        </Tabs>

        {/* Create Return Modal */}
        <Modal
          title="Create Return Request"
          open={createModalVisible}
          onCancel={() => {
            setCreateModalVisible(false);
            form.resetFields();
            setFileList([]);
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateReturn}
          >
            <Form.Item
              name="orderNumber"
              label="Order Number"
              rules={[{ required: true, message: 'Please enter order number' }]}
            >
              <Input placeholder="Enter order number (e.g., ORD-2024-001)" />
            </Form.Item>

            <Form.Item
              name="productIds"
              label="Products to Return"
              rules={[{ required: true, message: 'Please select products' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select products from your order"
                options={[
                  { label: 'Premium Wireless Headphones', value: 'prod1' },
                  { label: 'Bluetooth Speaker', value: 'prod2' },
                  { label: 'Smart Watch', value: 'prod3' }
                ]}
              />
            </Form.Item>

            <Form.Item
              name="reasonCode"
              label="Reason for Return"
              rules={[{ required: true, message: 'Please select a reason' }]}
            >
              <Select placeholder="Select reason">
                <Option value="defective">Defective Product</Option>
                <Option value="wrong-item">Wrong Item Shipped</Option>
                <Option value="not-as-described">Not as Described</Option>
                <Option value="changed-mind">Changed Mind</Option>
                <Option value="damaged">Damaged in Transit</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please provide details' }]}
            >
              <TextArea
                rows={4}
                placeholder="Please provide detailed description of the issue..."
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="returnMethod"
              label="Return Method"
              rules={[{ required: true, message: 'Please select return method' }]}
            >
              <Select placeholder="How would you like to return the item?">
                <Option value="pickup">Pickup from Address</Option>
                <Option value="drop-off">Drop-off at Store</Option>
                <Option value="mail">Mail Return</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Upload Images (Optional)">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={beforeUpload}
                maxCount={5}
              >
                {fileList.length < 5 && (
                  <div>
                    <CameraOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Upload photos of the product (max 5 images, 5MB each)
              </Text>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={returnsLoading}
                >
                  Submit Return Request
                </Button>
                <Button onClick={() => setCreateModalVisible(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        {/* Track Return Modal */}
        <Modal
          title="Return Details"
          open={trackModalVisible}
          onCancel={() => setTrackModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setTrackModalVisible(false)}>
              Close
            </Button>
          ]}
          width={700}
        >
          {selectedReturn && (
            <div>
              <Descriptions bordered size="small" column={2}>
                <Descriptions.Item label="Return ID">#{selectedReturn.id}</Descriptions.Item>
                <Descriptions.Item label="Order Number">{selectedReturn.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge 
                    color={getStatusColor(selectedReturn.status)} 
                    text={selectedReturn.status.replace('-', ' ').toUpperCase()}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Refund Amount">
                  ${selectedReturn.refundAmount.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Return Method">{selectedReturn.returnMethod}</Descriptions.Item>
                <Descriptions.Item label="Refund Method">{selectedReturn.refundMethod}</Descriptions.Item>
                <Descriptions.Item label="Tracking Number" span={2}>
                  {selectedReturn.trackingNumber || 'Not assigned yet'}
                </Descriptions.Item>
              </Descriptions>

              <Title level={5} style={{ marginTop: 24 }}>Timeline</Title>
              <Timeline>
                {selectedReturn.timeline.map((event, index) => (
                  <Timeline.Item 
                    key={index}
                    dot={getStatusIcon(event.status)}
                    color={getStatusColor(event.status)}
                  >
                    <div>
                      <Text strong>{event.status.replace('-', ' ').toUpperCase()}</Text>
                      <br />
                      <Text type="secondary">{event.note}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {event.timestamp.toLocaleString()} - {event.updatedBy}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ReturnPolicyPage;
