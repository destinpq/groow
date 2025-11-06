import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Typography, 
  Divider, 
  Collapse, 
  Input, 
  Button,
  Space,
  Tag,
  Rate,
  Spin,
  message,
  Empty,
  Skeleton,
  AutoComplete,
  List,
  Avatar,
  Badge,
  Tooltip,
  Statistic
} from 'antd';
import { 
  SearchOutlined, 
  QuestionCircleOutlined,
  LikeOutlined,
  DislikeOutlined,
  EyeOutlined,
  CustomerServiceOutlined,
  PhoneOutlined,
  MailOutlined,
  CommentOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  TagsOutlined,
  ThunderboltOutlined,
  BulbOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { faqAPI, helpCategoriesAPI, helpAnalyticsAPI } from '../services/api/help';
import type { FAQ, HelpCategory } from '../services/api/help';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Option } = AutoComplete;

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'helpful'>('popular');
  
  // Data states
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<HelpCategory[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [searchResults, setSearchResults] = useState<FAQ[]>([]);
  const [featuredFaqs, setFeaturedFaqs] = useState<FAQ[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter FAQs when category or sort changes
  useEffect(() => {
    filterFaqs();
  }, [faqs, selectedCategory, sortBy]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [
        faqsRes,
        categoriesRes,
        featuredRes
      ] = await Promise.all([
        faqAPI.getFAQs({ page: 1, limit: 50, sort: sortBy }),
        helpCategoriesAPI.getCategories({ withStats: true, activeOnly: true }),
        faqAPI.getFAQs({ featured: true, limit: 6, sort: 'helpful' })
      ]);

      setFaqs(faqsRes.data?.data || []);
      setTotal(faqsRes.data?.total || 0);
      setCategories(categoriesRes.data || []);
      setFeaturedFaqs(featuredRes.data?.data || []);
    } catch (error) {
      console.error('Error loading FAQ data:', error);
      message.error('Failed to load FAQ data');
      
      // Fallback data
      setFaqs([
        {
          id: '1',
          question: 'How can I track my order?',
          answer: 'You can track your order by logging into your account and visiting the "My Orders" section. Click on the order you want to track to see real-time status updates and tracking information.',
          category: 'Orders & Shipping',
          categoryId: '1',
          order: 1,
          views: 2847,
          helpfulVotes: 245,
          totalVotes: 267,
          isPublished: true,
          isFeatured: true,
          tags: ['orders', 'tracking', 'shipping'],
          relatedFAQs: ['2', '3'],
          lastUpdated: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, digital wallets, and Cash on Delivery (COD) for eligible orders.',
          category: 'Payments',
          categoryId: '2',
          order: 1,
          views: 2134,
          helpfulVotes: 198,
          totalVotes: 214,
          isPublished: true,
          isFeatured: true,
          tags: ['payments', 'cards', 'methods'],
          relatedFAQs: ['1', '3'],
          lastUpdated: new Date('2024-01-12'),
          createdAt: new Date('2024-01-01')
        }
      ]);
      
      setCategories([
        {
          id: '1',
          name: 'Orders & Shipping',
          description: 'Track orders, shipping information',
          icon: 'ShoppingOutlined',
          color: '#1890ff',
          articleCount: 8,
          order: 1,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'orders-shipping' }
        },
        {
          id: '2',
          name: 'Payments',
          description: 'Payment methods, security',
          icon: 'CreditCardOutlined',
          color: '#52c41a',
          articleCount: 6,
          order: 2,
          isActive: true,
          parentId: undefined,
          metadata: { slug: 'payments' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = [...faqs];
    
    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.categoryId === selectedCategory);
    }
    
    // Sort FAQs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'popular':
          return b.views - a.views;
        case 'helpful':
          const aRating = a.totalVotes > 0 ? a.helpfulVotes / a.totalVotes : 0;
          const bRating = b.totalVotes > 0 ? b.helpfulVotes / b.totalVotes : 0;
          return bRating - aRating;
        default:
          return 0;
      }
    });
    
    setFilteredFaqs(filtered);
  };

  // Handle search suggestions
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setSearchSuggestions([]);
      setSearchResults([]);
      return;
    }

    try {
      const suggestions = await helpAnalyticsAPI.getSearchSuggestions(value);
      setSearchSuggestions(suggestions.data || []);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
    }
  };

  // Perform FAQ search
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await faqAPI.searchFAQs(query);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching FAQs:', error);
      message.error('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Vote on FAQ
  const handleVote = async (faqId: string, helpful: boolean, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      await faqAPI.voteFAQ(faqId, helpful);
      message.success('Thank you for your feedback!');
      
      // Update the FAQ in state
      const updateFaqs = (faqList: FAQ[]) => 
        faqList.map(faq => {
          if (faq.id === faqId) {
            return {
              ...faq,
              helpfulVotes: helpful ? faq.helpfulVotes + 1 : faq.helpfulVotes,
              totalVotes: faq.totalVotes + 1
            };
          }
          return faq;
        });
      
      setFaqs(updateFaqs);
      setFilteredFaqs(updateFaqs);
      setSearchResults(updateFaqs);
      setFeaturedFaqs(updateFaqs);
    } catch (error) {
      console.error('Error voting on FAQ:', error);
      message.error('Failed to submit vote');
    }
  };

  // Group FAQs by category for display
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQ[]>);

  if (loading) {
    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        <Skeleton active />
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {[1, 2, 3].map((i) => (
            <Col span={8} key={i}>
              <Skeleton.Button active style={{ width: '100%', height: 120 }} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <QuestionCircleOutlined style={{ fontSize: 64, color: '#FF9900', marginBottom: 16 }} />
        <Title level={1}>Frequently Asked Questions</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Find answers to common questions about shopping, shipping, returns, and more
        </Paragraph>

        {/* Search */}
        <AutoComplete
          style={{ maxWidth: 600, marginTop: 24, width: '100%' }}
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
            placeholder="Search FAQs..."
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

        {/* Quick Stats */}
        <Row gutter={16} style={{ marginTop: 24, justifyContent: 'center' }}>
          <Col>
            <Statistic title="Total FAQs" value={total} />
          </Col>
          <Col>
            <Statistic title="Categories" value={categories.length} />
          </Col>
          <Col>
            <Statistic 
              title="Avg. Helpfulness" 
              value={
                filteredFaqs.length > 0 
                  ? filteredFaqs.reduce((sum, faq) => sum + (faq.totalVotes > 0 ? faq.helpfulVotes / faq.totalVotes : 0), 0) / filteredFaqs.length
                  : 0
              }
              precision={1}
              suffix="%"
            />
          </Col>
        </Row>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <Title level={4}>
            <SearchOutlined /> Search Results ({searchResults.length} found)
          </Title>
          <Collapse ghost>
            {searchResults.map((faq) => (
              <Panel 
                key={faq.id}
                header={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>{faq.question}</Text>
                      <div style={{ marginTop: 4 }}>
                        <Tag color="blue">{faq.category}</Tag>
                        <Badge count={faq.views} style={{ backgroundColor: '#1890ff', marginLeft: 8 }} />
                      </div>
                    </div>
                    <Rate disabled value={faq.helpfulVotes / faq.totalVotes * 5} />
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
                    onClick={(e) => handleVote(faq.id, true, e)}
                  >
                    Yes ({faq.helpfulVotes})
                  </Button>
                  <Button 
                    size="small" 
                    icon={<DislikeOutlined />}
                    onClick={(e) => handleVote(faq.id, false, e)}
                  >
                    No ({faq.totalVotes - faq.helpfulVotes})
                  </Button>
                </Space>
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}

      {/* Featured FAQs */}
      {featuredFaqs.length > 0 && (
        <Card style={{ marginBottom: 32 }}>
          <Title level={4}>
            <StarOutlined /> Most Helpful FAQs
          </Title>
          <Row gutter={[16, 16]}>
            {featuredFaqs.map((faq) => (
              <Col xs={24} md={12} lg={8} key={faq.id}>
                <Card size="small" hoverable>
                  <div style={{ marginBottom: 8 }}>
                    <Text strong style={{ fontSize: '14px' }}>{faq.question}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: 8 }}>
                    {faq.answer.substring(0, 100)}...
                  </Text>
                  <Space>
                    <Tag color="blue" style={{ fontSize: '10px' }}>{faq.category}</Tag>
                    <Badge count={faq.views} style={{ backgroundColor: '#52c41a' }} />
                    <Rate disabled value={faq.helpfulVotes / faq.totalVotes * 5} style={{ fontSize: '10px' }} />
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* Filters and Sort */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space wrap>
              <Text strong>Filter by Category:</Text>
              <Button 
                type={selectedCategory === '' ? 'primary' : 'default'}
                size="small"
                onClick={() => setSelectedCategory('')}
              >
                All Categories
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  type={selectedCategory === category.id ? 'primary' : 'default'}
                  size="small"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.articleCount})
                </Button>
              ))}
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>Sort by:</Text>
              <Button
                type={sortBy === 'popular' ? 'primary' : 'default'}
                size="small"
                icon={<ThunderboltOutlined />}
                onClick={() => setSortBy('popular')}
              >
                Popular
              </Button>
              <Button
                type={sortBy === 'helpful' ? 'primary' : 'default'}
                size="small"
                icon={<BulbOutlined />}
                onClick={() => setSortBy('helpful')}
              >
                Most Helpful
              </Button>
              <Button
                type={sortBy === 'newest' ? 'primary' : 'default'}
                size="small"
                icon={<SortAscendingOutlined />}
                onClick={() => setSortBy('newest')}
              >
                Newest
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* FAQ Categories */}
      {Object.keys(groupedFaqs).length === 0 ? (
        <Empty description="No FAQs found. Try adjusting your filters or search query." />
      ) : (
        Object.entries(groupedFaqs).map(([categoryName, categoryFaqs]) => (
          <div key={categoryName} style={{ marginBottom: 32 }}>
            <Title level={3}>
              {categoryName}
              <Badge count={categoryFaqs.length} style={{ backgroundColor: '#1890ff', marginLeft: 16 }} />
            </Title>
            <Divider />
            <Collapse
              defaultActiveKey={categoryName === Object.keys(groupedFaqs)[0] ? ['0'] : []}
              expandIconPosition="end"
              ghost
            >
              {categoryFaqs.map((faq, qIndex) => (
                <Panel
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong style={{ fontSize: 16 }}>{faq.question}</Text>
                        <div style={{ marginTop: 4 }}>
                          <Space>
                            <Badge count={faq.views} style={{ backgroundColor: '#1890ff' }} />
                            <Rate disabled value={faq.helpfulVotes / faq.totalVotes * 5} />
                          </Space>
                        </div>
                      </div>
                    </div>
                  }
                  key={qIndex}
                  style={{ marginBottom: 8 }}
                >
                  <Paragraph style={{ paddingLeft: 24, fontSize: 15, marginBottom: 16 }}>
                    {faq.answer}
                  </Paragraph>
                  
                  {/* Tags */}
                  <Space wrap style={{ paddingLeft: 24, marginBottom: 16 }}>
                    <TagsOutlined />
                    {faq.tags.map(tag => (
                      <Tag key={tag} color="orange">{tag}</Tag>
                    ))}
                  </Space>
                  
                  <Divider style={{ margin: '16px 0' }} />
                  
                  {/* Voting */}
                  <Space style={{ paddingLeft: 24 }}>
                    <Text type="secondary">Was this helpful?</Text>
                    <Button 
                      size="small" 
                      icon={<LikeOutlined />}
                      onClick={(e) => handleVote(faq.id, true, e)}
                    >
                      Yes ({faq.helpfulVotes})
                    </Button>
                    <Button 
                      size="small" 
                      icon={<DislikeOutlined />}
                      onClick={(e) => handleVote(faq.id, false, e)}
                    >
                      No ({faq.totalVotes - faq.helpfulVotes})
                    </Button>
                  </Space>
                </Panel>
              ))}
            </Collapse>
          </div>
        ))
      )}

      {/* Contact Support */}
      <Card style={{ marginTop: 48, background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>
            <CustomerServiceOutlined /> Still have questions?
          </Title>
          <Paragraph style={{ fontSize: 16 }}>
            Can't find what you're looking for? Our support team is here to help!
          </Paragraph>
          <Row gutter={16} justify="center" style={{ marginTop: 24 }}>
            <Col xs={24} sm={8}>
              <Card hoverable onClick={() => navigate('/support/create-ticket')}>
                <Title level={4}>
                  <MailOutlined /> Email Support
                </Title>
                <Text>support@groow.com</Text>
                <br />
                <Text type="secondary">Response within 24 hours</Text>
                <br />
                <Button type="primary" style={{ marginTop: 8 }}>
                  Create Ticket
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable onClick={() => navigate('/contact')}>
                <Title level={4}>
                  <PhoneOutlined /> Phone Support
                </Title>
                <Text>1-800-GROOW-HELP</Text>
                <br />
                <Text type="secondary">Mon-Fri, 9 AM - 6 PM</Text>
                <br />
                <Button type="primary" style={{ marginTop: 8 }}>
                  Call Now
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable onClick={() => navigate('/support/live-chat')}>
                <Title level={4}>
                  <CommentOutlined /> Live Chat
                </Title>
                <Text>Available 24/7</Text>
                <br />
                <Text type="secondary">Instant responses</Text>
                <br />
                <Button type="primary" style={{ marginTop: 8 }}>
                  Start Chat
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default FAQPage;
