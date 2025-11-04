import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Statistic,
  Space,
  Tabs,
  Progress,
  Alert,
  Select,
  List,
  message,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  GlobalOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface SEOPage {
  id: number;
  url: string;
  title: string;
  description: string;
  keywords: string[];
  score: number;
  status: 'good' | 'warning' | 'error';
  issues: string[];
}

interface SitemapEntry {
  url: string;
  priority: number;
  changeFreq: string;
  lastMod: string;
}

const mockPages: SEOPage[] = [
  {
    id: 1,
    url: '/products/electronics',
    title: 'Electronics - Best Deals on Gadgets & Devices',
    description: 'Shop the latest electronics at unbeatable prices. Free shipping on orders over $50.',
    keywords: ['electronics', 'gadgets', 'devices', 'tech'],
    score: 95,
    status: 'good',
    issues: [],
  },
  {
    id: 2,
    url: '/products/fashion',
    title: 'Fashion',
    description: 'Fashion items',
    keywords: ['fashion'],
    score: 45,
    status: 'error',
    issues: [
      'Title too short (min 50 characters)',
      'Description too short (min 150 characters)',
      'Missing meta keywords',
    ],
  },
  {
    id: 3,
    url: '/products/home-garden',
    title: 'Home & Garden - Transform Your Living Space',
    description: 'Discover premium home and garden products. Quality furniture, decor, and outdoor essentials.',
    keywords: ['home', 'garden', 'furniture', 'decor'],
    score: 78,
    status: 'warning',
    issues: ['Description could be longer', 'Add more keywords'],
  },
];

const sitemapEntries: SitemapEntry[] = [
  { url: '/', priority: 1.0, changeFreq: 'daily', lastMod: '2024-01-15' },
  { url: '/products', priority: 0.9, changeFreq: 'daily', lastMod: '2024-01-15' },
  { url: '/products/electronics', priority: 0.8, changeFreq: 'weekly', lastMod: '2024-01-14' },
  { url: '/products/fashion', priority: 0.8, changeFreq: 'weekly', lastMod: '2024-01-14' },
  { url: '/about', priority: 0.5, changeFreq: 'monthly', lastMod: '2024-01-10' },
];

const SEOOptimizationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [selectedPage, setSelectedPage] = useState<SEOPage | null>(null);

  const handleGenerateSitemap = () => {
    message.success('Sitemap generated successfully!');
  };

  const handleSubmitRobots = () => {
    message.success('Robots.txt updated successfully!');
  };

  const handleAnalyzePage = (page: SEOPage) => {
    setSelectedPage(page);
    message.info(`Analyzing ${page.url}`);
  };

  const columns: ColumnsType<SEOPage> = [
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        <Space>
          <LinkOutlined />
          <Text code>{url}</Text>
        </Space>
      ),
    },
    {
      title: 'SEO Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, record) => (
        <div>
          <Progress
            percent={score}
            size="small"
            status={record.status === 'error' ? 'exception' : 'normal'}
          />
        </div>
      ),
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SEOPage['status']) => {
        const config: Record<SEOPage['status'], { color: string; icon: React.ReactNode; text: string }> = {
          good: { color: 'green', icon: <CheckCircleOutlined />, text: 'Good' },
          warning: { color: 'orange', icon: <WarningOutlined />, text: 'Needs Work' },
          error: { color: 'red', icon: <CloseCircleOutlined />, text: 'Critical' },
        };
        const { color, icon, text } = config[status];
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'Good', value: 'good' },
        { text: 'Warning', value: 'warning' },
        { text: 'Error', value: 'error' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Issues',
      dataIndex: 'issues',
      key: 'issues',
      render: (issues: string[]) => <Tag color="red">{issues.length}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" onClick={() => handleAnalyzePage(record)}>
          Analyze
        </Button>
      ),
    },
  ];

  const avgScore = Math.round(mockPages.reduce((sum, p) => sum + p.score, 0) / mockPages.length);
  const goodPages = mockPages.filter((p) => p.status === 'good').length;
  const totalIssues = mockPages.reduce((sum, p) => sum + p.issues.length, 0);

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <SearchOutlined style={{ color: '#1890ff' }} /> SEO Optimization
        </Title>
        <Paragraph type="secondary">
          Manage meta tags, sitemaps, and search engine optimization
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average SEO Score"
              value={avgScore}
              suffix="/100"
              prefix={<RiseOutlined />}
              valueStyle={{ color: avgScore > 70 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pages Optimized"
              value={goodPages}
              suffix={`/ ${mockPages.length}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Issues"
              value={totalIssues}
              prefix={<WarningOutlined />}
              valueStyle={{ color: totalIssues > 5 ? '#ff4d4f' : '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sitemap Entries"
              value={sitemapEntries.length}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="pages"
        items={[
          {
            key: 'pages',
            label: 'SEO Pages',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={16}>
                  <Card title="Page SEO Analysis">
                    <Table
                      columns={columns}
                      dataSource={mockPages}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  {selectedPage ? (
                    <Card title="Page Details">
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                          <Text strong>URL:</Text>
                          <br />
                          <Text code>{selectedPage.url}</Text>
                        </div>
                        <div>
                          <Text strong>Title:</Text>
                          <br />
                          <Text>{selectedPage.title}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {selectedPage.title.length} characters
                          </Text>
                        </div>
                        <div>
                          <Text strong>Description:</Text>
                          <br />
                          <Text>{selectedPage.description}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {selectedPage.description.length} characters
                          </Text>
                        </div>
                        <div>
                          <Text strong>Keywords:</Text>
                          <br />
                          <Space wrap>
                            {selectedPage.keywords.map((kw) => (
                              <Tag key={kw}>{kw}</Tag>
                            ))}
                          </Space>
                        </div>
                        {selectedPage.issues.length > 0 && (
                          <Alert
                            type="error"
                            message="SEO Issues"
                            description={
                              <List
                                size="small"
                                dataSource={selectedPage.issues}
                                renderItem={(issue) => (
                                  <List.Item>
                                    <Text type="danger">{issue}</Text>
                                  </List.Item>
                                )}
                              />
                            }
                          />
                        )}
                      </Space>
                    </Card>
                  ) : (
                    <Card>
                      <Text type="secondary">Select a page to view details</Text>
                    </Card>
                  )}
                </Col>
              </Row>
            ),
          },
          {
            key: 'meta',
            label: 'Meta Tags',
            children: (
              <Card title="Edit Meta Tags">
                <Form form={form} layout="vertical">
                  <Form.Item label="Page URL" name="url" rules={[{ required: true }]}>
                    <Input prefix={<LinkOutlined />} placeholder="/products/example" />
                  </Form.Item>
                  <Form.Item
                    label="Meta Title"
                    name="title"
                    help="Recommended: 50-60 characters"
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder="Enter page title"
                      showCount
                      maxLength={60}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Meta Description"
                    name="description"
                    help="Recommended: 150-160 characters"
                    rules={[{ required: true }]}
                  >
                    <TextArea
                      placeholder="Enter page description"
                      showCount
                      maxLength={160}
                      rows={3}
                    />
                  </Form.Item>
                  <Form.Item label="Meta Keywords" name="keywords">
                    <Select
                      mode="tags"
                      placeholder="Enter keywords"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                  <Form.Item label="Canonical URL" name="canonical">
                    <Input prefix={<GlobalOutlined />} placeholder="https://example.com/page" />
                  </Form.Item>
                  <Form.Item label="Open Graph Image" name="ogImage">
                    <Input placeholder="https://example.com/images/og-image.jpg" />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Save Meta Tags
                      </Button>
                      <Button>Preview</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'sitemap',
            label: 'Sitemap',
            children: (
              <Card
                title="XML Sitemap"
                extra={
                  <Space>
                    <Button type="primary" onClick={handleGenerateSitemap}>
                      Generate Sitemap
                    </Button>
                    <Button>Download</Button>
                  </Space>
                }
              >
                <Alert
                  message="Sitemap Configuration"
                  description="Your sitemap is automatically generated and updated daily. Submit to search engines for better indexing."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Table
                  dataSource={sitemapEntries}
                  rowKey="url"
                  pagination={false}
                  size="small"
                  columns={[
                    {
                      title: 'URL',
                      dataIndex: 'url',
                      key: 'url',
                      render: (url) => <Text code>{url}</Text>,
                    },
                    {
                      title: 'Priority',
                      dataIndex: 'priority',
                      key: 'priority',
                      render: (priority) => <Tag color="blue">{priority}</Tag>,
                    },
                    {
                      title: 'Change Frequency',
                      dataIndex: 'changeFreq',
                      key: 'changeFreq',
                    },
                    {
                      title: 'Last Modified',
                      dataIndex: 'lastMod',
                      key: 'lastMod',
                    },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: 'robots',
            label: 'Robots.txt',
            children: (
              <Card title="Robots.txt Configuration">
                <Form layout="vertical" onFinish={handleSubmitRobots}>
                  <Form.Item
                    label="Robots.txt Content"
                    help="Define crawling rules for search engine bots"
                  >
                    <TextArea
                      rows={12}
                      defaultValue={`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/

User-agent: Googlebot
Allow: /

Sitemap: https://example.com/sitemap.xml`}
                      style={{ fontFamily: 'monospace' }}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Update Robots.txt
                      </Button>
                      <Button>Test</Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'structured',
            label: 'Structured Data',
            children: (
              <Card title="Schema.org Structured Data">
                <Alert
                  message="JSON-LD Implementation"
                  description="Add structured data to help search engines understand your content better."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Row gutter={16}>
                  <Col span={12}>
                    <Card size="small" title="Product Schema" style={{ marginBottom: 16 }}>
                      <Paragraph>
                        <Text strong>Status:</Text> <Tag color="green">Active</Tag>
                      </Paragraph>
                      <Paragraph type="secondary">
                        Enhances product visibility in search results with rich snippets.
                      </Paragraph>
                    </Card>
                    <Card size="small" title="Organization Schema" style={{ marginBottom: 16 }}>
                      <Paragraph>
                        <Text strong>Status:</Text> <Tag color="green">Active</Tag>
                      </Paragraph>
                      <Paragraph type="secondary">
                        Displays company information in knowledge panels.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card size="small" title="BreadcrumbList Schema" style={{ marginBottom: 16 }}>
                      <Paragraph>
                        <Text strong>Status:</Text> <Tag color="green">Active</Tag>
                      </Paragraph>
                      <Paragraph type="secondary">
                        Shows breadcrumb navigation in search results.
                      </Paragraph>
                    </Card>
                    <Card size="small" title="Review Schema" style={{ marginBottom: 16 }}>
                      <Paragraph>
                        <Text strong>Status:</Text> <Tag color="orange">Pending</Tag>
                      </Paragraph>
                      <Paragraph type="secondary">
                        Display star ratings in search results.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SEOOptimizationPage;
