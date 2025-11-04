import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tabs,
  Space,
  Button,
  Form,
  Select,
  InputNumber,
  Radio,
  message,
  Image,
  Alert,
  Collapse,
  Divider,
} from 'antd';
import {
  ColumnHeightOutlined,
  UserOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  RulerOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Option } = Select;

interface SizeChart {
  size: string;
  chest: string;
  waist: string;
  hips: string;
  inseam?: string;
  shoulders?: string;
  sleeve?: string;
}

interface ShoeSize {
  us: string;
  uk: string;
  eu: string;
  cm: string;
}

const mensSizeChart: SizeChart[] = [
  { size: 'XS', chest: '32-34"', waist: '26-28"', hips: '32-34"', shoulders: '16"', sleeve: '32"' },
  { size: 'S', chest: '35-37"', waist: '29-31"', hips: '35-37"', shoulders: '17"', sleeve: '33"' },
  { size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"', shoulders: '18"', sleeve: '34"' },
  { size: 'L', chest: '41-43"', waist: '35-37"', hips: '41-43"', shoulders: '19"', sleeve: '35"' },
  { size: 'XL', chest: '44-46"', waist: '38-40"', hips: '44-46"', shoulders: '20"', sleeve: '36"' },
  { size: '2XL', chest: '47-49"', waist: '41-43"', hips: '47-49"', shoulders: '21"', sleeve: '37"' },
  { size: '3XL', chest: '50-53"', waist: '44-47"', hips: '50-53"', shoulders: '22"', sleeve: '38"' },
];

const womensSizeChart: SizeChart[] = [
  { size: 'XS', chest: '31-32"', waist: '24-25"', hips: '33-34"', shoulders: '14"', sleeve: '30"' },
  { size: 'S', chest: '33-34"', waist: '26-27"', hips: '35-36"', shoulders: '15"', sleeve: '31"' },
  { size: 'M', chest: '35-36"', waist: '28-29"', hips: '37-38"', shoulders: '15.5"', sleeve: '31.5"' },
  { size: 'L', chest: '37-39"', waist: '30-32"', hips: '39-41"', shoulders: '16"', sleeve: '32"' },
  { size: 'XL', chest: '40-42"', waist: '33-35"', hips: '42-44"', shoulders: '16.5"', sleeve: '32.5"' },
  { size: '2XL', chest: '43-45"', waist: '36-38"', hips: '45-47"', shoulders: '17"', sleeve: '33"' },
  { size: '3XL', chest: '46-48"', waist: '39-42"', hips: '48-51"', shoulders: '17.5"', sleeve: '33.5"' },
];

const pantsSizeChart: SizeChart[] = [
  { size: '28', waist: '28"', hips: '36"', inseam: '30-32"', chest: '-' },
  { size: '30', waist: '30"', hips: '38"', inseam: '30-34"', chest: '-' },
  { size: '32', waist: '32"', hips: '40"', inseam: '30-34"', chest: '-' },
  { size: '34', waist: '34"', hips: '42"', inseam: '30-34"', chest: '-' },
  { size: '36', waist: '36"', hips: '44"', inseam: '30-34"', chest: '-' },
  { size: '38', waist: '38"', hips: '46"', inseam: '30-34"', chest: '-' },
  { size: '40', waist: '40"', hips: '48"', inseam: '30-34"', chest: '-' },
];

const shoeSizeChart: ShoeSize[] = [
  { us: '6', uk: '5.5', eu: '39', cm: '24' },
  { us: '6.5', uk: '6', eu: '39.5', cm: '24.5' },
  { us: '7', uk: '6.5', eu: '40', cm: '25' },
  { us: '7.5', uk: '7', eu: '40.5', cm: '25.5' },
  { us: '8', uk: '7.5', eu: '41', cm: '26' },
  { us: '8.5', uk: '8', eu: '42', cm: '26.5' },
  { us: '9', uk: '8.5', eu: '42.5', cm: '27' },
  { us: '9.5', uk: '9', eu: '43', cm: '27.5' },
  { us: '10', uk: '9.5', eu: '44', cm: '28' },
  { us: '10.5', uk: '10', eu: '44.5', cm: '28.5' },
  { us: '11', uk: '10.5', eu: '45', cm: '29' },
  { us: '11.5', uk: '11', eu: '45.5', cm: '29.5' },
  { us: '12', uk: '11.5', eu: '46', cm: '30' },
];

const SizeGuidePage: React.FC = () => {
  const [recommendedSize, setRecommendedSize] = useState<string>('');
  const [form] = Form.useForm();

  const handleFindSize = (values: any) => {
    const { gender, height, weight, chest, waist } = values;

    // Simple size recommendation logic
    let size = '';
    if (gender === 'male') {
      if (chest < 35) size = 'XS';
      else if (chest < 38) size = 'S';
      else if (chest < 41) size = 'M';
      else if (chest < 44) size = 'L';
      else if (chest < 47) size = 'XL';
      else if (chest < 50) size = '2XL';
      else size = '3XL';
    } else {
      if (chest < 33) size = 'XS';
      else if (chest < 35) size = 'S';
      else if (chest < 37) size = 'M';
      else if (chest < 40) size = 'L';
      else if (chest < 43) size = 'XL';
      else if (chest < 46) size = '2XL';
      else size = '3XL';
    }

    setRecommendedSize(size);
    message.success(`Based on your measurements, we recommend size: ${size}`);
  };

  const clothingColumns: ColumnsType<SizeChart> = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size, record) => (
        <Text strong style={{ color: size === recommendedSize ? '#52c41a' : undefined }}>
          {size}
          {size === recommendedSize && <CheckCircleOutlined style={{ marginLeft: 8, color: '#52c41a' }} />}
        </Text>
      ),
    },
    {
      title: 'Chest',
      dataIndex: 'chest',
      key: 'chest',
    },
    {
      title: 'Waist',
      dataIndex: 'waist',
      key: 'waist',
    },
    {
      title: 'Hips',
      dataIndex: 'hips',
      key: 'hips',
    },
    {
      title: 'Shoulders',
      dataIndex: 'shoulders',
      key: 'shoulders',
    },
    {
      title: 'Sleeve',
      dataIndex: 'sleeve',
      key: 'sleeve',
    },
  ];

  const pantsColumns: ColumnsType<SizeChart> = [
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      render: (size) => <Text strong>{size}</Text>,
    },
    {
      title: 'Waist',
      dataIndex: 'waist',
      key: 'waist',
    },
    {
      title: 'Hips',
      dataIndex: 'hips',
      key: 'hips',
    },
    {
      title: 'Inseam',
      dataIndex: 'inseam',
      key: 'inseam',
    },
  ];

  const shoeColumns: ColumnsType<ShoeSize> = [
    {
      title: 'US',
      dataIndex: 'us',
      key: 'us',
      render: (size) => <Text strong>{size}</Text>,
    },
    {
      title: 'UK',
      dataIndex: 'uk',
      key: 'uk',
    },
    {
      title: 'EU',
      dataIndex: 'eu',
      key: 'eu',
    },
    {
      title: 'CM',
      dataIndex: 'cm',
      key: 'cm',
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <RulerOutlined style={{ color: '#1890ff' }} /> Size Guide
        </Title>
        <Paragraph type="secondary">
          Find your perfect fit with our comprehensive size charts and measurement guide
        </Paragraph>
      </div>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Size Charts" style={{ marginBottom: 16 }}>
            <Tabs defaultActiveKey="mens">
              <TabPane tab="Men's Clothing" key="mens">
                <Table
                  columns={clothingColumns}
                  dataSource={mensSizeChart}
                  rowKey="size"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </TabPane>
              <TabPane tab="Women's Clothing" key="womens">
                <Table
                  columns={clothingColumns}
                  dataSource={womensSizeChart}
                  rowKey="size"
                  pagination={false}
                  scroll={{ x: 800 }}
                />
              </TabPane>
              <TabPane tab="Pants" key="pants">
                <Table
                  columns={pantsColumns}
                  dataSource={pantsSizeChart}
                  rowKey="size"
                  pagination={false}
                  scroll={{ x: 600 }}
                />
              </TabPane>
              <TabPane tab="Shoes" key="shoes">
                <Table
                  columns={shoeColumns}
                  dataSource={shoeSizeChart}
                  rowKey="us"
                  pagination={false}
                  scroll={{ x: 400 }}
                />
              </TabPane>
            </Tabs>
          </Card>

          <Card title="How to Measure" style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Image
                  src="https://via.placeholder.com/400x500?text=Measurement+Guide"
                  preview={false}
                  style={{ borderRadius: 8 }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Collapse defaultActiveKey={['1']} ghost>
                  <Panel header={<Text strong><RulerOutlined /> Chest</Text>} key="1">
                    <Paragraph>
                      Measure around the fullest part of your chest, keeping the tape measure horizontal. Make sure to keep the tape snug but not tight.
                    </Paragraph>
                  </Panel>
                  <Panel header={<Text strong><RulerOutlined /> Waist</Text>} key="2">
                    <Paragraph>
                      Measure around your natural waistline, keeping the tape comfortably loose. This is usually just above your belly button.
                    </Paragraph>
                  </Panel>
                  <Panel header={<Text strong><RulerOutlined /> Hips</Text>} key="3">
                    <Paragraph>
                      Stand with your feet together and measure around the fullest part of your hips and seat, keeping the tape parallel to the floor.
                    </Paragraph>
                  </Panel>
                  <Panel header={<Text strong><RulerOutlined /> Shoulders</Text>} key="4">
                    <Paragraph>
                      Measure from the edge of one shoulder to the edge of the other shoulder across your back, at the widest point.
                    </Paragraph>
                  </Panel>
                  <Panel header={<Text strong><RulerOutlined /> Sleeve</Text>} key="5">
                    <Paragraph>
                      With your arm slightly bent, measure from the center back of your neck, across your shoulder, and down to your wrist.
                    </Paragraph>
                  </Panel>
                  <Panel header={<Text strong><RulerOutlined /> Inseam</Text>} key="6">
                    <Paragraph>
                      Measure from the top of your inner thigh to the bottom of your ankle. It's best to measure a pair of pants that fit you well.
                    </Paragraph>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Card>

          <Card title="Fit Tips & FAQs">
            <Collapse>
              <Panel header="What if I'm between sizes?" key="1">
                <Paragraph>
                  If you're between sizes, we recommend sizing up for a more comfortable fit, especially if you prefer a looser style. For fitted styles, choose your smaller size.
                </Paragraph>
              </Panel>
              <Panel header="How accurate are the size recommendations?" key="2">
                <Paragraph>
                  Our size recommendations are based on standard measurements and customer feedback. However, fit can vary by brand and style. Always check the product-specific size chart if available.
                </Paragraph>
              </Panel>
              <Panel header="Can I return if the size doesn't fit?" key="3">
                <Paragraph>
                  Yes! We offer free returns and exchanges within 30 days of purchase. Items must be unworn and in original condition with tags attached.
                </Paragraph>
              </Panel>
              <Panel header="Do sizes vary by brand?" key="4">
                <Paragraph>
                  Yes, sizing can vary between brands and even within different product lines from the same brand. Always refer to the specific size chart for each product.
                </Paragraph>
              </Panel>
              <Panel header="How do I measure my shoe size?" key="5">
                <Paragraph>
                  Stand on a piece of paper and trace around your foot. Measure the longest distance from heel to toe in centimeters, then refer to our shoe size chart.
                </Paragraph>
              </Panel>
            </Collapse>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Find Your Size" style={{ position: 'sticky', top: 24 }}>
            {recommendedSize && (
              <Alert
                message={`Recommended Size: ${recommendedSize}`}
                type="success"
                icon={<CheckCircleOutlined />}
                style={{ marginBottom: 16 }}
                showIcon
              />
            )}

            <Form form={form} layout="vertical" onFinish={handleFindSize}>
              <Form.Item
                label="Gender"
                name="gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Radio.Group buttonStyle="solid">
                  <Radio.Button value="male">Male</Radio.Button>
                  <Radio.Button value="female">Female</Radio.Button>
                  <Radio.Button value="unisex">Unisex</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    label="Height (cm)"
                    name="height"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber min={120} max={220} style={{ width: '100%' }} placeholder="170" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Weight (kg)"
                    name="weight"
                    rules={[{ required: true, message: 'Required' }]}
                  >
                    <InputNumber min={30} max={200} style={{ width: '100%' }} placeholder="70" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Chest (inches)"
                name="chest"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={25} max={60} style={{ width: '100%' }} placeholder="38" />
              </Form.Item>

              <Form.Item
                label="Waist (inches)"
                name="waist"
                rules={[{ required: true, message: 'Required' }]}
              >
                <InputNumber min={20} max={55} style={{ width: '100%' }} placeholder="32" />
              </Form.Item>

              <Form.Item label="Hips (inches)" name="hips">
                <InputNumber min={25} max={60} style={{ width: '100%' }} placeholder="40" />
              </Form.Item>

              <Form.Item label="Preferred Fit" name="fit">
                <Select placeholder="Select fit preference">
                  <Option value="tight">Tight / Athletic</Option>
                  <Option value="regular">Regular / Standard</Option>
                  <Option value="loose">Loose / Relaxed</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<ColumnHeightOutlined />} block>
                  Find My Size
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InfoCircleOutlined style={{ color: '#1890ff' }} />
                  <Text strong style={{ fontSize: 13 }}>
                    Size Guide Tips
                  </Text>
                </div>
                <ul style={{ marginBottom: 0, paddingLeft: 20, fontSize: 12 }}>
                  <li>Measure yourself in your underwear</li>
                  <li>Use a soft measuring tape</li>
                  <li>Ask someone to help for accuracy</li>
                  <li>Measure twice to confirm</li>
                  <li>Check product-specific charts</li>
                </ul>
              </Space>
            </div>

            <Divider />

            <div style={{ textAlign: 'center' }}>
              <ShoppingOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 8 }} />
              <Title level={5}>Still not sure?</Title>
              <Paragraph type="secondary" style={{ fontSize: 12 }}>
                Contact our customer service team for personalized sizing assistance
              </Paragraph>
              <Button type="link">Chat with us</Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SizeGuidePage;
