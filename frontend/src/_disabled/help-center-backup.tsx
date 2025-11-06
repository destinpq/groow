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
  Skeleton,
  Badge,
  Rate,
  Tooltip,
  AutoComplete,
  List,
  Avatar,
  Divider,
  Statistic,
  Timeline
} from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  ShoppingOutlined,
  UserOutlined,
  SafetyOutlined,
  RocketOutlined,
  LikeOutlined,
  DislikeOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  TagsOutlined,
  FileTextOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  MailOutlined,
  BookOutlined,
  StarOutlined,
  CommentOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BulbOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { helpAPI, faqAPI, helpCategoriesAPI, supportTicketsAPI, helpAnalyticsAPI } from '../services/api/help';
import type { HelpArticle, FAQ, HelpCategory, HelpAnalytics } from '../services/api/help';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = AutoComplete;

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  
  // Data states
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [popularArticles, setPopularArticles] = useState<HelpArticle[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [analytics, setAnalytics] = useState<HelpAnalytics | null>(null);
  const [searchResults, setSearchResults] = useState<{
    articles: HelpArticle[];
    faqs: FAQ[];
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
        popularRes,
        faqsRes,
        analyticsRes
      ] = await Promise.all([
        helpCategoriesAPI.getCategories({ withStats: true, activeOnly: true }),
        helpAPI.getArticles({ limit: 6, sort: 'popular' }),
        faqAPI.getFAQs({ limit: 6, featured: true, sort: 'popular' }),
        helpAnalyticsAPI.getAnalytics()
      ]);

      setCategories(categoriesRes.data || []);
      setPopularArticles(popularRes.data?.data || []);
      setFaqs(faqsRes.data?.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (error) {
      console.error('Error loading help center data:', error);
      message.error('Failed to load help center data');
      
      // Fallback data
      setCategories([
        {
          id: '1',
          name: 'Getting Started',
          description: 'Learn the basics of using our platform',
          icon: 'ShoppingOutlined',
          color: '#1890ff',
          articleCount: 12,
          order: 1,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'getting-started' }
        },
        {
          id: '2',
          name: 'Account Management',
          description: 'Manage your account and preferences',
          icon: 'UserOutlined',
          color: '#52c41a',
          articleCount: 8,
          order: 2,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'account-management' }
        },
        {
          id: '3',
          name: 'Security & Privacy',
          description: 'Keep your account safe and secure',
          icon: 'SafetyOutlined',
          color: '#faad14',
          articleCount: 6,
          order: 3,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'security-privacy' }
        },
        {
          id: '4',
          name: 'Vendor Guide',
          description: 'Resources for sellers on our platform',
          icon: 'RocketOutlined',
          color: '#722ed1',
          articleCount: 15,
          order: 4,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'vendor-guide' }
        }
      ]);
      
      setPopularArticles([
        {
          id: '1',
          title: 'How to place an order?',
          content: 'Step-by-step guide to placing your first order...',
          category: 'Getting Started',
          categoryId: '1',
          author: 'Support Team',
          authorId: 'support',
          tags: ['order', 'getting-started', 'purchase'],
          views: 2847,
          helpfulVotes: 245,
          totalVotes: 267,
          isPublished: true,
          isFeatured: true,
          difficulty: 'beginner',
          estimatedReadTime: 3,
          lastUpdated: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01'),
          relatedArticles: ['2', '3'],
          attachments: [],
          metadata: {}
        },
        {
          id: '2',
          title: 'Payment methods accepted',
          content: 'Learn about all available payment options...',
          category: 'Getting Started',
          categoryId: '1',
          author: 'Support Team',
          authorId: 'support',
          tags: ['payment', 'billing', 'cards'],
          views: 2134,
          helpfulVotes: 198,
          totalVotes: 214,
          isPublished: true,
          isFeatured: true,
          difficulty: 'beginner',
          estimatedReadTime: 2,
          lastUpdated: new Date('2024-01-10'),
          createdAt: new Date('2024-01-01'),
          relatedArticles: ['1', '4'],
          attachments: [],
          metadata: {}
        }
      ]);
      
      setFaqs([
        {
          id: '1',
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3-5 business days. Express shipping is available for 1-2 day delivery.',
          category: 'Shipping',
          categoryId: '1',
          order: 1,
          views: 1845,
          helpfulVotes: 156,
          totalVotes: 172,
          isPublished: true,
          isFeatured: true,
          tags: ['shipping', 'delivery', 'timeline'],
          relatedFAQs: ['2', '4'],
          lastUpdated: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for most items. Products must be in original condition with tags attached.',
          category: 'Returns',
          categoryId: '1',
          order: 2,
          views: 1623,
          helpfulVotes: 142,
          totalVotes: 158,
          isPublished: true,
          isFeatured: true,
          tags: ['returns', 'refund', 'policy'],
          relatedFAQs: ['1', '3'],
          lastUpdated: new Date('2024-01-12'),
          createdAt: new Date('2024-01-01')
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search suggestions
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchSuggestions([]);
      setSearchResults(null);
      return;
    }

    try {
      const suggestions = await helpAnalyticsAPI.getSearchSuggestions(value);
      setSearchSuggestions(suggestions.data || []);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
    }
  };

  // Perform actual search
  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      setSearchLoading(true);
      const response = await helpAPI.searchArticles(query);
      const faqResponse = await faqAPI.searchFAQs(query);
      
      setSearchResults({
        articles: response.data?.articles || [],
        faqs: faqResponse.data || [],
        total: (response.data?.articles?.length || 0) + (faqResponse.data?.length || 0)
      });

      // Track search
      await helpAnalyticsAPI.trackSearch(
        query, 
        (response.data?.articles?.length || 0) + (faqResponse.data?.length || 0)
      );
    } catch (error) {
      console.error('Error performing search:', error);
      message.error('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle article click
  const handleArticleClick = async (article: HelpArticle) => {
    try {
      await helpAPI.trackView(article.id);
      navigate(`/help/articles/${article.id}`);
    } catch (error) {
      console.error('Error tracking article view:', error);
      navigate(`/help/articles/${article.id}`);
    }
  };

  // Handle category click
  const handleCategoryClick = (category: HelpCategory) => {
    navigate(`/help/categories/${category.metadata.slug}`);
  };

  // Vote on article
  const handleVote = async (articleId: string, helpful: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await helpAPI.voteArticle(articleId, helpful);
      message.success('Thank you for your feedback!');
      // Reload popular articles to reflect updated votes
      const popularRes = await helpAPI.getArticles({ limit: 6, sort: 'popular' });
      setPopularArticles(popularRes.data?.data || []);
    } catch (error) {
      console.error('Error voting on article:', error);
      message.error('Failed to submit vote');
    }
  };

  // Vote on FAQ
  const handleFAQVote = async (faqId: string, helpful: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await faqAPI.voteFAQ(faqId, helpful);
      message.success('Thank you for your feedback!');
      // Reload FAQs to reflect updated votes
      const faqsRes = await faqAPI.getFAQs({ limit: 6, featured: true, sort: 'popular' });
      setFaqs(faqsRes.data?.data || []);
    } catch (error) {
      console.error('Error voting on FAQ:', error);
      message.error('Failed to submit vote');
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'ShoppingOutlined': <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
      'UserOutlined': <UserOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
      'SafetyOutlined': <SafetyOutlined style={{ fontSize: 32, color: '#faad14' }} />,
      'RocketOutlined': <RocketOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
    };
    return iconMap[iconName] || <QuestionCircleOutlined style={{ fontSize: 32, color: '#666' }} />;
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active />
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Skeleton.Button active style={{ width: '100%', height: 200 }} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Hero Section with Search */}
      <Card style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', marginBottom: 24, border: 'none' }}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <QuestionCircleOutlined style={{ fontSize: 64, color: 'white', marginBottom: 16 }} />
          <Title level={1} style={{ color: 'white', marginBottom: 8 }}>
            How can we help you?
          </Title>
          <Text style={{ color: 'white', fontSize: 16, display: 'block', marginBottom: 24 }}>
            Search our knowledge base or browse categories below
          </Text>
          
          <AutoComplete
            style={{ maxWidth: 600, margin: '0 auto', width: '100%' }}
            value={searchQuery}
            options={searchSuggestions.map(suggestion => ({ value: suggestion }))}
            onSearch={handleSearch}
            onSelect={(value) => {
              setSearchQuery(value);
              performSearch(value);
            }}
            onChange={setSearchQuery}
          >
            <Input
              size="large"
              placeholder="Search for help articles, FAQs..."
              prefix={<SearchOutlined />}
              suffix={
                <Button 
                  type="primary" 
                  onClick={() => performSearch(searchQuery)}
                  loading={searchLoading}
                  style={{ border: 'none', boxShadow: 'none' }}
                >
                  Search
                </Button>
              }
              onPressEnter={() => performSearch(searchQuery)}
            />
          </AutoComplete>
          
          {analytics && (
            <Row gutter={16} style={{ marginTop: 24, justifyContent: 'center' }}>
              <Col>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Total Articles</span>}
                  value={analytics.categoryStats.reduce((sum, cat) => sum + cat.articlesCount, 0)}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
              <Col>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Avg Satisfaction</span>}
                  value={analytics.ticketStats.satisfactionScore}
                  precision={1}
                  suffix={<StarOutlined />}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
              <Col>
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>Support Tickets</span>}
                  value={analytics.ticketStats.total}
                  valueStyle={{ color: 'white' }}
                />
              </Col>
            </Row>
          )}
        </div>
      </Card>

      {/* Search Results */}
      {searchResults && (
        <Card style={{ marginBottom: 24 }}>
          <Title level={4}>
            Search Results ({searchResults.total} found)
          </Title>
          
          {searchResults.total === 0 ? (
            <Empty description="No results found. Try different keywords or browse categories below." />
          ) : (
            <>
              {/* Article Results */}
              {searchResults.articles.length > 0 && (
                <>
                  <Title level={5}>
                    <FileTextOutlined /> Articles ({searchResults.articles.length})
                  </Title>
                  <List
                    dataSource={searchResults.articles}
                    renderItem={(article) => (
                      <List.Item
                        key={article.id}
                        onClick={() => handleArticleClick(article)}
                        style={{ cursor: 'pointer', padding: '12px 0' }}
                        actions={[
                          <span key="views">
                            <EyeOutlined /> {article.views}
                          </span>,
                          <span key="rating">
                            <Rate disabled value={article.helpfulVotes / article.totalVotes * 5} />
                          </span>
                        ]}
                      >
                        <List.Item.Meta
                          title={<Text strong>{article.title}</Text>}
                          description={
                            <Space direction="vertical" size="small">
                              <Text type="secondary">{article.content.substring(0, 150)}...</Text>
                              <Space>
                                <Tag color="blue">{article.category}</Tag>
                                <Tag color="green">{article.difficulty}</Tag>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  <ClockCircleOutlined /> {article.estimatedReadTime} min read
                                </Text>
                              </Space>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                  <Divider />
                </>
              )}

              {/* FAQ Results */}
              {searchResults.faqs.length > 0 && (
                <>
                  <Title level={5}>
                    <QuestionCircleOutlined /> FAQs ({searchResults.faqs.length})
                  </Title>
                  <Collapse ghost>
                    {searchResults.faqs.map((faq) => (
                      <Panel 
                        key={faq.id}
                        header={
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>{faq.question}</Text>
                            <Space>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                <EyeOutlined /> {faq.views}
                              </Text>
                              <Rate disabled value={faq.helpfulVotes / faq.totalVotes * 5} style={{ fontSize: '12px' }} />
                            </Space>
                          </div>
                        }
                      >
                        <Paragraph style={{ marginBottom: 16 }}>{faq.answer}</Paragraph>
                        <Space>
                          <Text type="secondary">Was this helpful?</Text>
                          <Button 
                            size="small" 
                            icon={<LikeOutlined />}
                            onClick={(e) => handleFAQVote(faq.id, true, e)}
                          >
                            Yes ({faq.helpfulVotes})
                          </Button>
                          <Button 
                            size="small" 
                            icon={<DislikeOutlined />}
                            onClick={(e) => handleFAQVote(faq.id, false, e)}
                          >
                            No ({faq.totalVotes - faq.helpfulVotes})
                          </Button>
                        </Space>
                      </Panel>
                    ))}
                  </Collapse>
                </>
              )}
            </>
          )}
        </Card>
      )}

      {/* Categories */}
      <Title level={3} style={{ marginBottom: 16 }}>
        <BookOutlined /> Browse by Category
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {categories.map((category) => (
          <Col xs={24} sm={12} lg={6} key={category.id}>
            <Card 
              hoverable 
              style={{ height: '100%', textAlign: 'center' }}
              onClick={() => handleCategoryClick(category)}
            >
              <div style={{ marginBottom: 16 }}>{getCategoryIcon(category.icon)}</div>
              <Title level={5} style={{ marginBottom: 8 }}>
                {category.name}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                {category.description}
              </Text>
              <Tag color="blue">{category.articleCount} articles</Tag>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Popular Articles */}
      <Title level={3} style={{ marginBottom: 16 }}>
        <ThunderboltOutlined /> Popular Articles
      </Title>
      <Card style={{ marginBottom: 32 }}>
        <List
          dataSource={popularArticles}
          renderItem={(article) => (
            <List.Item
              key={article.id}
              onClick={() => handleArticleClick(article)}
              style={{ cursor: 'pointer', padding: '16px 0' }}
              actions={[
                <Space key="actions">
                  <Tooltip title="Helpful votes">
                    <Button 
                      size="small" 
                      icon={<LikeOutlined />}
                      onClick={(e) => handleVote(article.id, true, e)}
                    >
                      {article.helpfulVotes}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Not helpful votes">
                    <Button 
                      size="small" 
                      icon={<DislikeOutlined />}
                      onClick={(e) => handleVote(article.id, false, e)}
                    >
                      {article.totalVotes - article.helpfulVotes}
                    </Button>
                  </Tooltip>
                </Space>
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar style={{ backgroundColor: '#1890ff' }}>
                    <FileTextOutlined />
                  </Avatar>
                }
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 16 }}>{article.title}</Text>
                    <Badge 
                      count={article.views.toLocaleString()} 
                      style={{ backgroundColor: '#52c41a' }}
                      title="Views"
                    />
                  </div>
                }
                description={
                  <Space direction="vertical" size="small">
                    <Space wrap>
                      <Tag color="blue">{article.category}</Tag>
                      <Tag color="green">{article.difficulty}</Tag>
                      {article.tags.slice(0, 2).map(tag => (
                        <Tag key={tag} color="orange">{tag}</Tag>
                      ))}
                    </Space>
                    <Space>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        <ClockCircleOutlined /> {article.estimatedReadTime} min read
                      </Text>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Updated {article.lastUpdated.toLocaleDateString()}
                      </Text>
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Quick FAQs */}
      <Title level={3} style={{ marginBottom: 16 }}>
        <BulbOutlined /> Quick Answers
      </Title>
      <Card style={{ marginBottom: 32 }}>
        <Collapse accordion ghost>
          {faqs.map((faq) => (
            <Panel 
              key={faq.id}
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{faq.question}</Text>
                  <Space>
                    <Badge count={faq.views} style={{ backgroundColor: '#1890ff' }} title="Views" />
                    <Rate disabled value={faq.helpfulVotes / faq.totalVotes * 5} style={{ fontSize: '12px' }} />
                  </Space>
                </div>
              }
            >
              <Paragraph style={{ marginBottom: 16 }}>{faq.answer}</Paragraph>
              <Space wrap style={{ marginBottom: 16 }}>
                {faq.tags.map(tag => (
                  <Tag key={tag} color="purple">{tag}</Tag>
                ))}
              </Space>
              <Divider style={{ margin: '16px 0' }} />
              <Space>
                <Text type="secondary">Was this helpful?</Text>
                <Button 
                  size="small" 
                  icon={<LikeOutlined />}
                  onClick={(e) => handleFAQVote(faq.id, true, e)}
                >
                  Yes ({faq.helpfulVotes})
                </Button>
                <Button 
                  size="small" 
                  icon={<DislikeOutlined />}
                  onClick={(e) => handleFAQVote(faq.id, false, e)}
                >
                  No ({faq.totalVotes - faq.helpfulVotes})
                </Button>
              </Space>
            </Panel>
          ))}
        </Collapse>
      </Card>

      {/* Contact Support */}
      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card style={{ background: '#f5f5f5' }}>
            <Title level={4}>
              <CustomerServiceOutlined /> Still need help?
            </Title>
            <Text style={{ display: 'block', marginBottom: 16 }}>
              Can't find what you're looking for? Our support team is here to help.
            </Text>
            <Space wrap>
              <Button 
                type="primary" 
                size="large"
                icon={<CommentOutlined />}
                onClick={() => navigate('/support/create-ticket')}
              >
                Create Support Ticket
              </Button>
              <Button 
                size="large"
                icon={<CustomerServiceOutlined />}
                onClick={() => navigate('/support/live-chat')}
              >
                Live Chat
              </Button>
              <Button 
                size="large"
                icon={<PhoneOutlined />}
                onClick={() => navigate('/contact')}
              >
                Call Support
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card>
            <Title level={5}>
              <MailOutlined /> Contact Information
            </Title>
            <Timeline>
              <Timeline.Item dot={<PhoneOutlined />}>
                <Text strong>Phone Support</Text>
                <br />
                <Text type="secondary">1-800-GROOW-HELP</Text>
                <br />
                <Text type="secondary">Mon-Fri 9AM-6PM EST</Text>
              </Timeline.Item>
              <Timeline.Item dot={<MailOutlined />}>
                <Text strong>Email Support</Text>
                <br />
                <Text type="secondary">help@groow.com</Text>
                <br />
                <Text type="secondary">Response within 24 hours</Text>
              </Timeline.Item>
              <Timeline.Item dot={<CustomerServiceOutlined />}>
                <Text strong>Live Chat</Text>
                <br />
                <Text type="secondary">Available 24/7</Text>
                <br />
                <Badge status="processing" text="Online now" />
              </Timeline.Item>
            </Timeline>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HelpCenterPage;
