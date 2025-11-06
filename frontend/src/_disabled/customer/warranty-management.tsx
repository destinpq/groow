import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Statistic,
  Alert,
  Descriptions,
  Steps,
  Timeline,
} from 'antd';
import {
  FileProtectOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Step } = Steps;

interface Warranty {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyPeriod: number; // months
  expiryDate: string;
  type: 'manufacturer' | 'extended' | 'premium';
  status: 'active' | 'expired' | 'claimed' | 'processing';
  orderId: string;
  coverage: string[];
  registrationDate: string;
  price?: number;
}

interface Claim {
  id: number;
  warrantyId: number;
  productName: string;
  issueType: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'processing';
  submittedDate: string;
  resolvedDate?: string;
  resolution?: string;
  trackingNumber?: string;
}

const mockWarranties: Warranty[] = [
  {
    id: 1,
    productId: 101,
    productName: 'MacBook Pro 16" M4',
    productImage: 'https://via.placeholder.com/60?text=MacBook',
    serialNumber: 'C02YD2EAJG5H',
    purchaseDate: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
    warrantyPeriod: 12,
    expiryDate: dayjs().add(6, 'months').format('YYYY-MM-DD'),
    type: 'manufacturer',
    status: 'active',
    orderId: '#12345',
    coverage: ['Hardware defects', 'Manufacturing issues', 'Parts replacement'],
    registrationDate: dayjs().subtract(6, 'months').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    productId: 102,
    productName: 'Sony WH-1000XM5 Headphones',
    productImage: 'https://via.placeholder.com/60?text=Headphones',
    serialNumber: 'SN-WH1000XM5-2025',
    purchaseDate: dayjs().subtract(18, 'months').format('YYYY-MM-DD'),
    warrantyPeriod: 24,
    expiryDate: dayjs().add(6, 'months').format('YYYY-MM-DD'),
    type: 'extended',
    status: 'active',
    orderId: '#12340',
    coverage: ['Hardware defects', 'Accidental damage', 'Battery replacement', 'Free repairs'],
    registrationDate: dayjs().subtract(18, 'months').format('YYYY-MM-DD'),
    price: 49.99,
  },
  {
    id: 3,
    productId: 103,
    productName: 'iPhone 15 Pro Max',
    productImage: 'https://via.placeholder.com/60?text=iPhone',
    serialNumber: 'F17XK2DMPP3N',
    purchaseDate: dayjs().subtract(14, 'months').format('YYYY-MM-DD'),
    warrantyPeriod: 12,
    expiryDate: dayjs().subtract(2, 'months').format('YYYY-MM-DD'),
    type: 'manufacturer',
    status: 'expired',
    orderId: '#12338',
    coverage: ['Hardware defects', 'Manufacturing issues'],
    registrationDate: dayjs().subtract(14, 'months').format('YYYY-MM-DD'),
  },
  {
    id: 4,
    productId: 104,
    productName: 'Samsung 65" QLED TV',
    productImage: 'https://via.placeholder.com/60?text=TV',
    serialNumber: 'QN65Q80CAFXZA',
    purchaseDate: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
    warrantyPeriod: 36,
    expiryDate: dayjs().add(33, 'months').format('YYYY-MM-DD'),
    type: 'premium',
    status: 'claimed',
    orderId: '#12350',
    coverage: [
      'Hardware defects',
      'Accidental damage',
      'Screen protection',
      'Free repairs',
      'Replacement device',
      'On-site service',
    ],
    registrationDate: dayjs().subtract(3, 'months').format('YYYY-MM-DD'),
    price: 149.99,
  },
];

const mockClaims: Claim[] = [
  {
    id: 1,
    warrantyId: 4,
    productName: 'Samsung 65" QLED TV',
    issueType: 'Screen damage',
    description: 'Vertical line appeared on the screen',
    status: 'processing',
    submittedDate: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
  },
  {
    id: 2,
    warrantyId: 2,
    productName: 'Sony WH-1000XM5 Headphones',
    issueType: 'Audio malfunction',
    description: 'Left ear cup not producing sound',
    status: 'completed',
    submittedDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    resolvedDate: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    resolution: 'Replacement device shipped',
    trackingNumber: 'TRK123456789',
  },
];

const WarrantyManagementPage: React.FC = () => {
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties);
  const [claims, setClaims] = useState<Claim[]>(mockClaims);
  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState<boolean>(false);
  const [isClaimModalVisible, setIsClaimModalVisible] = useState<boolean>(false);
  const [selectedWarranty, setSelectedWarranty] = useState<Warranty | null>(null);
  const [form] = Form.useForm();
  const [claimForm] = Form.useForm();

  const handleRegisterWarranty = (values: any) => {
    const newWarranty: Warranty = {
      id: warranties.length + 1,
      productId: Math.floor(Math.random() * 1000),
      productName: values.productName,
      productImage: 'https://via.placeholder.com/60?text=Product',
      serialNumber: values.serialNumber,
      purchaseDate: values.purchaseDate.format('YYYY-MM-DD'),
      warrantyPeriod: values.warrantyPeriod,
      expiryDate: values.purchaseDate.add(values.warrantyPeriod, 'months').format('YYYY-MM-DD'),
      type: values.type,
      status: 'active',
      orderId: values.orderId,
      coverage: values.coverage || ['Hardware defects', 'Manufacturing issues'],
      registrationDate: dayjs().format('YYYY-MM-DD'),
      price: values.type !== 'manufacturer' ? values.price : undefined,
    };

    setWarranties([newWarranty, ...warranties]);
    message.success('Warranty registered successfully!');
    setIsRegisterModalVisible(false);
    form.resetFields();
  };

  const handleFileClaim = (values: any) => {
    if (!selectedWarranty) return;

    const newClaim: Claim = {
      id: claims.length + 1,
      warrantyId: selectedWarranty.id,
      productName: selectedWarranty.productName,
      issueType: values.issueType,
      description: values.description,
      status: 'pending',
      submittedDate: dayjs().format('YYYY-MM-DD'),
    };

    setClaims([newClaim, ...claims]);
    setWarranties(
      warranties.map((w) =>
        w.id === selectedWarranty.id ? { ...w, status: 'processing' as const } : w
      )
    );
    message.success('Warranty claim submitted successfully! We will review and respond within 2-3 business days.');
    setIsClaimModalVisible(false);
    claimForm.resetFields();
    setSelectedWarranty(null);
  };

  const handleViewWarranty = (warranty: Warranty) => {
    Modal.info({
      title: 'Warranty Details',
      width: 700,
      content: (
        <div>
          <Descriptions bordered column={1} style={{ marginTop: 16 }}>
            <Descriptions.Item label="Product">{warranty.productName}</Descriptions.Item>
            <Descriptions.Item label="Serial Number">{warranty.serialNumber}</Descriptions.Item>
            <Descriptions.Item label="Order ID">{warranty.orderId}</Descriptions.Item>
            <Descriptions.Item label="Purchase Date">
              {dayjs(warranty.purchaseDate).format('MMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Warranty Period">{warranty.warrantyPeriod} months</Descriptions.Item>
            <Descriptions.Item label="Expiry Date">
              {dayjs(warranty.expiryDate).format('MMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={warranty.type === 'premium' ? 'gold' : warranty.type === 'extended' ? 'blue' : 'green'}>
                {warranty.type.toUpperCase()}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Coverage">
              {warranty.coverage.map((item, index) => (
                <Tag key={index} color="blue" style={{ margin: 2 }}>
                  {item}
                </Tag>
              ))}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ),
    });
  };

  const warrantyColumns: ColumnsType<Warranty> = [
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={record.productImage} alt={record.productName} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
          <div>
            <div>
              <Text strong>{record.productName}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              SN: {record.serialNumber}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: Warranty['type'], record) => {
        const typeConfig = {
          manufacturer: { color: 'green', text: 'Manufacturer' },
          extended: { color: 'blue', text: 'Extended' },
          premium: { color: 'gold', text: 'Premium' },
        };
        const config = typeConfig[type];
        return (
          <div>
            <Tag color={config.color}>{config.text}</Tag>
            {record.price && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ${record.price}
                </Text>
              </div>
            )}
          </div>
        );
      },
      filters: [
        { text: 'Manufacturer', value: 'manufacturer' },
        { text: 'Extended', value: 'extended' },
        { text: 'Premium', value: 'premium' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_, record) => {
        const daysLeft = dayjs(record.expiryDate).diff(dayjs(), 'days');
        const monthsLeft = dayjs(record.expiryDate).diff(dayjs(), 'months');
        return (
          <div>
            <div>
              <Text>{dayjs(record.expiryDate).format('MMM DD, YYYY')}</Text>
            </div>
            {record.status === 'active' && (
              <Text
                type={daysLeft < 30 ? 'danger' : 'secondary'}
                style={{ fontSize: 12 }}
              >
                {monthsLeft > 0 ? `${monthsLeft} months left` : `${daysLeft} days left`}
              </Text>
            )}
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Warranty['status']) => {
        const statusConfig = {
          active: { color: 'green', icon: <CheckCircleOutlined />, text: 'Active' },
          expired: { color: 'default', icon: <ClockCircleOutlined />, text: 'Expired' },
          claimed: { color: 'orange', icon: <WarningOutlined />, text: 'Claim Processing' },
          processing: { color: 'blue', icon: <ClockCircleOutlined />, text: 'Processing' },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Expired', value: 'expired' },
        { text: 'Claimed', value: 'claimed' },
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
            onClick={() => handleViewWarranty(record)}
          >
            View
          </Button>
          {record.status === 'active' && (
            <Button
              type="primary"
              size="small"
              onClick={() => {
                setSelectedWarranty(record);
                setIsClaimModalVisible(true);
              }}
            >
              File Claim
            </Button>
          )}
          <Button type="link" icon={<DownloadOutlined />}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  const claimColumns: ColumnsType<Claim> = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'product',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Issue',
      dataIndex: 'issueType',
      key: 'issue',
      render: (issue, record) => (
        <div>
          <Text>{issue}</Text>
          <Paragraph
            type="secondary"
            style={{ fontSize: 12, margin: 0 }}
            ellipsis={{ rows: 2 }}
          >
            {record.description}
          </Paragraph>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Claim['status']) => {
        const statusConfig = {
          pending: { color: 'blue', text: 'Pending Review' },
          approved: { color: 'green', text: 'Approved' },
          rejected: { color: 'red', text: 'Rejected' },
          completed: { color: 'success', text: 'Completed' },
          processing: { color: 'orange', text: 'Processing' },
        };
        const config = statusConfig[status];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submitted',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Resolution',
      key: 'resolution',
      render: (_, record) => {
        if (record.status === 'completed') {
          return (
            <div>
              <Text style={{ fontSize: 12 }}>{record.resolution}</Text>
              {record.trackingNumber && (
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Tracking: {record.trackingNumber}
                  </Text>
                </div>
              )}
            </div>
          );
        }
        return <Text type="secondary">-</Text>;
      },
    },
  ];

  const activeWarranties = warranties.filter((w) => w.status === 'active').length;
  const expiringSoon = warranties.filter(
    (w) => w.status === 'active' && dayjs(w.expiryDate).diff(dayjs(), 'days') < 30
  ).length;
  const activeClaims = claims.filter((c) => c.status === 'pending' || c.status === 'processing').length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <FileProtectOutlined style={{ color: '#1890ff' }} /> Warranty Management
          </Title>
          <Paragraph type="secondary">
            Register products, manage warranties, and file claims
          </Paragraph>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsRegisterModalVisible(true)}
          >
            Register Warranty
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Warranties"
              value={activeWarranties}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Expiring Soon"
              value={expiringSoon}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Claims"
              value={activeClaims}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {expiringSoon > 0 && (
        <Alert
          message={`${expiringSoon} warranty(ies) expiring within 30 days`}
          description="Consider purchasing extended warranty coverage before expiration"
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="My Warranties" style={{ marginBottom: 24 }}>
        <Table
          columns={warrantyColumns}
          dataSource={warranties}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Card title="Warranty Claims">
        <Table
          columns={claimColumns}
          dataSource={claims}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Register Warranty"
        open={isRegisterModalVisible}
        onCancel={() => setIsRegisterModalVisible(false)}
        footer={null}
        width={700}
      >
        <Alert
          message="Why Register Your Warranty?"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Easy warranty claim process</li>
              <li>Automatic expiry notifications</li>
              <li>Digital warranty certificate</li>
              <li>Access to extended warranty options</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleRegisterWarranty}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input size="large" placeholder="MacBook Pro 16 M4" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Serial Number"
                name="serialNumber"
                rules={[{ required: true, message: 'Please enter serial number' }]}
              >
                <Input size="large" placeholder="C02YD2EAJG5H" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Order ID"
                name="orderId"
                rules={[{ required: true, message: 'Please enter order ID' }]}
              >
                <Input size="large" placeholder="#12345" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Purchase Date"
                name="purchaseDate"
                rules={[{ required: true, message: 'Please select purchase date' }]}
              >
                <DatePicker style={{ width: '100%' }} size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Warranty Type"
                name="type"
                rules={[{ required: true, message: 'Please select type' }]}
                initialValue="manufacturer"
              >
                <Select size="large">
                  <Option value="manufacturer">Manufacturer (Free)</Option>
                  <Option value="extended">Extended Warranty</Option>
                  <Option value="premium">Premium Coverage</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Warranty Period (Months)"
            name="warrantyPeriod"
            rules={[{ required: true, message: 'Please enter warranty period' }]}
            initialValue={12}
          >
            <Select size="large">
              <Option value={12}>12 Months</Option>
              <Option value={24}>24 Months</Option>
              <Option value={36}>36 Months</Option>
              <Option value={60}>60 Months</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') !== 'manufacturer' ? (
                <Form.Item
                  label="Warranty Price"
                  name="price"
                  rules={[{ required: true, message: 'Please enter price' }]}
                >
                  <Input type="number" prefix="$" size="large" placeholder="49.99" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<PlusOutlined />}>
                Register Warranty
              </Button>
              <Button size="large" onClick={() => setIsRegisterModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="File Warranty Claim"
        open={isClaimModalVisible}
        onCancel={() => {
          setIsClaimModalVisible(false);
          setSelectedWarranty(null);
        }}
        footer={null}
        width={700}
      >
        {selectedWarranty && (
          <>
            <Alert
              message="Claim Process Timeline"
              description={
                <Steps current={0} size="small" style={{ marginTop: 16 }}>
                  <Step title="Submit" description="File your claim" />
                  <Step title="Review" description="2-3 business days" />
                  <Step title="Approve" description="Decision made" />
                  <Step title="Resolve" description="Repair or replace" />
                </Steps>
              }
              type="info"
              showIcon
              style={{ marginBottom: 24 }}
            />

            <Form form={claimForm} layout="vertical" onFinish={handleFileClaim}>
              <Descriptions bordered column={1} size="small" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Product">{selectedWarranty.productName}</Descriptions.Item>
                <Descriptions.Item label="Serial Number">{selectedWarranty.serialNumber}</Descriptions.Item>
                <Descriptions.Item label="Warranty Expires">
                  {dayjs(selectedWarranty.expiryDate).format('MMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>

              <Form.Item
                label="Issue Type"
                name="issueType"
                rules={[{ required: true, message: 'Please select issue type' }]}
              >
                <Select size="large" placeholder="Select the type of issue">
                  <Option value="Hardware defect">Hardware Defect</Option>
                  <Option value="Screen damage">Screen Damage</Option>
                  <Option value="Battery issue">Battery Issue</Option>
                  <Option value="Audio malfunction">Audio Malfunction</Option>
                  <Option value="Power issue">Power Issue</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: 'Please describe the issue' },
                  { min: 20, message: 'Please provide at least 20 characters' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" size="large" icon={<FileTextOutlined />}>
                    Submit Claim
                  </Button>
                  <Button
                    size="large"
                    onClick={() => {
                      setIsClaimModalVisible(false);
                      setSelectedWarranty(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default WarrantyManagementPage;
