import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Space,
  message,
  Table,
  Tag,
  Modal,
  Upload,
  Divider,
  Alert,
} from 'antd';
import {
  FileProtectOutlined,
  PlusOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface TaxExemption {
  id: number;
  organizationType: string;
  organizationName: string;
  taxId: string;
  exemptionCertificate: string;
  state: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  appliedDate: string;
  approvedDate?: string;
  expiryDate?: string;
  notes?: string;
}

const mockExemptions: TaxExemption[] = [
  {
    id: 1,
    organizationType: 'Non-Profit Organization',
    organizationName: 'ABC Charity Foundation',
    taxId: '12-3456789',
    exemptionCertificate: 'certificate_001.pdf',
    state: 'California',
    status: 'approved',
    appliedDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    approvedDate: dayjs().subtract(25, 'days').format('YYYY-MM-DD'),
    expiryDate: dayjs().add(335, 'days').format('YYYY-MM-DD'),
    notes: 'Valid for 501(c)(3) purchases',
  },
  {
    id: 2,
    organizationType: 'Educational Institution',
    organizationName: 'XYZ University',
    taxId: '98-7654321',
    exemptionCertificate: 'certificate_002.pdf',
    state: 'New York',
    status: 'pending',
    appliedDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    notes: 'Awaiting verification',
  },
];

const TaxExemptionPage: React.FC = () => {
  const [exemptions, setExemptions] = useState<TaxExemption[]>(mockExemptions);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  const handleApply = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  const handleSubmit = (values: any) => {
    if (fileList.length === 0) {
      message.error('Please upload your tax exemption certificate');
      return;
    }

    const newExemption: TaxExemption = {
      id: exemptions.length + 1,
      organizationType: values.organizationType,
      organizationName: values.organizationName,
      taxId: values.taxId,
      exemptionCertificate: fileList[0].name,
      state: values.state,
      status: 'pending',
      appliedDate: dayjs().format('YYYY-MM-DD'),
      notes: values.notes,
    };

    setExemptions([newExemption, ...exemptions]);
    message.success('Tax exemption application submitted successfully! We will review it within 2-3 business days.');
    setIsModalVisible(false);
    form.resetFields();
    setFileList([]);
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Tax Exemption',
      content: 'Are you sure you want to delete this tax exemption application?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setExemptions(exemptions.filter((e) => e.id !== id));
        message.success('Tax exemption deleted successfully');
      },
    });
  };

  const columns: ColumnsType<TaxExemption> = [
    {
      title: 'Organization',
      key: 'organization',
      render: (_, record) => (
        <div>
          <Text strong>{record.organizationName}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.organizationType}
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Tax ID: {record.taxId}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaxExemption['status']) => {
        const config: Record<TaxExemption['status'], { color: string; text: string; icon: React.ReactNode }> = {
          pending: { color: 'orange', text: 'Pending Review', icon: <ClockCircleOutlined /> },
          approved: { color: 'green', text: 'Approved', icon: <CheckCircleOutlined /> },
          rejected: { color: 'red', text: 'Rejected', icon: <InfoCircleOutlined /> },
          expired: { color: 'default', text: 'Expired', icon: <ClockCircleOutlined /> },
        };
        return (
          <Tag color={config[status].color} icon={config[status].icon}>
            {config[status].text}
          </Tag>
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Applied Date',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => {
        if (!date) return <Text type="secondary">-</Text>;
        const daysUntilExpiry = dayjs(date).diff(dayjs(), 'days');
        return (
          <div>
            <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>
            {daysUntilExpiry < 30 && daysUntilExpiry > 0 && (
              <div>
                <Text type="warning" style={{ fontSize: 12 }}>
                  Expires in {daysUntilExpiry} days
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => message.info(`Downloading ${record.exemptionCertificate}`)}
          >
            Certificate
          </Button>
          {record.status === 'pending' && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const approvedExemptions = exemptions.filter((e) => e.status === 'approved');
  const pendingExemptions = exemptions.filter((e) => e.status === 'pending');

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <FileProtectOutlined style={{ color: '#52c41a' }} /> Tax Exemption
          </Title>
          <Paragraph type="secondary">
            Apply for tax-exempt status on eligible purchases
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleApply}>
            Apply for Tax Exemption
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#f6ffed',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Approved Exemptions
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {approvedExemptions.length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#fff7e6',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Pending Review
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {pendingExemptions.length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: '#e6f7ff',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FileProtectOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Total Applications
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {exemptions.length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {approvedExemptions.length > 0 && (
        <Alert
          message="Tax Exemption Active"
          description={`You have ${approvedExemptions.length} approved tax exemption${approvedExemptions.length > 1 ? 's' : ''}. Tax will not be charged on eligible purchases in the approved state(s).`}
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="My Tax Exemptions">
        <Table columns={columns} dataSource={exemptions} rowKey="id" />
      </Card>

      <Modal
        title="Apply for Tax Exemption"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={700}
      >
        <Alert
          message="Eligibility Requirements"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Must be a registered non-profit, educational, or governmental organization</li>
              <li>Valid tax exemption certificate from your state</li>
              <li>Tax ID or EIN number</li>
              <li>Applications are reviewed within 2-3 business days</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Organization Type"
            name="organizationType"
            rules={[{ required: true, message: 'Please select organization type' }]}
          >
            <Select placeholder="Select organization type" size="large">
              <Option value="Non-Profit Organization">Non-Profit Organization (501(c)(3))</Option>
              <Option value="Educational Institution">Educational Institution</Option>
              <Option value="Government Agency">Government Agency</Option>
              <Option value="Religious Organization">Religious Organization</Option>
              <Option value="Hospital/Medical">Hospital/Medical Facility</Option>
              <Option value="Other">Other Tax-Exempt Entity</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Organization Name"
            name="organizationName"
            rules={[{ required: true, message: 'Please enter organization name' }]}
          >
            <Input size="large" placeholder="Enter official organization name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tax ID / EIN"
                name="taxId"
                rules={[
                  { required: true, message: 'Please enter tax ID' },
                  { pattern: /^\d{2}-\d{7}$/, message: 'Format: XX-XXXXXXX' },
                ]}
              >
                <Input size="large" placeholder="XX-XXXXXXX" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="State"
                name="state"
                rules={[{ required: true, message: 'Please select state' }]}
              >
                <Select placeholder="Select state" size="large" showSearch>
                  <Option value="California">California</Option>
                  <Option value="New York">New York</Option>
                  <Option value="Texas">Texas</Option>
                  <Option value="Florida">Florida</Option>
                  <Option value="Illinois">Illinois</Option>
                  <Option value="Pennsylvania">Pennsylvania</Option>
                  <Option value="Ohio">Ohio</Option>
                  <Option value="Georgia">Georgia</Option>
                  <Option value="North Carolina">North Carolina</Option>
                  <Option value="Michigan">Michigan</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Tax Exemption Certificate"
            required
            tooltip="Upload your state-issued tax exemption certificate (PDF, JPG, or PNG)"
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.jpg,.jpeg,.png"
            >
              <Button icon={<UploadOutlined />} size="large">
                Upload Certificate
              </Button>
            </Upload>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </Text>
          </Form.Item>

          <Form.Item label="Additional Notes" name="notes">
            <TextArea
              rows={3}
              placeholder="Add any additional information or special instructions"
            />
          </Form.Item>

          <Divider />

          <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              What happens next?
            </Text>
            <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>We review your application and verify the certificate (2-3 business days)</li>
              <li>You'll receive an email notification about the approval status</li>
              <li>Once approved, tax exemption applies automatically to eligible purchases</li>
              <li>You can manage your exemptions from this page</li>
            </ol>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" size="large" icon={<FileProtectOutlined />}>
                Submit Application
              </Button>
              <Button size="large" onClick={() => setIsModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TaxExemptionPage;
