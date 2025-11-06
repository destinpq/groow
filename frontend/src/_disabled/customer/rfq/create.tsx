import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Upload,
  Button,
  Space,
  Typography,
  Steps,
  Row,
  Col,
  Tag,
  Divider,
  message,
  Alert,
} from 'antd';
import {
  FileTextOutlined,
  UploadOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const RFQCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electronics',
    'Fashion & Apparel',
    'Home & Garden',
    'Industrial Equipment',
    'Office Supplies',
    'Automotive',
    'Food & Beverage',
    'Healthcare',
    'Sports & Fitness',
    'Other',
  ];

  const handleNext = async () => {
    try {
      await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log('RFQ Data:', { ...values, attachments: fileList });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      message.success('RFQ submitted successfully!');
      setCurrentStep(3);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      message.error('Failed to submit RFQ');
      console.error('Submit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    fileList,
    onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => setFileList(newFileList),
    beforeUpload: () => false,
    multiple: true,
  };

  const steps = [
    {
      title: 'Basic Info',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Requirements',
      icon: <FileTextOutlined />,
    },
    {
      title: 'Review',
      icon: <CheckCircleOutlined />,
    },
    {
      title: 'Complete',
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Title level={3}>Create Request for Quotation (RFQ)</Title>
        <Paragraph type="secondary">
          Submit your requirements and get competitive quotes from multiple vendors
        </Paragraph>

        <Steps current={currentStep} items={steps} style={{ marginBottom: 32 }} />

        <Form form={form} layout="vertical">
          {/* Step 1: Basic Information */}
          {currentStep === 0 && (
            <div>
              <Title level={4}>Basic Information</Title>
              <Divider />

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="title"
                    label="RFQ Title"
                    rules={[{ required: true, message: 'Please enter RFQ title' }]}
                  >
                    <Input
                      placeholder="e.g., Office Furniture for 50-Person Office"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                  >
                    <Select placeholder="Select category" size="large">
                      {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Brief Description"
                rules={[
                  { required: true, message: 'Please enter a description' },
                  { min: 50, message: 'Description must be at least 50 characters' },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Provide a brief description of what you're looking for..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="quantity"
                    label="Quantity Required"
                    rules={[{ required: true, message: 'Please enter quantity' }]}
                  >
                    <InputNumber
                      min={1}
                      placeholder="Enter quantity"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="unit"
                    label="Unit of Measurement"
                    initialValue="pieces"
                  >
                    <Select size="large">
                      <Option value="pieces">Pieces</Option>
                      <Option value="units">Units</Option>
                      <Option value="kg">Kilograms</Option>
                      <Option value="liters">Liters</Option>
                      <Option value="meters">Meters</Option>
                      <Option value="sets">Sets</Option>
                      <Option value="boxes">Boxes</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    name="budget"
                    label="Budget Range (Optional)"
                  >
                    <InputNumber
                      prefix="$"
                      placeholder="Maximum budget"
                      style={{ width: '100%' }}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="deliveryDate"
                    label="Required Delivery Date"
                    rules={[{ required: true, message: 'Please select delivery date' }]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Select date"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="deliveryLocation"
                    label="Delivery Location"
                    rules={[{ required: true, message: 'Please enter delivery location' }]}
                  >
                    <Input placeholder="City, State, Country" size="large" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {/* Step 2: Detailed Requirements */}
          {currentStep === 1 && (
            <div>
              <Title level={4}>Detailed Requirements</Title>
              <Divider />

              <Form.Item
                name="specifications"
                label="Technical Specifications"
                rules={[{ required: true, message: 'Please enter specifications' }]}
              >
                <TextArea
                  rows={6}
                  placeholder="Provide detailed technical specifications, quality standards, certifications required, etc."
                  showCount
                  maxLength={2000}
                />
              </Form.Item>

              <Form.Item
                name="additionalRequirements"
                label="Additional Requirements (Optional)"
              >
                <TextArea
                  rows={4}
                  placeholder="Any special requirements, customization needs, packaging preferences, etc."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <Form.Item
                name="attachments"
                label="Upload Documents/Images"
              >
                <Upload.Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag files to upload</p>
                  <p className="ant-upload-hint">
                    Support for images, PDFs, and documents. Max 10MB per file.
                  </p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item
                name="paymentTerms"
                label="Preferred Payment Terms"
                initialValue="net30"
              >
                <Select size="large">
                  <Option value="advance">100% Advance</Option>
                  <Option value="50-50">50% Advance, 50% on Delivery</Option>
                  <Option value="net30">Net 30 Days</Option>
                  <Option value="net60">Net 60 Days</Option>
                  <Option value="negotiable">Negotiable</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="sampleRequired"
                label="Sample Required?"
                initialValue="no"
              >
                <Select size="large">
                  <Option value="yes">Yes, before bulk order</Option>
                  <Option value="no">No, not required</Option>
                  <Option value="maybe">Maybe, depends on vendor</Option>
                </Select>
              </Form.Item>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 2 && (
            <div>
              <Title level={4}>Review Your RFQ</Title>
              <Divider />

              <Alert
                message="Review Carefully"
                description="Please review all information before submitting. You can edit this RFQ after submission if needed."
                type="info"
                showIcon
                style={{ marginBottom: 24 }}
              />

              <Card>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <div>
                    <Text type="secondary">RFQ Title:</Text>
                    <br />
                    <Text strong style={{ fontSize: 16 }}>
                      {form.getFieldValue('title')}
                    </Text>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">Category:</Text>
                      <br />
                      <Tag color="blue">{form.getFieldValue('category')}</Tag>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Quantity:</Text>
                      <br />
                      <Text strong>
                        {form.getFieldValue('quantity')} {form.getFieldValue('unit')}
                      </Text>
                    </Col>
                  </Row>

                  <Divider style={{ margin: '12px 0' }} />

                  <div>
                    <Text type="secondary">Description:</Text>
                    <br />
                    <Paragraph>{form.getFieldValue('description')}</Paragraph>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Row gutter={16}>
                    <Col span={12}>
                      <Text type="secondary">Delivery Date:</Text>
                      <br />
                      <Text strong>
                        {form.getFieldValue('deliveryDate')?.format('MMM DD, YYYY')}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">Delivery Location:</Text>
                      <br />
                      <Text strong>{form.getFieldValue('deliveryLocation')}</Text>
                    </Col>
                  </Row>

                  {form.getFieldValue('budget') && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <div>
                        <Text type="secondary">Budget:</Text>
                        <br />
                        <Text strong>${form.getFieldValue('budget')}</Text>
                      </div>
                    </>
                  )}

                  <Divider style={{ margin: '12px 0' }} />

                  <div>
                    <Text type="secondary">Technical Specifications:</Text>
                    <br />
                    <Paragraph>{form.getFieldValue('specifications')}</Paragraph>
                  </div>

                  {fileList.length > 0 && (
                    <>
                      <Divider style={{ margin: '12px 0' }} />
                      <div>
                        <Text type="secondary">Attachments:</Text>
                        <br />
                        <Space wrap>
                          {fileList.map((file, idx) => (
                            <Tag key={idx}>{file.name}</Tag>
                          ))}
                        </Space>
                      </div>
                    </>
                  )}
                </Space>
              </Card>
            </div>
          )}

          {/* Step 4: Success */}
          {currentStep === 3 && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />
              <Title level={3} style={{ marginTop: 24 }}>
                RFQ Submitted Successfully!
              </Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Your request has been sent to relevant vendors. You will start receiving quotes soon.
              </Paragraph>

              <Card style={{ marginTop: 32, textAlign: 'left' }}>
                <Title level={5}>What happens next?</Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#1890ff' }} />
                    <Text>Vendors will review your request within 24-48 hours</Text>
                  </Space>
                  <Space>
                    <FileTextOutlined style={{ color: '#52c41a' }} />
                    <Text>You'll receive quotations directly in your dashboard</Text>
                  </Space>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#faad14' }} />
                    <Text>Compare quotes and select the best vendor</Text>
                  </Space>
                </Space>
              </Card>

              <Space size="middle" style={{ marginTop: 32 }}>
                <Button type="primary" size="large" onClick={() => {
                  setCurrentStep(0);
                  form.resetFields();
                }}>
                  Create Another RFQ
                </Button>
                <Button size="large">View My RFQs</Button>
              </Space>
            </div>
          )}
        </Form>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <div style={{ marginTop: 32, textAlign: 'right' }}>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handlePrevious} size="large">
                  Previous
                </Button>
              )}
              {currentStep < 2 && (
                <Button type="primary" onClick={handleNext} size="large">
                  Next
                </Button>
              )}
              {currentStep === 2 && (
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                  size="large"
                >
                  Submit RFQ
                </Button>
              )}
            </Space>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RFQCreatePage;
