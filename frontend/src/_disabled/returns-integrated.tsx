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
  Tabs,
  Image,
  Rate,
  Divider
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
  ExclamationCircleOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { returnsAPI } from '../services/api/returnsAPI';
import type { ReturnRequest, ReturnPolicy, ReturnStats } from '../services/api/returnsAPI';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const ReturnsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [returnsLoading, setReturnsLoading] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [trackModalVisible, setTrackModalVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('my-returns');
  
  // Data states
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [returnPolicy, setReturnPolicy] = useState<ReturnPolicy | null>(null);
  const [returnStats, setReturnStats] = useState<ReturnStats | null>(null);
  const [eligibleOrders, setEligibleOrders] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [
        returnsRes,
        policyRes,
        statsRes,
        ordersRes
      ] = await Promise.all([
        returnsAPI.getCustomerReturns({ limit: 10 }),
        returnsAPI.getReturnPolicy(),
        returnsAPI.getReturnStats(),
        returnsAPI.getEligibleOrders()
      ]);

      if (returnsRes.success) setReturns(returnsRes.data.data);
      if (policyRes.success) setReturnPolicy(policyRes.data);
      if (statsRes.success) setReturnStats(statsRes.data);
      if (ordersRes.success) setEligibleOrders(ordersRes.data);

    } catch (error) {
      console.error('Error loading returns data:', error);
      message.error('Failed to load returns data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReturn = async (values: any) => {
    try {
      setReturnsLoading(true);
      
      const response = await returnsAPI.createReturnRequest(values);
      
      if (response.success) {
        message.success('Return request created successfully');
        setCreateModalVisible(false);
        form.resetFields();
        loadInitialData(); // Reload data
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error('Error creating return:', error);
      message.error('Failed to create return request');
    } finally {
      setReturnsLoading(false);
    }
  };

  const handleTrackReturn = async (returnId: string) => {
    try {
      const response = await returnsAPI.trackReturn(returnId);
      
      if (response.success) {
        setSelectedReturn(returns.find(r => r.id === returnId) || null);
        setTrackModalVisible(true);
      } else {
        message.error('Failed to track return');
      }
    } catch (error) {
      console.error('Error tracking return:', error);
      message.error('Failed to track return');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'orange',
      approved: 'blue',
      rejected: 'red',
      processing: 'purple',
      completed: 'green',
      cancelled: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      pending: <ClockCircleOutlined />,
      approved: <CheckCircleOutlined />,
      rejected: <WarningOutlined />,
      processing: <SyncOutlined spin />,
      completed: <CheckCircleOutlined />,
      cancelled: <ExclamationCircleOutlined />
    };
    return icons[status] || <QuestionCircleOutlined />;
  };

  const renderReturnSteps = (status: string) => {
    const steps = [
      { title: 'Submitted', status: 'finish' },
      { title: 'Under Review', status: status === 'pending' ? 'process' : 'finish' },
      { title: 'Approved', status: ['approved', 'processing', 'completed'].includes(status) ? 'finish' : 'wait' },
      { title: 'Processing', status: status === 'processing' ? 'process' : status === 'completed' ? 'finish' : 'wait' },
      { title: 'Completed', status: status === 'completed' ? 'finish' : 'wait' }
    ];

    if (status === 'rejected') {
      steps[2] = { title: 'Rejected', status: 'error' };
      steps[3] = { title: 'Closed', status: 'finish' };
      steps[4] = { title: '', status: 'wait' };
    }

    return (
      <Steps current={-1} size="small">
        {steps.map((step, index) => (
          step.title && <Step key={index} title={step.title} status={step.status as any} />
        ))}
      </Steps>
    );
  };

  const returnsColumns = [
    {
      title: 'Return ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <Text strong>#{id}</Text>
      )
    },
    {
      title: 'Order',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (orderNumber: string) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/orders/${orderNumber}`)}
        >
          {orderNumber}
        </Button>
      )
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <div>
          <Text>{items.length} item(s)</Text>
          <br />
          <Text type="secondary">${items.reduce((sum, item) => sum + item.refundAmount, 0).toFixed(2)}</Text>
        </div>
      )
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <Tag>{reason.replace('_', ' ').toUpperCase()}</Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={getStatusColor(status) as any} 
          text={status.toUpperCase()}
        />
      )
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: ReturnRequest) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleTrackReturn(record.id)}
          >
            Track
          </Button>
        </Space>
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card>
          <Spin size="large" style={{ display: 'block', textAlign: 'center', padding: 50 }} />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Header */}
        <Card style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2}>
                <RetweetOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                Returns & Refunds
              </Title>
              <Paragraph>
                Manage your return requests and track refund status
              </Paragraph>
            </Col>
            <Col>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                Create Return
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Statistics */}
        {returnStats && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Returns"
                  value={returnStats.totalReturns}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Pending"
                  value={returnStats.pendingReturns}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Completed"
                  value={returnStats.completedReturns}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Refunded"
                  value={returnStats.totalRefundAmount}
                  precision={2}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Main Content */}
        <Card>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="My Returns" key="my-returns">
              {returns.length > 0 ? (
                <Table
                  dataSource={returns}
                  columns={returnsColumns}
                  rowKey="id"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} returns`
                  }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No returns found"
                >
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => setCreateModalVisible(true)}
                  >
                    Create First Return
                  </Button>
                </Empty>
              )}
            </TabPane>

            <TabPane tab="Return Policy" key="policy">
              {returnPolicy && (
                <div>
                  <Title level={3}>{returnPolicy.title}</Title>
                  
                  <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <Statistic
                          title="Return Period"
                          value={returnPolicy.returnPeriodDays}
                          suffix="days"
                          prefix={<CalendarOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <Statistic
                          title="Processing Time"
                          value={returnPolicy.processingTimeDays}
                          suffix="days"
                          prefix={<ClockCircleOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card size="small">
                        <div>
                          <Text strong>Refund Methods</Text>
                          <br />
                          {returnPolicy.refundMethods.map((method, index) => (
                            <Tag key={index} style={{ marginTop: 4 }}>
                              {method}
                            </Tag>
                          ))}
                        </div>
                      </Card>
                    </Col>
                  </Row>

                  <Card title="Return Conditions" style={{ marginBottom: 16 }}>
                    <ul>
                      {returnPolicy.conditions.map((condition, index) => (
                        <li key={index}>
                          <Text>{condition}</Text>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <div dangerouslySetInnerHTML={{ __html: returnPolicy.content }} />
                </div>
              )}
            </TabPane>

            <TabPane tab="Help & Support" key="support">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <PhoneOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
                      <Title level={4}>Call Support</Title>
                      <Text>+1 (555) 123-4567</Text>
                      <br />
                      <Text type="secondary">Mon-Fri 9AM-6PM</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <MailOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 16 }} />
                      <Title level={4}>Email Support</Title>
                      <Text>returns@groow.com</Text>
                      <br />
                      <Text type="secondary">24-48hr response</Text>
                    </div>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card>
                    <div style={{ textAlign: 'center' }}>
                      <CommentOutlined style={{ fontSize: 32, color: '#faad14', marginBottom: 16 }} />
                      <Title level={4}>Live Chat</Title>
                      <Button type="primary">Start Chat</Button>
                      <br />
                      <Text type="secondary">Available now</Text>
                    </div>
                  </Card>
                </Col>
              </Row>

              <Card title="Frequently Asked Questions" style={{ marginTop: 24 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Text strong>How long does it take to process a return?</Text>
                    <br />
                    <Text>Returns typically take 3-5 business days to process once we receive your item.</Text>
                  </div>
                  <Divider />
                  <div>
                    <Text strong>Can I return items without original packaging?</Text>
                    <br />
                    <Text>Items must be returned in original condition with packaging for a full refund.</Text>
                  </div>
                  <Divider />
                  <div>
                    <Text strong>How do I track my return status?</Text>
                    <br />
                    <Text>You can track your return status in the "My Returns" tab or contact customer support.</Text>
                  </div>
                </Space>
              </Card>
            </TabPane>
          </Tabs>
        </Card>

        {/* Create Return Modal */}
        <Modal
          title="Create Return Request"
          open={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateReturn}
          >
            <Form.Item
              name="orderId"
              label="Select Order"
              rules={[{ required: true, message: 'Please select an order' }]}
            >
              <Select placeholder="Select an order to return">
                {eligibleOrders.map(order => (
                  <Option key={order.id} value={order.id}>
                    {order.orderNumber} - {new Date(order.createdAt).toLocaleDateString()}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="reason"
              label="Return Reason"
              rules={[{ required: true, message: 'Please select a reason' }]}
            >
              <Select placeholder="Select return reason">
                <Option value="damaged">Damaged/Defective</Option>
                <Option value="wrong_item">Wrong Item</Option>
                <Option value="not_as_described">Not as Described</Option>
                <Option value="changed_mind">Changed Mind</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="reasonDescription"
              label="Description"
              rules={[{ required: true, message: 'Please provide details' }]}
            >
              <TextArea
                rows={4}
                placeholder="Please provide detailed information about the return reason..."
              />
            </Form.Item>

            <Form.Item
              name="refundMethod"
              label="Preferred Refund Method"
              rules={[{ required: true, message: 'Please select refund method' }]}
            >
              <Select placeholder="Select refund method">
                <Option value="original_payment">Original Payment Method</Option>
                <Option value="store_credit">Store Credit</Option>
                <Option value="exchange">Exchange</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Upload Images (Optional)">
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={5}
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
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
          title="Track Return Status"
          open={trackModalVisible}
          onCancel={() => setTrackModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setTrackModalVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {selectedReturn && (
            <div>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Return ID">#{selectedReturn.id}</Descriptions.Item>
                <Descriptions.Item label="Order">{selectedReturn.orderNumber}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge 
                    status={getStatusColor(selectedReturn.status) as any} 
                    text={selectedReturn.status.toUpperCase()}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Refund Amount">
                  ${selectedReturn.refundAmount.toFixed(2)}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {new Date(selectedReturn.createdAt).toLocaleDateString()}
                </Descriptions.Item>
              </Descriptions>

              <div style={{ marginTop: 24 }}>
                <Title level={4}>Return Progress</Title>
                {renderReturnSteps(selectedReturn.status)}
              </div>

              {selectedReturn.status === 'processing' && (
                <Alert
                  message="Return Being Processed"
                  description={`Your return is currently being processed. Estimated completion: ${selectedReturn.estimatedProcessingDays} business days.`}
                  type="info"
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReturnsPage;