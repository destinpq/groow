import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Input, 
  Button, 
  Space, 
  Collapse, 
  Tag, 
  Spin, 
  message,
  Empty,
  Badge,
  Rate,
  AutoComplete,
  List,
  Avatar,
  Divider,
  Alert,
  Select,
  Statistic
} from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  SafetyOutlined,
  RocketOutlined,
  LikeOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  MailOutlined,
  BookOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  BulbOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { helpCenterAPI } from '../services/api/helpCenterAPI';
import type { FAQ, HelpCategory, HelpArticle, HelpBanner } from '../services/api/helpCenterAPI';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userFeedback, setUserFeedback] = useState<Record<string, { helpful: boolean; rating: number }>>({});
  const [viewedArticles, setViewedArticles] = useState<Set<string>>(new Set());
  const [expandedFAQs, setExpandedFAQs] = useState<Set<string>>(new Set());
  
  // Data states
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [popularArticles, setPopularArticles] = useState<HelpArticle[]>([]);
  const [banners, setBanners] = useState<HelpBanner[]>([]);
  const [searchResults, setSearchResults] = useState<{
    faqs: FAQ[];
    articles: HelpArticle[];
    total: number;
  } | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [
        categoriesRes,
        faqsRes,
        articlesRes,
        bannersRes
      ] = await Promise.all([
        helpCenterAPI.getHelpCategories(),
        helpCenterAPI.getFAQs({ active: true, limit: 8 }),
        helpCenterAPI.getHelpArticles({ limit: 6 }),
        helpCenterAPI.getHelpBanners()
      ]);

      if (categoriesRes.success) setCategories(categoriesRes.data);
      if (faqsRes.success) {
        // Map FaqDto to FAQ format
        const mappedFaqs = faqsRes.data.map(faq => ({
          ...faq,
          order: faq.displayOrder,
          createdAt: faq.createdAt.toString(),
          updatedAt: faq.updatedAt.toString()
        }));
        setFaqs(mappedFaqs);
      }
      if (articlesRes.success) setPopularArticles(articlesRes.data);
      if (bannersRes.success) setBanners(bannersRes.data);

    } catch (error) {
      console.error('Error loading help center data:', error);
      message.error('Failed to load help center data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await helpCenterAPI.searchHelp(value);
      
      if (response.success) {
        setSearchResults(Array.isArray(response?.data?.data) ? response.data.data : (Array.isArray(response?.data) ? response.data : []));
      } else {
        message.error('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      message.error('Search failed');
    } finally {
      setSearchLoading(false);
    }
  };

  // Enhanced user interaction functions
  const handleFAQFeedback = async (faqId: string, helpful: boolean) => {
    try {
      setUserFeedback(prev => ({
        ...prev,
        [faqId]: { ...prev[faqId], helpful }
      }));
      
      // Track analytics (would integrate with analytics API)
      console.log(`FAQ ${faqId} marked as ${helpful ? 'helpful' : 'not helpful'}`);
      message.success(`Thank you for your feedback!`);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      message.error('Failed to submit feedback');
    }
  };

  const handleArticleView = (articleId: string) => {
    setViewedArticles(prev => new Set(prev).add(articleId));
    // Track view analytics
    console.log(`Article ${articleId} viewed`);
  };

  const handleFAQExpand = (faqId: string) => {
    setExpandedFAQs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
    // Track FAQ expansion analytics
    console.log(`FAQ ${faqId} ${expandedFAQs.has(faqId) ? 'collapsed' : 'expanded'}`);
  };

  const handleCategoryFilter = async (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    try {
      const response = await helpCenterAPI.getFAQs({ 
        category: categorySlug, 
        active: true, 
        limit: 20 
      });
      if (response.success) {
        const mappedFaqs = response.data.map(faq => ({
          ...faq,
          order: faq.displayOrder,
          createdAt: faq.createdAt.toString(),
          updatedAt: faq.updatedAt.toString()
        }));
        setFaqs(mappedFaqs);
      }
    } catch (error) {
      console.error('Error filtering by category:', error);
      message.error('Failed to filter content');
    }
  };

  const generateSearchSuggestions = (value: string) => {
    const commonQuestions = [
      'How to place an order',
      'Track my order',
      'Return policy',
      'Payment methods',
      'Shipping information',
      'Account settings',
      'Contact support'
    ];
    
    if (!value) return [];
    
    return commonQuestions.filter(q => 
      q.toLowerCase().includes(value.toLowerCase())
    );
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'RocketOutlined': <RocketOutlined />,
      'ShoppingOutlined': <ShoppingOutlined />,
      'UserOutlined': <UserOutlined />,
      'SafetyOutlined': <SafetyOutlined />
    };
    return icons[iconName] || <QuestionCircleOutlined />;
  };

  const renderBanners = () => {
    if (!banners.length) return null;

    return (
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {banners.map(banner => (
          <Col xs={24} key={banner.id}>
            <Alert
              message={banner.title}
              description={banner.content}
              type={banner.type}
              showIcon
              style={{ borderRadius: 8 }}
            />
          </Col>
        ))}
      </Row>
    );
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const { faqs, articles, total } = searchResults;

    if (total === 0) {
      return (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text>No results found for "{searchQuery}"</Text>
                <br />
                <Text type="secondary">Try different keywords or contact support</Text>
              </div>
            }
          >
            <Button type="primary" icon={<CustomerServiceOutlined />}>
              Contact Support
            </Button>
          </Empty>
        </Card>
      );
    }

    return (
      <div>
        <Title level={3}>Search Results ({total})</Title>
        
        {faqs.length > 0 && (
          <Card title="FAQs" style={{ marginBottom: 16 }}>
            <Collapse ghost>
              {faqs.map(faq => (
                <Panel
                  header={faq.question}
                  key={faq.id}
                  extra={<Tag color="blue">FAQ</Tag>}
                >
                  <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </Panel>
              ))}
            </Collapse>
          </Card>
        )}

        {articles.length > 0 && (
          <Card title="Help Articles">
            <List
              dataSource={articles}
              renderItem={article => (
                <List.Item
                  actions={[
                    <Button 
                      type="link" 
                      icon={<ArrowRightOutlined />}
                      onClick={() => navigate(`/help/${article.slug}`)}
                    >
                      Read More
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar icon={<BookOutlined />} />}
                    title={article.title}
                    description={
                      <div>
                        <Text ellipsis>{article.content?.substring(0, 150)}...</Text>
                        <br />
                        <Text type="secondary">
                          <ClockCircleOutlined /> {new Date(article.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}
      </div>
    );
  };

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
        <Card style={{ marginBottom: 24, textAlign: 'center' }}>
          <Title level={1}>
            <CustomerServiceOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            Help Center
          </Title>
          <Paragraph style={{ fontSize: 16 }}>
            Find answers to your questions and get the help you need
          </Paragraph>
          
          {/* Search */}
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <AutoComplete
              style={{ width: '100%' }}
              options={searchSuggestions.map(suggestion => ({ value: suggestion }))}
              onSearch={(value) => setSearchSuggestions(generateSearchSuggestions(value))}
              onSelect={handleSearch}
              value={searchQuery}
              onChange={setSearchQuery}
            >
              <Input.Search
                placeholder="Search for help..."
                size="large"
                loading={searchLoading}
                onSearch={handleSearch}
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    Search
                  </Button>
                }
              />
            </AutoComplete>
          </div>
        </Card>

        {/* Banners */}
        {renderBanners()}

        {/* Search Results */}
        {searchResults ? renderSearchResults() : (
          <>
            {/* Categories */}
            <Card 
              title={
                <Space>
                  <BulbOutlined />
                  Browse by Category
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                {categories.map(category => (
                  <Col xs={24} sm={12} md={6} key={category.id}>
                    <Card
                      hoverable
                      style={{ textAlign: 'center', height: '100%' }}
                      onClick={() => navigate(`/help/category/${category.slug}`)}
                    >
                      <div style={{ fontSize: 32, color: category.color, marginBottom: 8 }}>
                        {getCategoryIcon(category.icon)}
                      </div>
                      <Title level={4}>{category.name}</Title>
                      <Text type="secondary">{category.description}</Text>
                      <br />
                      <Badge 
                        count={category.articleCount} 
                        style={{ backgroundColor: category.color }} 
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Popular Articles */}
            {popularArticles.length > 0 && (
              <Card 
                title={
                  <Space>
                    <BookOutlined />
                    Popular Articles
                  </Space>
                }
                style={{ marginBottom: 24 }}
              >
                <Row gutter={[16, 16]}>
                  {popularArticles.map(article => (
                    <Col xs={24} md={12} key={article.id}>
                      <Card
                        size="small"
                        hoverable
                        onClick={() => {
                          handleArticleView(article.id);
                          navigate(`/help/${article.slug}`);
                        }}
                        style={{
                          border: viewedArticles.has(article.id) ? '2px solid #52c41a' : undefined
                        }}
                      >
                        <Space align="start">
                          <Avatar 
                            icon={<BookOutlined />}
                            style={{
                              backgroundColor: viewedArticles.has(article.id) ? '#52c41a' : '#1890ff'
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <Space>
                              <Title level={5} style={{ margin: 0 }}>
                                {article.title}
                              </Title>
                              {viewedArticles.has(article.id) && (
                                <Tag color="success">
                                  <CheckCircleOutlined /> Read
                                </Tag>
                              )}
                            </Space>
                            <Text type="secondary">
                              <ClockCircleOutlined /> {new Date(article.createdAt).toLocaleDateString()}
                              {article.views && (
                                <>
                                  <Divider type="vertical" />
                                  <EyeOutlined /> {article.views} views
                                </>
                              )}
                              <Divider type="vertical" />
                              <BulbOutlined />
                              <Rate 
                                disabled 
                                defaultValue={4.5} 
                                style={{ fontSize: 12 }}
                              />
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}

            {/* Enhanced Frequently Asked Questions */}
            <Card 
              title={
                <Space>
                  <QuestionCircleOutlined />
                  Frequently Asked Questions
                  <Badge count={faqs.length} style={{ backgroundColor: '#1890ff' }} />
                </Space>
              }
              extra={
                <Select
                  placeholder="Filter by category"
                  style={{ width: 200 }}
                  allowClear
                  value={selectedCategory}
                  onChange={handleCategoryFilter}
                >
                  {categories.map(category => (
                    <Select.Option key={category.slug} value={category.slug}>
                      {category.name}
                    </Select.Option>
                  ))}
                </Select>
              }
              style={{ marginBottom: 24 }}
            >
              {faqs.length > 0 ? (
                <div>
                  {faqs.map(faq => (
                    <Card 
                      key={faq.id}
                      size="small"
                      style={{ marginBottom: 12 }}
                      title={
                        <div 
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleFAQExpand(faq.id)}
                        >
                          <Space>
                            <QuestionCircleOutlined />
                            {faq.question}
                            <Tag color={faq.category === 'general' ? 'blue' : 'green'}>
                              {faq.category}
                            </Tag>
                          </Space>
                        </div>
                      }
                      extra={
                        expandedFAQs.has(faq.id) ? (
                          <Space>
                            <Text type="secondary">Was this helpful?</Text>
                            <Button 
                              type="text" 
                              icon={<LikeOutlined />}
                              size="small"
                              style={{ 
                                color: userFeedback[faq.id]?.helpful === true ? '#52c41a' : undefined 
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFAQFeedback(faq.id, true);
                              }}
                            >
                              Yes
                            </Button>
                            <Button 
                              type="text" 
                              size="small"
                              style={{ 
                                color: userFeedback[faq.id]?.helpful === false ? '#ff4d4f' : undefined 
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFAQFeedback(faq.id, false);
                              }}
                            >
                              No
                            </Button>
                          </Space>
                        ) : (
                          <Space>
                            <EyeOutlined />
                            <Text type="secondary">Click to expand</Text>
                          </Space>
                        )
                      }
                    >
                      {expandedFAQs.has(faq.id) && (
                        <div>
                          <div 
                            dangerouslySetInnerHTML={{ __html: faq.answer }} 
                            style={{ marginBottom: 16 }}
                          />
                          <div style={{ 
                            background: '#f5f5f5', 
                            padding: 12, 
                            borderRadius: 6,
                            fontSize: '12px',
                            color: '#666'
                          }}>
                            <Space>
                              <ClockCircleOutlined />
                              Last updated: {new Date(faq.updatedAt).toLocaleDateString()}
                              {userFeedback[faq.id] && (
                                <>
                                  <Divider type="vertical" />
                                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                  Thank you for your feedback!
                                </>
                              )}
                            </Space>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <Empty 
                  description="No FAQs available yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ padding: '40px 0' }}
                >
                  <Button type="primary" icon={<CustomerServiceOutlined />}>
                    Contact Support
                  </Button>
                </Empty>
              )}
            </Card>

            {/* Help Center Analytics & User Insights */}
            <Card 
              title={
                <Space>
                  <BarChartOutlined />
                  Your Help Center Activity
                </Space>
              }
              style={{ marginBottom: 24 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="Articles Read"
                      value={viewedArticles.size}
                      prefix={<BookOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="FAQs Explored"
                      value={expandedFAQs.size}
                      prefix={<QuestionCircleOutlined />}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="Feedback Given"
                      value={Object.keys(userFeedback).length}
                      prefix={<LikeOutlined />}
                      valueStyle={{ color: '#faad14' }}
                    />
                  </Card>
                </Col>
                <Col xs={12} sm={6}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="Help Score"
                      value={Math.round(((Object.keys(userFeedback).length + viewedArticles.size) / Math.max(faqs.length + popularArticles.length, 1)) * 100)}
                      suffix="%"
                      prefix={<RocketOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>
              
              {/* User feedback summary */}
              {Object.keys(userFeedback).length > 0 && (
                <Alert
                  style={{ marginTop: 16 }}
                  message="Thank you for your feedback!"
                  description={`You've provided feedback on ${Object.keys(userFeedback).length} FAQ${Object.keys(userFeedback).length > 1 ? 's' : ''}. Your input helps us improve our help content.`}
                  type="success"
                  showIcon
                  icon={<CheckCircleOutlined />}
                />
              )}

              {/* Quick action suggestions */}
              <div style={{ marginTop: 16 }}>
                <Title level={5}>
                  <BulbOutlined style={{ color: '#faad14' }} /> Suggested Actions
                </Title>
                <Space wrap>
                  {viewedArticles.size === 0 && (
                    <Tag color="blue" style={{ cursor: 'pointer' }}>
                      <ArrowRightOutlined /> Read Popular Articles
                    </Tag>
                  )}
                  {expandedFAQs.size < 3 && faqs.length > 0 && (
                    <Tag color="green" style={{ cursor: 'pointer' }}>
                      <ArrowRightOutlined /> Explore More FAQs
                    </Tag>
                  )}
                  {Object.keys(userFeedback).length === 0 && (
                    <Tag color="orange" style={{ cursor: 'pointer' }}>
                      <ArrowRightOutlined /> Provide Feedback
                    </Tag>
                  )}
                  <Tag color="purple" style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')}>
                    <ArrowRightOutlined /> Try Search
                  </Tag>
                </Space>
              </div>
            </Card>

            {/* Contact Support */}
            <Card title="Still Need Help?">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <PhoneOutlined style={{ fontSize: 24, color: '#1890ff', marginBottom: 8 }} />
                    <Title level={4}>Call Us</Title>
                    <Text>+1 (555) 123-4567</Text>
                    <br />
                    <Text type="secondary">Mon-Fri 9AM-6PM</Text>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <MailOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                    <Title level={4}>Email Support</Title>
                    <Text>support@groow.com</Text>
                    <br />
                    <Text type="secondary">24/7 Response</Text>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <CustomerServiceOutlined style={{ fontSize: 24, color: '#faad14', marginBottom: 8 }} />
                    <Title level={4}>Live Chat</Title>
                    <Button type="primary">Start Chat</Button>
                    <br />
                    <Text type="secondary">Available Now</Text>
                  </Card>
                </Col>
              </Row>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default HelpCenterPage;