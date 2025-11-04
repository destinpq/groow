import React, { useState } from 'react';
import {
  Card,
  Steps,
  Form,
  Input,
  Button,
  Upload,
  message,
  Row,
  Col,
  Select,
  Alert,
  Typography,
  Space,
  Tag,
  Descriptions,
} from 'antd';
import {
  UploadOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  IdcardOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const VendorKYCPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [businessDocsFiles, setBusinessDocsFiles] = useState<UploadFile[]>([]);
  const [identityFiles, setIdentityFiles] = useState<UploadFile[]>([]);
  const [taxFiles, setTaxFiles] = useState<UploadFile[]>([]);
  const [bankFiles, setBankFiles] = useState<UploadFile[]>([]);

  // Mock verification status
  const verificationStatus = {
    status: 'pending', // 'pending' | 'approved' | 'rejected' | 'resubmit'
    submittedDate: '2024-11-01',
    reviewedDate: null,
    rejectionReason: null,
    documents: {
      business: { status: 'approved', comment: 'Documents verified' },
      identity: { status: 'pending', comment: 'Under review' },
      tax: { status: 'pending', comment: 'Under review' },
      bank: { status: 'rejected', comment: 'Bank statement is not clear. Please reupload.' },
    },
  };

  const handleNext = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    });
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (values: any) => {
    console.log('KYC Data:', values);
    console.log('Files:', {
      businessDocs: businessDocsFiles,
      identity: identityFiles,
      tax: taxFiles,
      bank: bankFiles,
    });
    message.success('KYC documents submitted successfully! We will review within 2-3 business days.');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 24 }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14', fontSize: 24 }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: 24 }} />;
      default:
        return null;
    }
  };

  const getStatusTag = (status: string) => {
    const colors = {
      approved: 'success',
      pending: 'warning',
      rejected: 'error',
      resubmit: 'orange',
    };
    return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Title level={2}>KYC Verification</Title>
      <Paragraph type="secondary">
        Complete your KYC verification to start selling on our platform. All information is secure and confidential.
      </Paragraph>

      {/* Verification Status */}
      {verificationStatus.submittedDate && (
        <Alert
          message={
            <Space>
              <span>KYC Status:</span>
              {getStatusTag(verificationStatus.status)}
            </Space>
          }
          description={
            <div>
              <p>Submitted on: {new Date(verificationStatus.submittedDate).toLocaleDateString()}</p>
              {verificationStatus.status === 'pending' && (
                <p>Your documents are under review. We'll notify you once the review is complete.</p>
              )}
              {verificationStatus.status === 'approved' && (
                <p>Your KYC verification is approved! You can now start selling.</p>
              )}
              {verificationStatus.status === 'rejected' && (
                <p>Some documents were rejected. Please review and resubmit.</p>
              )}
            </div>
          }
          type={verificationStatus.status === 'approved' ? 'success' : verificationStatus.status === 'rejected' ? 'error' : 'warning'}
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Document Status Cards */}
      {verificationStatus.submittedDate && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {getStatusIcon(verificationStatus.documents.business.status)}
                <Text strong>Business Documents</Text>
                {getStatusTag(verificationStatus.documents.business.status)}
                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                  {verificationStatus.documents.business.comment}
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {getStatusIcon(verificationStatus.documents.identity.status)}
                <Text strong>Identity Proof</Text>
                {getStatusTag(verificationStatus.documents.identity.status)}
                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                  {verificationStatus.documents.identity.comment}
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {getStatusIcon(verificationStatus.documents.tax.status)}
                <Text strong>Tax Documents</Text>
                {getStatusTag(verificationStatus.documents.tax.status)}
                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                  {verificationStatus.documents.tax.comment}
                </Text>
              </Space>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Space direction="vertical" align="center" style={{ width: '100%' }}>
                {getStatusIcon(verificationStatus.documents.bank.status)}
                <Text strong>Bank Details</Text>
                {getStatusTag(verificationStatus.documents.bank.status)}
                <Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
                  {verificationStatus.documents.bank.comment}
                </Text>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* KYC Form */}
      <Card>
        <Steps current={currentStep} style={{ marginBottom: 32 }}>
          <Steps.Step title="Business Info" icon={<FileTextOutlined />} />
          <Steps.Step title="Identity Proof" icon={<IdcardOutlined />} />
          <Steps.Step title="Tax Documents" icon={<FileTextOutlined />} />
          <Steps.Step title="Bank Details" icon={<BankOutlined />} />
        </Steps>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* Step 1: Business Information */}
          {currentStep === 0 && (
            <div>
              <Title level={4}>Business Information</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="businessName"
                    label="Business Name"
                    rules={[{ required: true, message: 'Please enter business name' }]}
                  >
                    <Input placeholder="ABC Corporation" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="businessType"
                    label="Business Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select business type">
                      <Option value="sole">Sole Proprietorship</Option>
                      <Option value="partnership">Partnership</Option>
                      <Option value="llc">LLC</Option>
                      <Option value="corporation">Corporation</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="registrationNumber"
                    label="Business Registration Number"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="REG-123456789" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="incorporationDate"
                    label="Date of Incorporation"
                    rules={[{ required: true }]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="businessAddress"
                label="Business Address"
                rules={[{ required: true }]}
              >
                <TextArea rows={3} placeholder="123 Business Street, City, State, ZIP" />
              </Form.Item>

              <Form.Item
                label="Business Registration Documents"
                extra="Upload business license, incorporation certificate, or registration proof"
              >
                <Upload
                  fileList={businessDocsFiles}
                  onChange={({ fileList }) => setBusinessDocsFiles(fileList)}
                  beforeUpload={() => false}
                  maxCount={5}
                >
                  <Button icon={<UploadOutlined />}>Upload Documents (PDF, JPG, PNG)</Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          {/* Step 2: Identity Proof */}
          {currentStep === 1 && (
            <div>
              <Title level={4}>Identity Verification</Title>
              <Alert
                message="Upload any government-issued ID proof"
                description="Passport, Driver's License, National ID Card, or Voter ID"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="idType"
                    label="ID Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select ID type">
                      <Option value="passport">Passport</Option>
                      <Option value="drivers_license">Driver's License</Option>
                      <Option value="national_id">National ID Card</Option>
                      <Option value="voter_id">Voter ID</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="idNumber"
                    label="ID Number"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Enter ID number" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name (as per ID)"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="John Doe" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true }]}
                  >
                    <Input type="date" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Identity Document"
                extra="Upload clear scans/photos of both front and back"
              >
                <Upload
                  fileList={identityFiles}
                  onChange={({ fileList }) => setIdentityFiles(fileList)}
                  beforeUpload={() => false}
                  maxCount={3}
                  listType="picture-card"
                >
                  {identityFiles.length < 3 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>
          )}

          {/* Step 3: Tax Documents */}
          {currentStep === 2 && (
            <div>
              <Title level={4}>Tax Information</Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="taxId"
                    label="Tax ID / EIN"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="XX-XXXXXXX" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="gstNumber"
                    label="GST/VAT Number (if applicable)"
                  >
                    <Input placeholder="GST123456789" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="taxStatus"
                label="Tax Status"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select tax status">
                  <Option value="registered">Registered for Tax</Option>
                  <Option value="exempt">Tax Exempt</Option>
                  <Option value="pending">Registration Pending</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Tax Documents"
                extra="Upload tax registration certificate, GST certificate, or tax returns"
              >
                <Upload
                  fileList={taxFiles}
                  onChange={({ fileList }) => setTaxFiles(fileList)}
                  beforeUpload={() => false}
                  maxCount={5}
                >
                  <Button icon={<UploadOutlined />}>Upload Tax Documents</Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 3 && (
            <div>
              <Title level={4}>Bank Account Information</Title>
              <Alert
                message="Payment Settlement Account"
                description="This account will be used to receive payments for your sales"
                type="info"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="accountHolderName"
                    label="Account Holder Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="ABC Corporation" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="accountNumber"
                    label="Account Number"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="1234567890" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="bankName"
                    label="Bank Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Bank of America" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="routingNumber"
                    label="Routing Number / IFSC Code"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="XXXXXXXXX" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="accountType"
                    label="Account Type"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select account type">
                      <Option value="checking">Checking</Option>
                      <Option value="savings">Savings</Option>
                      <Option value="business">Business</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="swift"
                    label="SWIFT / BIC Code (for international)"
                  >
                    <Input placeholder="BOFAUS3N" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Bank Documents"
                extra="Upload cancelled cheque, bank statement (last 3 months), or bank letter"
              >
                <Upload
                  fileList={bankFiles}
                  onChange={({ fileList }) => setBankFiles(fileList)}
                  beforeUpload={() => false}
                  maxCount={3}
                >
                  <Button icon={<UploadOutlined />}>Upload Bank Documents</Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          {/* Navigation Buttons */}
          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handlePrev}>Previous</Button>
              )}
              {currentStep < 3 && (
                <Button type="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === 3 && (
                <Button type="primary" htmlType="submit">
                  Submit for Verification
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default VendorKYCPage;
