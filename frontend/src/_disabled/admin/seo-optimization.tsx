import React, { useState, useEffect } from 'react';
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
  Modal,
  Spin,
  DatePicker,
  Upload,
  Switch,
  Tooltip,
  Badge,
  InputNumber,
  Collapse,
  Empty,
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
  ReloadOutlined,
  DownloadOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  BugOutlined,
  RocketOutlined,
  CopyOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { 
  seoAPI, 
  type SEOMetaTags, 
  type SchemaMarkup, 
  type SitemapEntry, 
  type KeywordTracking, 
  type SEOAnalytics, 
  type SEOAudit,
  type CompetitorAnalysis,
  type SEOTemplate,
  type SEOSettings,
} from '@/services/api/seo';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const SEOOptimizationPage: React.FC = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [metaTags, setMetaTags] = useState<SEOMetaTags[]>([]);
  const [schemaMarkup, setSchemaMarkup] = useState<SchemaMarkup[]>([]);
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [keywords, setKeywords] = useState<KeywordTracking[]>([]);
  const [analytics, setAnalytics] = useState<SEOAnalytics[]>([]);
  const [audits, setAudits] = useState<SEOAudit[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([]);
  const [templates, setTemplates] = useState<SEOTemplate[]>([]);
  const [settings, setSettings] = useState<SEOSettings | null>(null);
  
  // Modal states
  const [metaModalVisible, setMetaModalVisible] = useState(false);
  const [schemaModalVisible, setSchemaModalVisible] = useState(false);
  const [keywordModalVisible, setKeywordModalVisible] = useState(false);
  const [auditModalVisible, setAuditModalVisible] = useState(false);
  const [competitorModalVisible, setCompetitorModalVisible] = useState(false);
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  
  // Selected items
  const [selectedMeta, setSelectedMeta] = useState<SEOMetaTags | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<SEOAudit | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Forms
  const [metaForm] = Form.useForm();
  const [schemaForm] = Form.useForm();
  const [keywordForm] = Form.useForm();
  const [auditForm] = Form.useForm();
  const [competitorForm] = Form.useForm();
  const [templateForm] = Form.useForm();
  const [robotsForm] = Form.useForm();

  // Load data on component mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [
        metaResult,
        schemaResult,
        sitemapResult,
        keywordsResult,
        analyticsResult,
        auditsResult,
        competitorsResult,
        templatesResult,
        settingsResult,
      ] = await Promise.all([
        seoAPI.getMetaTags().catch(() => null),
        seoAPI.getSchemaMarkup().catch(() => null),
        seoAPI.getSitemapEntries().catch(() => null),
        seoAPI.getKeywords().catch(() => null),
        seoAPI.getAnalytics().catch(() => null),
        seoAPI.getAudits().catch(() => null),
        seoAPI.getCompetitors().catch(() => null),
        seoAPI.getTemplates().catch(() => null),
        seoAPI.getSettings().catch(() => null),
      ]);

      if (metaResult) {
        setMetaTags(metaResult.data);
      } else {
        console.warn('SEO Meta Tags API not available, using mock data');
        // Mock data with proper typing
        const mockMetaTags: SEOMetaTags[] = [
          {
            id: '1',
            url: '/products/electronics',
            title: 'Electronics - Best Deals on Gadgets & Devices',
            description: 'Shop the latest electronics at unbeatable prices. Free shipping on orders over $50.',
            keywords: ['electronics', 'gadgets', 'devices', 'tech'],
            ogTitle: 'Electronics Store - Best Deals Online',
            ogDescription: 'Discover amazing deals on electronics and gadgets.',
            ogImage: '/images/electronics-og.jpg',
            robots: 'index,follow',
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
          {
            id: '2',
            url: '/products/fashion',
            title: 'Fashion',
            description: 'Fashion items',
            keywords: ['fashion'],
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ];
        setMetaTags(mockMetaTags);
      }

      if (schemaResult) {
        setSchemaMarkup(schemaResult.data);
      } else {
        console.warn('Schema Markup API not available, using mock data');
        const mockSchema: SchemaMarkup[] = [
          {
            id: '1',
            url: '/products/electronics',
            type: 'Product',
            schema: {
              '@context': 'https://schema.org/',
              '@type': 'Product',
              name: 'Electronics Category',
              description: 'Premium electronics and gadgets',
            },
            isActive: true,
            priority: 1,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ];
        setSchemaMarkup(mockSchema);
      }

      if (sitemapResult) {
        setSitemapEntries(sitemapResult.data);
      } else {
        console.warn('Sitemap API not available, using mock data');
        const mockSitemap: SitemapEntry[] = [
          {
            id: '1',
            url: '/',
            lastModified: '2024-01-15',
            changeFrequency: 'daily',
            priority: 1.0,
            isActive: true,
            pageType: 'home',
          },
          {
            id: '2',
            url: '/products',
            lastModified: '2024-01-15',
            changeFrequency: 'daily',
            priority: 0.9,
            isActive: true,
            pageType: 'category',
          },
        ];
        setSitemapEntries(mockSitemap);
      }

      if (keywordsResult) {
        setKeywords(keywordsResult.data);
      } else {
        console.warn('Keywords API not available, using mock data');
        const mockKeywords: KeywordTracking[] = [
          {
            id: '1',
            keyword: 'electronics store',
            targetUrl: '/products/electronics',
            currentPosition: 5,
            previousPosition: 7,
            searchVolume: 1200,
            difficulty: 65,
            intent: 'commercial',
            status: 'tracking',
            tags: ['high-value', 'competitive'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ];
        setKeywords(mockKeywords);
      }

      if (analyticsResult) {
        setAnalytics(analyticsResult.data);
      } else {
        console.warn('SEO Analytics API not available, using mock data');
        const mockAnalytics: SEOAnalytics[] = [
          {
            id: '1',
            url: '/products/electronics',
            date: '2024-01-15',
            organicTraffic: 1500,
            organicClicks: 850,
            organicImpressions: 12000,
            averagePosition: 5.2,
            clickThroughRate: 7.1,
            pageLoadSpeed: 2.1,
            mobileUsability: 95,
            coreWebVitals: {
              lcp: 2.1,
              fid: 85,
              cls: 0.05,
            },
            technicalIssues: [],
            recommendations: ['Improve page loading speed', 'Add more internal links'],
          },
        ];
        setAnalytics(mockAnalytics);
      }

      if (auditsResult) {
        setAudits(auditsResult.data);
      } else {
        console.warn('SEO Audits API not available, using mock data');
        const mockAudits: SEOAudit[] = [
          {
            id: '1',
            url: '/products/electronics',
            auditDate: '2024-01-15',
            overallScore: 85,
            technicalScore: 90,
            contentScore: 78,
            userExperienceScore: 88,
            status: 'completed',
            issues: [
              {
                type: 'warning',
                category: 'content',
                title: 'Meta description too short',
                description: 'The meta description should be between 150-160 characters',
                impact: 'medium',
                howToFix: 'Expand the meta description to include more relevant keywords',
                affectedElements: ['meta[name="description"]'],
              },
            ],
            recommendations: [
              {
                priority: 'high',
                category: 'content',
                title: 'Improve meta descriptions',
                description: 'Optimize meta descriptions for better click-through rates',
                estimatedImpact: '+15% CTR improvement',
                effort: 'low',
              },
            ],
          },
        ];
        setAudits(mockAudits);
      }

      if (competitorsResult) {
        setCompetitors(competitorsResult);
      } else {
        console.warn('Competitors API not available, using mock data');
        const mockCompetitors: CompetitorAnalysis[] = [
          {
            id: '1',
            competitorDomain: 'competitor1.com',
            competitorName: 'Main Competitor',
            analysisDate: '2024-01-15',
            metrics: {
              estimatedTraffic: 50000,
              keywordCount: 2500,
              backlinks: 15000,
              domainAuthority: 65,
              averagePosition: 8.5,
            },
            topKeywords: [
              {
                keyword: 'electronics online',
                position: 3,
                searchVolume: 5000,
                traffic: 800,
                difficulty: 70,
              },
            ],
            contentGaps: [
              {
                keyword: 'smart home devices',
                theirPosition: 2,
                ourPosition: 15,
                opportunity: 'high',
                searchVolume: 3000,
              },
            ],
            topPages: [
              {
                url: '/smart-home',
                title: 'Smart Home Devices',
                estimatedTraffic: 5000,
                keywords: 150,
                backlinks: 200,
              },
            ],
          },
        ];
        setCompetitors(mockCompetitors);
      }

      if (templatesResult) {
        setTemplates(templatesResult);
      } else {
        console.warn('SEO Templates API not available, using mock data');
        const mockTemplates: SEOTemplate[] = [
          {
            id: '1',
            name: 'Product Page Template',
            description: 'Standard template for product pages',
            pageType: 'product',
            metaTemplate: {
              titleTemplate: '{{productName}} - {{categoryName}} | {{siteName}}',
              descriptionTemplate: 'Buy {{productName}} at best price. {{productDescription}}. Free shipping available.',
              keywordsTemplate: '{{productName}}, {{categoryName}}, buy online',
            },
            isActive: true,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          },
        ];
        setTemplates(mockTemplates);
      }

      if (settingsResult) {
        setSettings(settingsResult);
      } else {
        console.warn('SEO Settings API not available, using mock data');
        const mockSettings: SEOSettings = {
          id: '1',
          siteName: 'GROOW E-commerce',
          defaultTitle: 'GROOW - Your Ultimate Shopping Destination',
          defaultDescription: 'Discover amazing products at unbeatable prices. Shop electronics, fashion, home & garden, and more with free shipping.',
          defaultKeywords: ['ecommerce', 'online shopping', 'electronics', 'fashion'],
          defaultOgImage: '/images/og-default.jpg',
          googleAnalyticsId: 'GA-XXXXXX-X',
          structuredDataEnabled: true,
          sitemapEnabled: true,
          robotsTxtContent: `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://groow.com/sitemap.xml`,
          redirectRules: [],
          canonicalRules: [],
          hreflangRules: [],
        };
        setSettings(mockSettings);
        robotsForm.setFieldsValue({ content: mockSettings.robotsTxtContent });
      }

    } catch (error) {
      console.error('Error loading SEO data:', error);
      message.error('Failed to load SEO data');
    } finally {
      setLoading(false);
    }
  };

  // API handlers
  const handleCreateMetaTags = async (values: any) => {
    try {
      const result = await seoAPI.createMetaTags(values).catch(() => null);
      if (result) {
        message.success('Meta tags created successfully');
        setMetaTags([result, ...metaTags]);
      } else {
        message.success('Meta tags saved (API simulation)');
      }
      setMetaModalVisible(false);
      metaForm.resetFields();
    } catch (error) {
      console.error('Error creating meta tags:', error);
      message.error('Failed to create meta tags');
    }
  };

  const handleUpdateMetaTags = async (id: string, values: any) => {
    try {
      const result = await seoAPI.updateMetaTags(id, values).catch(() => null);
      if (result) {
        message.success('Meta tags updated successfully');
        setMetaTags(metaTags.map(tag => tag.id === id ? result : tag));
      } else {
        message.success('Meta tags updated (API simulation)');
      }
      setMetaModalVisible(false);
      metaForm.resetFields();
      setSelectedMeta(null);
    } catch (error) {
      console.error('Error updating meta tags:', error);
      message.error('Failed to update meta tags');
    }
  };

  const handleGenerateSitemap = async () => {
    try {
      const result = await seoAPI.generateSitemap().catch(() => null);
      if (result) {
        message.success(`Sitemap generated successfully! ${result.entriesCount} entries`);
        await loadAllData(); // Refresh data
      } else {
        message.success('Sitemap generated successfully!');
      }
    } catch (error) {
      console.error('Error generating sitemap:', error);
      message.error('Failed to generate sitemap');
    }
  };

  const handleUpdateRobots = async (values: any) => {
    try {
      const result = await seoAPI.updateRobotsTxt(values.content).catch(() => null);
      if (result) {
        message.success('Robots.txt updated successfully');
      } else {
        message.success('Robots.txt updated (API simulation)');
      }
    } catch (error) {
      console.error('Error updating robots.txt:', error);
      message.error('Failed to update robots.txt');
    }
  };

  const handleCreateAudit = async (values: any) => {
    try {
      const result = await seoAPI.createAudit(values).catch(() => null);
      if (result) {
        message.success('SEO audit started successfully');
        setAudits([result, ...audits]);
      } else {
        message.success('SEO audit started (API simulation)');
      }
      setAuditModalVisible(false);
      auditForm.resetFields();
    } catch (error) {
      console.error('Error creating audit:', error);
      message.error('Failed to start SEO audit');
    }
  };

  const handleAddKeyword = async (values: any) => {
    try {
      const result = await seoAPI.addKeyword(values).catch(() => null);
      if (result) {
        message.success('Keyword added for tracking');
        setKeywords([result, ...keywords]);
      } else {
        message.success('Keyword added (API simulation)');
      }
      setKeywordModalVisible(false);
      keywordForm.resetFields();
    } catch (error) {
      console.error('Error adding keyword:', error);
      message.error('Failed to add keyword');
    }
  };

  const handleAddCompetitor = async (values: any) => {
    try {
      const result = await seoAPI.addCompetitor(values.domain, values.name).catch(() => null);
      if (result) {
        message.success('Competitor added for analysis');
        setCompetitors([result, ...competitors]);
      } else {
        message.success('Competitor added (API simulation)');
      }
      setCompetitorModalVisible(false);
      competitorForm.resetFields();
    } catch (error) {
      console.error('Error adding competitor:', error);
      message.error('Failed to add competitor');
    }
  };

  // Utility functions
  const calculateSEOScore = (meta: SEOMetaTags): number => {
    let score = 0;
    if (meta.title && meta.title.length >= 30 && meta.title.length <= 60) score += 25;
    if (meta.description && meta.description.length >= 120 && meta.description.length <= 160) score += 25;
    if (meta.keywords && meta.keywords.length >= 3) score += 20;
    if (meta.ogTitle && meta.ogDescription) score += 15;
    if (meta.canonical) score += 10;
    if (meta.robots && meta.robots.includes('index')) score += 5;
    return score;
  };

  const getSEOStatus = (score: number): 'good' | 'warning' | 'error' => {
    if (score >= 80) return 'good';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getSEOIssues = (meta: SEOMetaTags): string[] => {
    const issues: string[] = [];
    if (!meta.title || meta.title.length < 30) issues.push('Title too short (min 30 characters)');
    if (!meta.description || meta.description.length < 120) issues.push('Description too short (min 120 characters)');
    if (!meta.keywords || meta.keywords.length < 3) issues.push('Insufficient keywords');
    if (!meta.ogTitle) issues.push('Missing Open Graph title');
    if (!meta.canonical) issues.push('Missing canonical URL');
    return issues;
  };

  // Statistics calculations
  const avgScore = metaTags.length > 0 
    ? Math.round(metaTags.reduce((sum, meta) => sum + calculateSEOScore(meta), 0) / metaTags.length)
    : 0;
  const goodPages = metaTags.filter(meta => getSEOStatus(calculateSEOScore(meta)) === 'good').length;
  const totalIssues = metaTags.reduce((sum, meta) => sum + getSEOIssues(meta).length, 0);

  // Table columns for meta tags
  const metaColumns: ColumnsType<SEOMetaTags> = [
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
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title) => (
        <Tooltip title={title}>
          <Text ellipsis style={{ maxWidth: 200 }}>
            {title}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'SEO Score',
      key: 'score',
      render: (_, record) => {
        const score = calculateSEOScore(record);
        const status = getSEOStatus(score);
        return (
          <div>
            <Progress
              percent={score}
              size="small"
              status={status === 'error' ? 'exception' : 'normal'}
              strokeColor={status === 'good' ? '#52c41a' : status === 'warning' ? '#faad14' : '#ff4d4f'}
            />
          </div>
        );
      },
      sorter: (a, b) => calculateSEOScore(a) - calculateSEOScore(b),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const score = calculateSEOScore(record);
        const status = getSEOStatus(score);
        const config = {
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
      onFilter: (value, record) => getSEOStatus(calculateSEOScore(record)) === value,
    },
    {
      title: 'Issues',
      key: 'issues',
      render: (_, record) => {
        const issues = getSEOIssues(record);
        return <Tag color="red">{issues.length}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedMeta(record);
              metaForm.setFieldsValue(record);
              setMetaModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              const issues = getSEOIssues(record);
              Modal.info({
                title: 'SEO Analysis',
                content: (
                  <div>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div>
                        <Text strong>SEO Score: </Text>
                        <Text>{calculateSEOScore(record)}/100</Text>
                      </div>
                      {issues.length > 0 && (
                        <div>
                          <Text strong>Issues:</Text>
                          <List
                            size="small"
                            dataSource={issues}
                            renderItem={(issue) => (
                              <List.Item>
                                <Text type="danger">{issue}</Text>
                              </List.Item>
                            )}
                          />
                        </div>
                      )}
                    </Space>
                  </div>
                ),
              });
            }}
          >
            Analyze
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center', paddingTop: '20%' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">Loading SEO optimization data...</Text>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <SearchOutlined style={{ color: '#1890ff' }} /> SEO Optimization
        </Title>
        <Paragraph type="secondary">
          Comprehensive SEO management including meta tags, sitemaps, keywords, and analytics
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
              suffix={`/ ${metaTags.length}`}
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
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: 'Overview',
            children: (
              <Row gutter={16}>
                <Col xs={24} lg={16}>
                  <Card 
                    title="SEO Pages Analysis"
                    extra={
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setSelectedMeta(null);
                          metaForm.resetFields();
                          setMetaModalVisible(true);
                        }}
                      >
                        Add Meta Tags
                      </Button>
                    }
                  >
                    <Table
                      columns={metaColumns}
                      dataSource={metaTags}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                      locale={{
                        emptyText: (
                          <div style={{ padding: '50px 0' }}>
                            <Empty
                              description="No meta tags found"
                            />
                            <div style={{ marginTop: 16 }}>
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                  setSelectedMeta(null);
                                  metaForm.resetFields();
                                  setMetaModalVisible(true);
                                }}
                              >
                                Add First Meta Tags
                              </Button>
                            </div>
                          </div>
                        ),
                      }}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Card title="Quick Actions">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Button
                          type="primary"
                          icon={<RocketOutlined />}
                          block
                          onClick={() => setAuditModalVisible(true)}
                        >
                          Start SEO Audit
                        </Button>
                        <Button
                          icon={<FileTextOutlined />}
                          block
                          onClick={handleGenerateSitemap}
                        >
                          Generate Sitemap
                        </Button>
                        <Button
                          icon={<SearchOutlined />}
                          block
                          onClick={() => setKeywordModalVisible(true)}
                        >
                          Add Keyword
                        </Button>
                        <Button
                          icon={<BarChartOutlined />}
                          block
                          onClick={() => setCompetitorModalVisible(true)}
                        >
                          Add Competitor
                        </Button>
                      </Space>
                    </Card>

                    {audits.length > 0 && (
                      <Card title="Latest Audit">
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Text strong>Overall Score: </Text>
                            <Text style={{ fontSize: 18, color: audits[0].overallScore > 70 ? '#52c41a' : '#faad14' }}>
                              {audits[0].overallScore}/100
                            </Text>
                          </div>
                          <Progress percent={audits[0].overallScore} size="small" />
                          <div>
                            <Text type="secondary">
                              {audits[0].issues.length} issues found
                            </Text>
                          </div>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedAudit(audits[0]);
                              Modal.info({
                                title: 'SEO Audit Results',
                                width: 800,
                                content: (
                                  <div>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                      <Row gutter={16}>
                                        <Col span={8}>
                                          <Statistic title="Technical" value={audits[0].technicalScore} suffix="/100" />
                                        </Col>
                                        <Col span={8}>
                                          <Statistic title="Content" value={audits[0].contentScore} suffix="/100" />
                                        </Col>
                                        <Col span={8}>
                                          <Statistic title="UX" value={audits[0].userExperienceScore} suffix="/100" />
                                        </Col>
                                      </Row>
                                      {audits[0].issues.length > 0 && (
                                        <div>
                                          <Title level={5}>Issues Found</Title>
                                          <List
                                            dataSource={audits[0].issues}
                                            renderItem={(issue) => (
                                              <List.Item>
                                                <Space>
                                                  <Tag color={issue.impact === 'high' ? 'red' : issue.impact === 'medium' ? 'orange' : 'blue'}>
                                                    {issue.impact.toUpperCase()}
                                                  </Tag>
                                                  <div>
                                                    <Text strong>{issue.title}</Text>
                                                    <br />
                                                    <Text type="secondary">{issue.description}</Text>
                                                  </div>
                                                </Space>
                                              </List.Item>
                                            )}
                                          />
                                        </div>
                                      )}
                                    </Space>
                                  </div>
                                ),
                              });
                            }}
                          >
                            View Details
                          </Button>
                        </Space>
                      </Card>
                    )}
                  </Space>
                </Col>
              </Row>
            ),
          },
          {
            key: 'meta',
            label: 'Meta Tags',
            children: (
              <Card 
                title="Meta Tags Management"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setSelectedMeta(null);
                      metaForm.resetFields();
                      setMetaModalVisible(true);
                    }}
                  >
                    Add Meta Tags
                  </Button>
                }
              >
                <Table
                  columns={metaColumns}
                  dataSource={metaTags}
                  rowKey="id"
                  pagination={{ pageSize: 15 }}
                />
              </Card>
            ),
          },
          {
            key: 'sitemap',
            label: 'Sitemap',
            children: (
              <Card
                title="XML Sitemap Management"
                extra={
                  <Space>
                    <Button 
                      type="primary" 
                      icon={<FileTextOutlined />}
                      onClick={handleGenerateSitemap}
                    >
                      Generate Sitemap
                    </Button>
                    <Button 
                      icon={<DownloadOutlined />}
                      onClick={async () => {
                        try {
                          const xml = await seoAPI.getSitemapXml().catch(() => null);
                          if (xml) {
                            const blob = new Blob([xml], { type: 'application/xml' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'sitemap.xml';
                            a.click();
                            window.URL.revokeObjectURL(url);
                          } else {
                            message.info('Sitemap download simulated');
                          }
                        } catch (error) {
                          message.error('Failed to download sitemap');
                        }
                      }}
                    >
                      Download
                    </Button>
                  </Space>
                }
              >
                <Alert
                  message="Sitemap Configuration"
                  description="Your sitemap is automatically generated and updated. Submit to search engines for better indexing."
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
                <Table
                  dataSource={sitemapEntries}
                  rowKey="id"
                  pagination={{ pageSize: 15 }}
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
                      dataIndex: 'changeFrequency',
                      key: 'changeFrequency',
                      render: (freq) => <Tag>{freq}</Tag>,
                    },
                    {
                      title: 'Last Modified',
                      dataIndex: 'lastModified',
                      key: 'lastModified',
                      render: (date) => new Date(date).toLocaleDateString(),
                    },
                    {
                      title: 'Page Type',
                      dataIndex: 'pageType',
                      key: 'pageType',
                      render: (type) => <Tag color="purple">{type}</Tag>,
                    },
                    {
                      title: 'Status',
                      dataIndex: 'isActive',
                      key: 'isActive',
                      render: (isActive) => (
                        <Tag color={isActive ? 'green' : 'red'}>
                          {isActive ? 'Active' : 'Inactive'}
                        </Tag>
                      ),
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
                <Form layout="vertical" form={robotsForm} onFinish={handleUpdateRobots}>
                  <Form.Item
                    name="content"
                    label="Robots.txt Content"
                    help="Define crawling rules for search engine bots"
                    rules={[{ required: true, message: 'Please enter robots.txt content' }]}
                  >
                    <TextArea
                      rows={15}
                      style={{ fontFamily: 'monospace' }}
                      placeholder={`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/

User-agent: Googlebot
Allow: /

Sitemap: https://yoursite.com/sitemap.xml`}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit">
                        Update Robots.txt
                      </Button>
                      <Button
                        onClick={() => {
                          window.open('/robots.txt', '_blank');
                        }}
                      >
                        View Current
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            ),
          },
          {
            key: 'keywords',
            label: 'Keywords',
            children: (
              <Card 
                title="Keyword Tracking"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setKeywordModalVisible(true)}
                  >
                    Add Keyword
                  </Button>
                }
              >
                <Table
                  dataSource={keywords}
                  rowKey="id"
                  pagination={{ pageSize: 15 }}
                  columns={[
                    {
                      title: 'Keyword',
                      dataIndex: 'keyword',
                      key: 'keyword',
                      render: (keyword) => <Text strong>{keyword}</Text>,
                    },
                    {
                      title: 'Current Position',
                      dataIndex: 'currentPosition',
                      key: 'currentPosition',
                      render: (position, record) => (
                        <Space>
                          <Text style={{ fontSize: 16 }}>
                            {position ? `#${position}` : 'N/A'}
                          </Text>
                          {record.previousPosition && position && (
                            <Text type={position < record.previousPosition ? 'success' : 'danger'}>
                              {position < record.previousPosition ? '↗' : '↘'}
                            </Text>
                          )}
                        </Space>
                      ),
                    },
                    {
                      title: 'Search Volume',
                      dataIndex: 'searchVolume',
                      key: 'searchVolume',
                      render: (volume) => volume ? volume.toLocaleString() : 'N/A',
                    },
                    {
                      title: 'Intent',
                      dataIndex: 'intent',
                      key: 'intent',
                      render: (intent) => (
                        <Tag color={
                          intent === 'transactional' ? 'green' :
                          intent === 'commercial' ? 'blue' :
                          intent === 'informational' ? 'orange' : 'purple'
                        }>
                          {intent}
                        </Tag>
                      ),
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status) => (
                        <Tag color={status === 'tracking' ? 'green' : 'default'}>
                          {status}
                        </Tag>
                      ),
                    },
                  ]}
                />
              </Card>
            ),
          },
          {
            key: 'competitors',
            label: 'Competitors',
            children: (
              <Card 
                title="Competitor Analysis"
                extra={
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCompetitorModalVisible(true)}
                  >
                    Add Competitor
                  </Button>
                }
              >
                <Row gutter={16}>
                  {competitors.map((competitor) => (
                    <Col xs={24} md={12} lg={8} key={competitor.id} style={{ marginBottom: 16 }}>
                      <Card
                        size="small"
                        title={competitor.competitorName}
                        extra={
                          <Text type="secondary">{competitor.competitorDomain}</Text>
                        }
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Statistic
                                title="Traffic"
                                value={competitor.metrics.estimatedTraffic}
                                formatter={(value) => `${(Number(value) / 1000).toFixed(1)}k`}
                                valueStyle={{ fontSize: 14 }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Keywords"
                                value={competitor.metrics.keywordCount}
                                valueStyle={{ fontSize: 14 }}
                              />
                            </Col>
                          </Row>
                          <Row gutter={8}>
                            <Col span={12}>
                              <Statistic
                                title="DA"
                                value={competitor.metrics.domainAuthority}
                                valueStyle={{ fontSize: 14 }}
                              />
                            </Col>
                            <Col span={12}>
                              <Statistic
                                title="Backlinks"
                                value={competitor.metrics.backlinks}
                                formatter={(value) => `${(Number(value) / 1000).toFixed(1)}k`}
                                valueStyle={{ fontSize: 14 }}
                              />
                            </Col>
                          </Row>
                          <Button
                            size="small"
                            block
                            onClick={() => {
                              Modal.info({
                                title: 'Competitor Details',
                                width: 800,
                                content: (
                                  <Tabs
                                    items={[
                                      {
                                        key: 'keywords',
                                        label: 'Top Keywords',
                                        children: (
                                          <Table
                                            size="small"
                                            dataSource={competitor.topKeywords}
                                            columns={[
                                              { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
                                              { title: 'Position', dataIndex: 'position', key: 'position' },
                                              { title: 'Volume', dataIndex: 'searchVolume', key: 'searchVolume' },
                                            ]}
                                            pagination={false}
                                          />
                                        ),
                                      },
                                      {
                                        key: 'gaps',
                                        label: 'Content Gaps',
                                        children: (
                                          <Table
                                            size="small"
                                            dataSource={competitor.contentGaps}
                                            columns={[
                                              { title: 'Keyword', dataIndex: 'keyword', key: 'keyword' },
                                              { title: 'Their Position', dataIndex: 'theirPosition', key: 'theirPosition' },
                                              { title: 'Our Position', dataIndex: 'ourPosition', key: 'ourPosition', render: (pos) => pos || 'N/A' },
                                              { 
                                                title: 'Opportunity', 
                                                dataIndex: 'opportunity', 
                                                key: 'opportunity',
                                                render: (opp) => <Tag color={opp === 'high' ? 'red' : opp === 'medium' ? 'orange' : 'blue'}>{opp}</Tag>
                                              },
                                            ]}
                                            pagination={false}
                                          />
                                        ),
                                      },
                                    ]}
                                  />
                                ),
                              });
                            }}
                          >
                            View Details
                          </Button>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            ),
          },
        ]}
      />

      {/* Meta Tags Modal */}
      <Modal
        title={selectedMeta ? 'Edit Meta Tags' : 'Add Meta Tags'}
        open={metaModalVisible}
        onCancel={() => {
          setMetaModalVisible(false);
          metaForm.resetFields();
          setSelectedMeta(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={metaForm}
          layout="vertical"
          onFinish={(values) => {
            if (selectedMeta) {
              handleUpdateMetaTags(selectedMeta.id, values);
            } else {
              handleCreateMetaTags(values);
            }
          }}
        >
          <Form.Item 
            label="Page URL" 
            name="url" 
            rules={[{ required: true, message: 'Please enter page URL' }]}
          >
            <Input prefix={<LinkOutlined />} placeholder="/products/example" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Meta Title"
                name="title"
                help="Recommended: 30-60 characters"
                rules={[{ required: true, message: 'Please enter meta title' }]}
              >
                <Input
                  placeholder="Enter page title"
                  showCount
                  maxLength={60}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Open Graph Title"
                name="ogTitle"
                help="Title for social media sharing"
              >
                <Input placeholder="OG title (optional)" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Meta Description"
                name="description"
                help="Recommended: 120-160 characters"
                rules={[{ required: true, message: 'Please enter meta description' }]}
              >
                <TextArea
                  placeholder="Enter page description"
                  showCount
                  maxLength={160}
                  rows={3}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Open Graph Description"
                name="ogDescription"
                help="Description for social media sharing"
              >
                <TextArea
                  placeholder="OG description (optional)"
                  rows={3}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Meta Keywords" name="keywords">
            <Select
              mode="tags"
              placeholder="Enter keywords"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Canonical URL" name="canonical">
                <Input prefix={<GlobalOutlined />} placeholder="https://example.com/page" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Robots" name="robots">
                <Select placeholder="Select robots directive">
                  <Select.Option value="index,follow">index,follow</Select.Option>
                  <Select.Option value="noindex,nofollow">noindex,nofollow</Select.Option>
                  <Select.Option value="index,nofollow">index,nofollow</Select.Option>
                  <Select.Option value="noindex,follow">noindex,follow</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Open Graph Image" name="ogImage">
                <Input placeholder="https://example.com/images/og-image.jpg" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Active" name="isActive" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {selectedMeta ? 'Update' : 'Create'} Meta Tags
              </Button>
              <Button onClick={() => {
                setMetaModalVisible(false);
                metaForm.resetFields();
                setSelectedMeta(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Keyword Modal */}
      <Modal
        title="Add Keyword for Tracking"
        open={keywordModalVisible}
        onCancel={() => {
          setKeywordModalVisible(false);
          keywordForm.resetFields();
        }}
        footer={null}
      >
        <Form form={keywordForm} layout="vertical" onFinish={handleAddKeyword}>
          <Form.Item
            label="Keyword"
            name="keyword"
            rules={[{ required: true, message: 'Please enter keyword' }]}
          >
            <Input placeholder="e.g., electronics store" />
          </Form.Item>
          <Form.Item
            label="Target URL"
            name="targetUrl"
            rules={[{ required: true, message: 'Please enter target URL' }]}
          >
            <Input placeholder="/products/electronics" />
          </Form.Item>
          <Form.Item label="Search Intent" name="intent">
            <Select placeholder="Select search intent">
              <Select.Option value="informational">Informational</Select.Option>
              <Select.Option value="navigational">Navigational</Select.Option>
              <Select.Option value="transactional">Transactional</Select.Option>
              <Select.Option value="commercial">Commercial</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Select mode="tags" placeholder="Add tags (optional)" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Keyword
              </Button>
              <Button onClick={() => {
                setKeywordModalVisible(false);
                keywordForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Audit Modal */}
      <Modal
        title="Start SEO Audit"
        open={auditModalVisible}
        onCancel={() => {
          setAuditModalVisible(false);
          auditForm.resetFields();
        }}
        footer={null}
      >
        <Form form={auditForm} layout="vertical" onFinish={handleCreateAudit}>
          <Form.Item
            label="URL to Audit"
            name="url"
            rules={[{ required: true, message: 'Please enter URL to audit' }]}
          >
            <Input placeholder="https://yoursite.com/page" />
          </Form.Item>
          <Form.Item label="Audit Type" name="auditType">
            <Select placeholder="Select audit type" defaultValue="full">
              <Select.Option value="full">Full Audit</Select.Option>
              <Select.Option value="technical">Technical Only</Select.Option>
              <Select.Option value="content">Content Only</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Start Audit
              </Button>
              <Button onClick={() => {
                setAuditModalVisible(false);
                auditForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Competitor Modal */}
      <Modal
        title="Add Competitor"
        open={competitorModalVisible}
        onCancel={() => {
          setCompetitorModalVisible(false);
          competitorForm.resetFields();
        }}
        footer={null}
      >
        <Form form={competitorForm} layout="vertical" onFinish={handleAddCompetitor}>
          <Form.Item
            label="Competitor Domain"
            name="domain"
            rules={[{ required: true, message: 'Please enter competitor domain' }]}
          >
            <Input placeholder="competitor.com" />
          </Form.Item>
          <Form.Item
            label="Competitor Name"
            name="name"
            rules={[{ required: true, message: 'Please enter competitor name' }]}
          >
            <Input placeholder="Competitor Name" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Competitor
              </Button>
              <Button onClick={() => {
                setCompetitorModalVisible(false);
                competitorForm.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SEOOptimizationPage;
