import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Space,
  List,
  Avatar,
  Tag,
  Empty,
  Badge,
  Tooltip,
  message,
  Radio,
  Divider,
} from 'antd';
import {
  SearchOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowUpOutlined,
  HistoryOutlined,
  StarOutlined,
  FireOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface SearchHistory {
  id: number;
  query: string;
  timestamp: string;
  resultsCount: number;
  category?: string;
}

interface TrendingSearch {
  id: number;
  query: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  category: string;
}

interface SuggestedSearch {
  id: number;
  query: string;
  type: 'product' | 'category' | 'brand';
  image?: string;
  productCount?: number;
}

const mockSearchHistory: SearchHistory[] = [
  {
    id: 1,
    query: 'iPhone 16 Pro Max',
    timestamp: dayjs().subtract(1, 'hour').toISOString(),
    resultsCount: 45,
    category: 'Smartphones',
  },
  {
    id: 2,
    query: 'wireless headphones',
    timestamp: dayjs().subtract(3, 'hours').toISOString(),
    resultsCount: 234,
    category: 'Electronics',
  },
  {
    id: 3,
    query: 'laptop under $1000',
    timestamp: dayjs().subtract(1, 'day').toISOString(),
    resultsCount: 89,
    category: 'Computers',
  },
  {
    id: 4,
    query: 'running shoes',
    timestamp: dayjs().subtract(2, 'days').toISOString(),
    resultsCount: 156,
    category: 'Sports',
  },
  {
    id: 5,
    query: 'gaming keyboard',
    timestamp: dayjs().subtract(3, 'days').toISOString(),
    resultsCount: 67,
    category: 'Gaming',
  },
  {
    id: 6,
    query: '4K monitor',
    timestamp: dayjs().subtract(5, 'days').toISOString(),
    resultsCount: 123,
    category: 'Computers',
  },
  {
    id: 7,
    query: 'smart watch',
    timestamp: dayjs().subtract(7, 'days').toISOString(),
    resultsCount: 201,
    category: 'Wearables',
  },
];

const mockTrendingSearches: TrendingSearch[] = [
  {
    id: 1,
    query: 'Black Friday deals',
    count: 15234,
    trend: 'up',
    category: 'Promotions',
  },
  {
    id: 2,
    query: 'iPhone 16 Pro',
    count: 12456,
    trend: 'up',
    category: 'Smartphones',
  },
  {
    id: 3,
    query: 'PlayStation 6',
    count: 9876,
    trend: 'up',
    category: 'Gaming',
  },
  {
    id: 4,
    query: 'MacBook Pro M4',
    count: 8765,
    trend: 'stable',
    category: 'Computers',
  },
  {
    id: 5,
    query: 'AirPods Pro 3',
    count: 7654,
    trend: 'up',
    category: 'Audio',
  },
  {
    id: 6,
    query: 'Samsung Galaxy S25',
    count: 6543,
    trend: 'down',
    category: 'Smartphones',
  },
  {
    id: 7,
    query: 'Nintendo Switch 2',
    count: 5432,
    trend: 'up',
    category: 'Gaming',
  },
  {
    id: 8,
    query: 'OLED TV',
    count: 4321,
    trend: 'stable',
    category: 'Electronics',
  },
];

const mockSuggestedSearches: SuggestedSearch[] = [
  {
    id: 1,
    query: 'Best sellers in Electronics',
    type: 'category',
    image: 'https://via.placeholder.com/40?text=Electronics',
    productCount: 1234,
  },
  {
    id: 2,
    query: 'Apple products',
    type: 'brand',
    image: 'https://via.placeholder.com/40?text=Apple',
    productCount: 567,
  },
  {
    id: 3,
    query: 'Sony WH-1000XM5',
    type: 'product',
    image: 'https://via.placeholder.com/40?text=Sony',
    productCount: 1,
  },
  {
    id: 4,
    query: 'Gaming accessories',
    type: 'category',
    image: 'https://via.placeholder.com/40?text=Gaming',
    productCount: 456,
  },
  {
    id: 5,
    query: 'Samsung smartphones',
    type: 'brand',
    image: 'https://via.placeholder.com/40?text=Samsung',
    productCount: 234,
  },
];

const SearchHistoryPage: React.FC = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(mockSearchHistory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewType, setViewType] = useState<'history' | 'trending' | 'suggested'>('history');

  const handleSearch = (value: string) => {
    if (value.trim()) {
      const newSearch: SearchHistory = {
        id: searchHistory.length + 1,
        query: value,
        timestamp: dayjs().toISOString(),
        resultsCount: Math.floor(Math.random() * 500) + 10,
        category: 'All',
      };
      setSearchHistory([newSearch, ...searchHistory]);
      message.success(`Searching for "${value}"...`);
      // Navigate to search results page
    }
  };

  const handleDeleteHistory = (id: number) => {
    setSearchHistory(searchHistory.filter((h) => h.id !== id));
    message.success('Search history item deleted');
  };

  const handleClearAllHistory = () => {
    setSearchHistory([]);
    message.success('All search history cleared');
  };

  const handleQuickSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  };

  const filteredHistory = searchHistory.filter((h) =>
    h.query.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ArrowUpOutlined style={{ color: '#52c41a' }} />;
    if (trend === 'down') return <ArrowUpOutlined style={{ color: '#ff4d4f', transform: 'rotate(180deg)' }} />;
    return <span style={{ color: '#8c8c8c' }}>—</span>;
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3}>
        <HistoryOutlined style={{ color: '#1890ff' }} /> Search & Discovery
      </Title>
      <Paragraph type="secondary">
        View your search history, trending searches, and personalized suggestions
      </Paragraph>

      <Card style={{ marginBottom: 24 }}>
        <Search
          placeholder="Search products, brands, categories..."
          allowClear
          size="large"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Search
            </Button>
          }
        />
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
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
                <HistoryOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Search History
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {searchHistory.length}
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
                <FireOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Trending Searches
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {mockTrendingSearches.length}
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
                  background: '#f6ffed',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Suggested Searches
                </Text>
                <div>
                  <Text strong style={{ fontSize: 24 }}>
                    {mockSuggestedSearches.length}
                  </Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Row justify="space-between" align="middle">
            <Col>
              <Radio.Group value={viewType} onChange={(e) => setViewType(e.target.value)}>
                <Radio.Button value="history">
                  <HistoryOutlined /> My History
                </Radio.Button>
                <Radio.Button value="trending">
                  <FireOutlined /> Trending
                </Radio.Button>
                <Radio.Button value="suggested">
                  <StarOutlined /> Suggested
                </Radio.Button>
              </Radio.Group>
            </Col>
            {viewType === 'history' && searchHistory.length > 0 && (
              <Col>
                <Button danger onClick={handleClearAllHistory}>
                  Clear All History
                </Button>
              </Col>
            )}
          </Row>

          <Divider style={{ margin: '8px 0' }} />

          {viewType === 'history' && (
            <>
              {filteredHistory.length === 0 ? (
                <Empty
                  description={
                    searchHistory.length === 0
                      ? 'No search history yet'
                      : 'No results found'
                  }
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {searchHistory.length === 0 && (
                    <Button type="primary" icon={<SearchOutlined />}>
                      Start Searching
                    </Button>
                  )}
                </Empty>
              ) : (
                <List
                  dataSource={filteredHistory}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <Button
                          type="link"
                          icon={<SearchOutlined />}
                          onClick={() => handleQuickSearch(item.query)}
                        >
                          Search Again
                        </Button>,
                        <Tooltip title="Delete from history">
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteHistory(item.id)}
                          />
                        </Tooltip>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            icon={<ClockCircleOutlined />}
                            style={{ backgroundColor: '#1890ff' }}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>{item.query}</Text>
                            {item.category && <Tag color="blue">{item.category}</Tag>}
                          </Space>
                        }
                        description={
                          <Space size="large">
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {dayjs(item.timestamp).format('MMM DD, YYYY HH:mm')}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {item.resultsCount} results
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              )}
            </>
          )}

          {viewType === 'trending' && (
            <List
              dataSource={mockTrendingSearches}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      icon={<SearchOutlined />}
                      onClick={() => handleQuickSearch(item.query)}
                    >
                      Search
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} style={{ backgroundColor: '#1890ff' }}>
                        <Avatar
                          icon={<FireOutlined />}
                          style={{ backgroundColor: '#fa8c16' }}
                        />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{item.query}</Text>
                        <Tag color="orange">{item.category}</Tag>
                        {getTrendIcon(item.trend)}
                      </Space>
                    }
                    description={
                      <Space>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.count.toLocaleString()} searches
                        </Text>
                        {item.trend === 'up' && (
                          <Tag color="green" icon={<ArrowUpOutlined />}>
                            Trending
                          </Tag>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}

          {viewType === 'suggested' && (
            <List
              dataSource={mockSuggestedSearches}
              renderItem={(item) => {
                const typeConfig = {
                  product: { color: 'blue', icon: <ShoppingCartOutlined /> },
                  category: { color: 'green', icon: <SearchOutlined /> },
                  brand: { color: 'purple', icon: <StarOutlined /> },
                };
                const config = typeConfig[item.type];
                return (
                  <List.Item
                    actions={[
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={() => handleQuickSearch(item.query)}
                      >
                        Explore
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={item.image}
                          icon={config.icon}
                          style={{ backgroundColor: config.color }}
                          size={48}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{item.query}</Text>
                          <Tag color={config.color} icon={config.icon}>
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          </Tag>
                        </Space>
                      }
                      description={
                        item.productCount && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.productCount} {item.productCount === 1 ? 'product' : 'products'}
                          </Text>
                        )
                      }
                    />
                  </List.Item>
                );
              }}
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default SearchHistoryPage;
