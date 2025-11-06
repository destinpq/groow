import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Radio,
  Select,
  InputNumber,
  Upload,
  Input,
  Divider,
  Alert,
  message,
  Image,
  Tag,
  Collapse,
  ColorPicker,
  Slider,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import {
  ShoppingCartOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
  EditOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface CustomizationOption {
  id: string;
  type: 'color' | 'size' | 'text' | 'image' | 'material' | 'feature' | 'number';
  label: string;
  required: boolean;
  options?: { value: string; label: string; price: number; image?: string }[];
  min?: number;
  max?: number;
  maxLength?: number;
  defaultValue?: any;
  helpText?: string;
  preview?: boolean;
}

interface Product {
  id: number;
  name: string;
  basePrice: number;
  image: string;
  category: string;
  customizationOptions: CustomizationOption[];
}

const mockProduct: Product = {
  id: 1,
  name: 'Custom T-Shirt',
  basePrice: 29.99,
  image: 'https://via.placeholder.com/400?text=T-Shirt',
  category: 'Apparel',
  customizationOptions: [
    {
      id: 'size',
      type: 'size',
      label: 'Size',
      required: true,
      options: [
        { value: 'xs', label: 'XS', price: 0 },
        { value: 's', label: 'S', price: 0 },
        { value: 'm', label: 'M', price: 0 },
        { value: 'l', label: 'L', price: 0 },
        { value: 'xl', label: 'XL', price: 2 },
        { value: '2xl', label: '2XL', price: 4 },
        { value: '3xl', label: '3XL', price: 6 },
      ],
      defaultValue: 'm',
      helpText: 'Select your preferred size',
    },
    {
      id: 'color',
      type: 'color',
      label: 'Base Color',
      required: true,
      options: [
        { value: '#000000', label: 'Black', price: 0 },
        { value: '#FFFFFF', label: 'White', price: 0 },
        { value: '#1890ff', label: 'Blue', price: 0 },
        { value: '#52c41a', label: 'Green', price: 0 },
        { value: '#f5222d', label: 'Red', price: 0 },
        { value: '#fa8c16', label: 'Orange', price: 0 },
      ],
      defaultValue: '#000000',
    },
    {
      id: 'material',
      type: 'material',
      label: 'Material',
      required: true,
      options: [
        { value: 'cotton', label: '100% Cotton', price: 0 },
        { value: 'polyester', label: 'Polyester Blend', price: 2 },
        { value: 'organic', label: 'Organic Cotton', price: 5 },
        { value: 'premium', label: 'Premium Fabric', price: 10 },
      ],
      defaultValue: 'cotton',
      helpText: 'Choose your preferred material',
    },
    {
      id: 'frontText',
      type: 'text',
      label: 'Front Text',
      required: false,
      maxLength: 50,
      helpText: 'Add custom text on the front (max 50 characters)',
      preview: true,
    },
    {
      id: 'backText',
      type: 'text',
      label: 'Back Text',
      required: false,
      maxLength: 50,
      helpText: 'Add custom text on the back (max 50 characters)',
      preview: true,
    },
    {
      id: 'logo',
      type: 'image',
      label: 'Upload Logo',
      required: false,
      helpText: 'Upload your logo/design (PNG, JPG, max 5MB)',
    },
    {
      id: 'quantity',
      type: 'number',
      label: 'Quantity',
      required: true,
      min: 1,
      max: 100,
      defaultValue: 1,
      helpText: 'Bulk orders (10+) get 15% discount',
    },
    {
      id: 'features',
      type: 'feature',
      label: 'Additional Features',
      required: false,
      options: [
        { value: 'pocket', label: 'Chest Pocket', price: 3 },
        { value: 'hood', label: 'Add Hood', price: 8 },
        { value: 'zipper', label: 'Front Zipper', price: 5 },
        { value: 'embroidery', label: 'Premium Embroidery', price: 12 },
      ],
    },
  ],
};

const ProductCustomizationPage: React.FC = () => {
  const [product] = useState<Product>(mockProduct);
  const [customization, setCustomization] = useState<Record<string, any>>({
    size: 'm',
    color: '#000000',
    material: 'cotton',
    quantity: 1,
    frontText: '',
    backText: '',
    features: [],
  });
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleOptionChange = (optionId: string, value: any) => {
    setCustomization({ ...customization, [optionId]: value });
  };

  const calculateTotalPrice = (): number => {
    let total = product.basePrice;

    product.customizationOptions.forEach((option) => {
      const value = customization[option.id];

      if (option.type === 'size' || option.type === 'color' || option.type === 'material') {
        const selectedOption = option.options?.find((o) => o.value === value);
        if (selectedOption) {
          total += selectedOption.price;
        }
      }

      if (option.type === 'text' && value && value.length > 0) {
        total += 5; // $5 for custom text
      }

      if (option.type === 'image' && fileList.length > 0) {
        total += 10; // $10 for custom logo
      }

      if (option.type === 'feature' && Array.isArray(value)) {
        value.forEach((featureValue: string) => {
          const feature = option.options?.find((o) => o.value === featureValue);
          if (feature) {
            total += feature.price;
          }
        });
      }
    });

    const quantity = customization.quantity || 1;
    total *= quantity;

    // Bulk discount
    if (quantity >= 10) {
      total *= 0.85; // 15% discount
    }

    return total;
  };

  const handleAddToCart = () => {
    // Validate required fields
    const missingFields: string[] = [];
    product.customizationOptions.forEach((option) => {
      if (option.required && !customization[option.id]) {
        missingFields.push(option.label);
      }
    });

    if (missingFields.length > 0) {
      message.error(`Please fill required fields: ${missingFields.join(', ')}`);
      return;
    }

    message.success('Custom product added to cart!');
  };

  const renderOption = (option: CustomizationOption) => {
    switch (option.type) {
      case 'size':
        return (
          <Radio.Group
            value={customization[option.id]}
            onChange={(e) => handleOptionChange(option.id, e.target.value)}
            size="large"
          >
            <Space wrap>
              {option.options?.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                  {opt.price > 0 && <Text type="secondary"> (+${opt.price})</Text>}
                </Radio.Button>
              ))}
            </Space>
          </Radio.Group>
        );

      case 'color':
        return (
          <Space wrap size="middle">
            {option.options?.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleOptionChange(option.id, opt.value)}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: opt.value,
                  border:
                    customization[option.id] === opt.value
                      ? '3px solid #1890ff'
                      : '2px solid #d9d9d9',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s',
                }}
              >
                {customization[option.id] === opt.value && (
                  <CheckCircleOutlined
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 20,
                      color: opt.value === '#000000' ? '#fff' : '#000',
                    }}
                  />
                )}
              </div>
            ))}
          </Space>
        );

      case 'material':
        return (
          <Select
            value={customization[option.id]}
            onChange={(value) => handleOptionChange(option.id, value)}
            style={{ width: '100%' }}
            size="large"
          >
            {option.options?.map((opt) => (
              <Select.Option key={opt.value} value={opt.value}>
                {opt.label}
                {opt.price > 0 && <Text type="secondary"> (+${opt.price})</Text>}
              </Select.Option>
            ))}
          </Select>
        );

      case 'text':
        return (
          <div>
            <Input
              value={customization[option.id]}
              onChange={(e) => handleOptionChange(option.id, e.target.value)}
              maxLength={option.maxLength}
              placeholder={`Enter ${option.label.toLowerCase()}`}
              size="large"
              suffix={
                <Text type="secondary">
                  {customization[option.id]?.length || 0}/{option.maxLength}
                </Text>
              }
            />
            {customization[option.id] && customization[option.id].length > 0 && (
              <Alert
                message="Text customization adds $5 to the price"
                type="info"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        );

      case 'image':
        return (
          <div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
            >
              {fileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {fileList.length > 0 && (
              <Alert
                message="Logo upload adds $10 to the price"
                type="info"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        );

      case 'number':
        return (
          <div>
            <InputNumber
              value={customization[option.id]}
              onChange={(value) => handleOptionChange(option.id, value)}
              min={option.min}
              max={option.max}
              size="large"
              style={{ width: 200 }}
            />
            {customization[option.id] >= 10 && (
              <Alert
                message="🎉 Bulk discount applied! 15% off for 10+ items"
                type="success"
                showIcon
                style={{ marginTop: 8 }}
              />
            )}
          </div>
        );

      case 'feature':
        return (
          <div>
            <Select
              mode="multiple"
              value={customization[option.id] || []}
              onChange={(value) => handleOptionChange(option.id, value)}
              style={{ width: '100%' }}
              size="large"
              placeholder="Select additional features"
            >
              {option.options?.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label} (+${opt.price})
                </Select.Option>
              ))}
            </Select>
          </div>
        );

      default:
        return null;
    }
  };

  const totalPrice = calculateTotalPrice();
  const quantity = customization.quantity || 1;
  const bulkDiscount = quantity >= 10 ? totalPrice * 0.15 : 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3}>
        <EditOutlined style={{ color: '#1890ff' }} /> Customize Your Product
      </Title>
      <Paragraph type="secondary">
        Personalize your product with custom options and see the preview in real-time
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Product Details" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Image src={product.image} alt={product.name} preview={false} />
              </Col>
              <Col span={16}>
                <Title level={4}>{product.name}</Title>
                <Paragraph type="secondary">{product.category}</Paragraph>
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Base Price:</Text>
                  <div>
                    <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                      ${product.basePrice}
                    </Text>
                  </div>
                </div>
                <Tag color="blue" style={{ marginTop: 8 }}>
                  Fully Customizable
                </Tag>
                <Tag color="green">Fast Production</Tag>
              </Col>
            </Row>
          </Card>

          <Card title="Customization Options">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {product.customizationOptions.map((option) => (
                <div key={option.id}>
                  <div style={{ marginBottom: 12 }}>
                    <Text strong>
                      {option.label}
                      {option.required && <Text type="danger"> *</Text>}
                    </Text>
                    {option.helpText && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          <InfoCircleOutlined /> {option.helpText}
                        </Text>
                      </div>
                    )}
                  </div>
                  {renderOption(option)}
                  <Divider style={{ margin: '16px 0' }} />
                </div>
              ))}
            </Space>
          </Card>

          <Card title="Special Instructions" style={{ marginTop: 16 }}>
            <TextArea
              rows={4}
              placeholder="Add any special instructions or requests for your custom product..."
              maxLength={500}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
              Our team will review your instructions and contact you if needed
            </Text>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Preview" style={{ marginBottom: 16, position: 'sticky', top: 24 }}>
            <div
              style={{
                width: '100%',
                height: 400,
                backgroundColor: customization.color || '#000',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: 24,
              }}
            >
              {fileList.length > 0 && fileList[0].thumbUrl && (
                <img
                  src={fileList[0].thumbUrl}
                  alt="Logo"
                  style={{
                    maxWidth: 120,
                    maxHeight: 120,
                    objectFit: 'contain',
                  }}
                />
              )}
              {customization.frontText && (
                <Text
                  strong
                  style={{
                    fontSize: 24,
                    color: customization.color === '#FFFFFF' ? '#000' : '#fff',
                    textAlign: 'center',
                  }}
                >
                  {customization.frontText}
                </Text>
              )}
              {!customization.frontText && !fileList.length && (
                <Text type="secondary" style={{ color: '#999' }}>
                  Your design will appear here
                </Text>
              )}
            </div>
            <Alert
              message="This is a preview of your customization"
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </Card>

          <Card title="Order Summary">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Base Price:</Text>
                <Text>${product.basePrice}</Text>
              </div>

              {Object.entries(customization).map(([key, value]) => {
                const option = product.customizationOptions.find((o) => o.id === key);
                if (!option) return null;

                if (option.type === 'size' || option.type === 'color' || option.type === 'material') {
                  const selectedOption = option.options?.find((o) => o.value === value);
                  if (selectedOption && selectedOption.price > 0) {
                    return (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text>
                          {option.label}: {selectedOption.label}
                        </Text>
                        <Text>+${selectedOption.price}</Text>
                      </div>
                    );
                  }
                }

                if (option.type === 'text' && value && value.length > 0) {
                  return (
                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text>Custom Text: {option.label}</Text>
                      <Text>+$5</Text>
                    </div>
                  );
                }

                if (option.type === 'feature' && Array.isArray(value) && value.length > 0) {
                  return value.map((featureValue: string) => {
                    const feature = option.options?.find((o) => o.value === featureValue);
                    if (feature) {
                      return (
                        <div
                          key={`${key}-${featureValue}`}
                          style={{ display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Text>{feature.label}</Text>
                          <Text>+${feature.price}</Text>
                        </div>
                      );
                    }
                    return null;
                  });
                }

                return null;
              })}

              {fileList.length > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Logo Upload</Text>
                  <Text>+$10</Text>
                </div>
              )}

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Quantity:</Text>
                <Text>{quantity}</Text>
              </div>

              {bulkDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text type="success">Bulk Discount (15%):</Text>
                  <Text type="success">-${bulkDiscount.toFixed(2)}</Text>
                </div>
              )}

              <Divider style={{ margin: '8px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 18 }}>
                  Total:
                </Text>
                <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </div>

              <Alert
                message="Production Time"
                description="Your custom product will be ready in 3-5 business days"
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
              />

              <Button
                type="primary"
                size="large"
                block
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>

              <Button size="large" block>
                Save Design
              </Button>
            </Space>
          </Card>

          <Card title="Why Customize?" style={{ marginTop: 16 }}>
            <Collapse ghost>
              <Panel header="🎨 Unique Design" key="1">
                Create something truly unique that reflects your style and personality
              </Panel>
              <Panel header="🏆 Premium Quality" key="2">
                All custom products are made with high-quality materials and professional printing
              </Panel>
              <Panel header="🚀 Fast Turnaround" key="3">
                We produce and ship custom orders within 3-5 business days
              </Panel>
              <Panel header="💯 Satisfaction Guarantee" key="4">
                If you're not happy with your custom product, we'll make it right
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProductCustomizationPage;
