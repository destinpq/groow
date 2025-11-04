import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Upload,
  Select,
  InputNumber,
  DatePicker,
  message,
  Divider,
  Steps,
  Alert,
} from 'antd';
import {
  InboxOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileOutlined,
  SendOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

interface SampleRequest {
  id: number;
  productName: string;
  vendorName: string;
  quantity: number;
  requestDate: string;
  requiredDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'shipped' | 'received';
  notes: string;
  specifications?: string;
  attachments?: string[];
}

const mockSampleRequests: SampleRequest[] = [
  {
    id: 1,
    productName: 'Wireless Headphones Pro',
    vendorName: 'TechHub Electronics',
    quantity: 2,
    requestDate: '2024-11-01',
    requiredDate: '2024-11-15',
    status: 'approved',
    notes: 'Need samples for quality testing',
    specifications: 'Bluetooth 5.0, Active Noise Cancellation',
  },
  {
    id: 2,
    productName: 'Organic Cotton T-Shirt',
    vendorName: 'Fashion Boutique',
    quantity: 5,
    requestDate: '2024-10-28',
    requiredDate: '2024-11-10',
    status: 'shipped',
    notes: 'Different sizes needed for fit testing',
    specifications: 'Sizes: S, M, L, XL, XXL',
  },
  {
    id: 3,
    productName: 'Smart Watch Series 5',
    vendorName: 'TechHub Electronics',
    quantity: 1,
    requestDate: '2024-10-25',
    requiredDate: '2024-11-05',
    status: 'pending',
    notes: 'Evaluation for potential bulk order',
  },
];

const SampleRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<SampleRequest[]>(mockSampleRequests);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleCreateRequest = () => {
    form.validateFields().then((values) => {
      const newRequest: SampleRequest = {
        id: Date.now(),
        productName: values.productName,
        vendorName: values.vendorName,
        quantity: values.quantity,
        requestDate: dayjs().format('YYYY-MM-DD'),
        requiredDate: values.requiredDate.format('YYYY-MM-DD'),
        status: 'pending',
        notes: values.notes,
        specifications: values.specifications,
        attachments: fileList.map((file) => file.name),
      };

      setRequests([newRequest, ...requests]);
      message.success('Sample request created successfully!');
      setIsModalVisible(false);
      setCurrentStep(0);
      form.resetFields();
      setFileList([]);
    });
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      form
        .validateFields(['productName', 'vendorName', 'quantity'])
        .then(() => setCurrentStep(1));
    } else if (currentStep === 1) {
      form.validateFields(['requiredDate', 'notes']).then(() => setCurrentStep(2));
    }
  };

  const handleUpdateStatus = (id: number, status: SampleRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
    message.success(`Request status updated to ${status}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'approved':
        return 'blue';
      case 'rejected':
        return 'red';
      case 'shipped':
        return 'cyan';
      case 'received':
        return 'green';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined />;
      case 'approved':
        return <CheckCircleOutlined />;
      case 'rejected':
        return <CloseCircleOutlined />;
      case 'shipped':
        return <SendOutlined />;
      case 'received':
        return <CheckCircleOutlined />;
      default:
        return null;
    }
  };

  const columns: ColumnsType<SampleRequest> = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <Text code>SR-{id}</Text>,
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (qty) => <Tag>{qty}</Tag>,
    },
    {
      title: 'Request Date',
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Required By',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => handleUpdateStatus(record.id, 'approved')}
              >
                Approve
              </Button>
              <Button
                size="small"
                danger
                onClick={() => handleUpdateStatus(record.id, 'rejected')}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleUpdateStatus(record.id, 'shipped')}
            >
              Mark Shipped
            </Button>
          )}
          {record.status === 'shipped' && (
            <Button
              size="small"
              type="primary"
              onClick={() => handleUpdateStatus(record.id, 'received')}
            >
              Mark Received
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const uploadProps = {
    fileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => setFileList(fileList),
    beforeUpload: () => false,
    multiple: true,
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === 'pending').length,
    approved: requests.filter((r) => r.status === 'approved').length,
    received: requests.filter((r) => r.status === 'received').length,
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3}>
              <FileOutlined style={{ color: '#1890ff' }} /> Sample Requests
            </Title>
            <Paragraph type="secondary">
              Request product samples from vendors for evaluation
            </Paragraph>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            New Sample Request
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Total Requests"
              value={stats.total}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Approved"
              value={stats.approved}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="Received"
              value={stats.received}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Requests Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: 16 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong>Notes:</Text>
                    <Paragraph style={{ marginTop: 8 }}>{record.notes}</Paragraph>
                  </div>
                  {record.specifications && (
                    <div>
                      <Text strong>Specifications:</Text>
                      <Paragraph style={{ marginTop: 8 }}>{record.specifications}</Paragraph>
                    </div>
                  )}
                  {record.attachments && record.attachments.length > 0 && (
                    <div>
                      <Text strong>Attachments:</Text>
                      <div style={{ marginTop: 8 }}>
                        {record.attachments.map((file, idx) => (
                          <Tag key={idx} icon={<FileOutlined />}>
                            {file}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </Space>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create Request Modal */}
      <Modal
        title="Create Sample Request"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentStep(0);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={700}
      >
        <Steps
          current={currentStep}
          items={[
            { title: 'Product Details' },
            { title: 'Request Info' },
            { title: 'Attachments' },
          ]}
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical">
          {/* Step 1: Product Details */}
          {currentStep === 0 && (
            <div>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[{ required: true, message: 'Please enter product name' }]}
              >
                <Input placeholder="e.g., Wireless Headphones Pro" />
              </Form.Item>
              <Form.Item
                name="vendorName"
                label="Vendor"
                rules={[{ required: true, message: 'Please select vendor' }]}
              >
                <Select
                  placeholder="Select vendor"
                  options={[
                    { label: 'TechHub Electronics', value: 'TechHub Electronics' },
                    { label: 'Fashion Boutique', value: 'Fashion Boutique' },
                    { label: 'Home Essentials', value: 'Home Essentials' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: 'Please enter quantity' }]}
                initialValue={1}
              >
                <InputNumber min={1} max={10} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name="specifications" label="Specifications">
                <TextArea rows={3} placeholder="Any specific requirements or specifications" />
              </Form.Item>
            </div>
          )}

          {/* Step 2: Request Info */}
          {currentStep === 1 && (
            <div>
              <Form.Item
                name="requiredDate"
                label="Required By Date"
                rules={[{ required: true, message: 'Please select required date' }]}
              >
                <DatePicker style={{ width: '100%' }} disabledDate={(d) => d.isBefore(dayjs())} />
              </Form.Item>
              <Form.Item
                name="notes"
                label="Request Notes"
                rules={[{ required: true, message: 'Please enter notes' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Explain the purpose of this sample request..."
                />
              </Form.Item>
              <Alert
                message="Sample Request Guidelines"
                description="Please provide detailed information about why you need these samples. This helps vendors prioritize and process your request faster."
                type="info"
                showIcon
              />
            </div>
          )}

          {/* Step 3: Attachments */}
          {currentStep === 2 && (
            <div>
              <Form.Item label="Attachments (Optional)">
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag files to upload</p>
                  <p className="ant-upload-hint">
                    Upload technical specifications, drawings, or reference images
                  </p>
                </Dragger>
              </Form.Item>
              <Alert
                message="Ready to Submit"
                description="Review your request details and click Submit to send it to the vendor."
                type="success"
                showIcon
              />
            </div>
          )}

          <Divider />

          {/* Navigation Buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
              Previous
            </Button>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              {currentStep < 2 ? (
                <Button type="primary" onClick={handleNextStep}>
                  Next
                </Button>
              ) : (
                <Button type="primary" onClick={handleCreateRequest}>
                  Submit Request
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

// Add Statistic import
import { Statistic } from 'antd';

export default SampleRequestsPage;
