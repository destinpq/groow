import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  List,
  Avatar,
  Badge,
  Progress,
  Alert,
  Divider,
  Switch,
  Select,
  Tooltip,
  Modal,
  Empty,
  Statistic,
} from 'antd';
import {
  AudioOutlined,
  AudioMutedOutlined,
  SearchOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SoundOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface VoiceSearchResult {
  id: number;
  productName: string;
  productImage: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  relevanceScore: number;
}

interface SearchHistory {
  id: number;
  query: string;
  timestamp: string;
  resultsCount: number;
  language: string;
}

interface VoiceSettings {
  language: string;
  autoSearch: boolean;
  soundEffects: boolean;
  saveHistory: boolean;
}

const mockSearchResults: VoiceSearchResult[] = [
  {
    id: 1,
    productName: 'Wireless Bluetooth Headphones',
    productImage: 'https://via.placeholder.com/120x120?text=Headphones',
    category: 'Electronics',
    price: 79.99,
    rating: 4.5,
    reviews: 342,
    inStock: true,
    relevanceScore: 95,
  },
  {
    id: 2,
    productName: 'Premium Noise Cancelling Headphones',
    productImage: 'https://via.placeholder.com/120x120?text=Premium',
    category: 'Electronics',
    price: 299.99,
    rating: 4.8,
    reviews: 1245,
    inStock: true,
    relevanceScore: 92,
  },
  {
    id: 3,
    productName: 'Gaming Headset with Microphone',
    productImage: 'https://via.placeholder.com/120x120?text=Gaming',
    category: 'Gaming',
    price: 59.99,
    rating: 4.3,
    reviews: 876,
    inStock: true,
    relevanceScore: 88,
  },
  {
    id: 4,
    productName: 'Sports Wireless Earbuds',
    productImage: 'https://via.placeholder.com/120x120?text=Sports',
    category: 'Sports',
    price: 39.99,
    rating: 4.2,
    reviews: 523,
    inStock: false,
    relevanceScore: 85,
  },
];

const mockSearchHistory: SearchHistory[] = [
  {
    id: 1,
    query: 'wireless headphones',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    resultsCount: 45,
    language: 'en-US',
  },
  {
    id: 2,
    query: 'laptop bag',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    resultsCount: 32,
    language: 'en-US',
  },
  {
    id: 3,
    query: 'gaming mouse',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    resultsCount: 28,
    language: 'en-US',
  },
];

const VoiceSearchPage: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [searchResults, setSearchResults] = useState<VoiceSearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(mockSearchHistory);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [settings, setSettings] = useState<VoiceSettings>({
    language: 'en-US',
    autoSearch: true,
    soundEffects: true,
    saveHistory: true,
  });
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState<boolean>(false);

  // Simulate audio level fluctuation when listening
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setAudioLevel(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(true);
    setTranscript('');
    setSearchResults([]);

    // Simulate speech recognition
    setTimeout(() => {
      const queries = [
        'wireless headphones',
        'laptop bag',
        'gaming mouse',
        'bluetooth speaker',
        'phone case',
      ];
      const randomQuery = queries[Math.floor(Math.random() * queries.length)];
      setTranscript(randomQuery);

      if (settings.autoSearch) {
        handleSearch(randomQuery);
      }
    }, 2000);
  };

  const handleStopListening = () => {
    setIsListening(false);
    setAudioLevel(0);
  };

  const handleSearch = (query: string) => {
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);

      // Add to history
      if (settings.saveHistory) {
        const newHistoryItem: SearchHistory = {
          id: Date.now(),
          query,
          timestamp: new Date().toISOString(),
          resultsCount: mockSearchResults.length,
          language: settings.language,
        };
        setSearchHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      }
    }, 1000);
  };

  const handleClearHistory = () => {
    Modal.confirm({
      title: 'Clear Search History',
      content: 'Are you sure you want to clear all voice search history?',
      onOk: () => {
        setSearchHistory([]);
      },
    });
  };

  const handleDeleteHistoryItem = (id: number) => {
    setSearchHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRepeatSearch = (query: string) => {
    setTranscript(query);
    handleSearch(query);
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const totalSearches = searchHistory.length;
  const avgResults =
    searchHistory.length > 0
      ? Math.round(
          searchHistory.reduce((sum, h) => sum + h.resultsCount, 0) / searchHistory.length
        )
      : 0;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <SoundOutlined style={{ color: '#1890ff' }} /> Voice Search
          </Title>
          <Paragraph type="secondary">
            Search products using your voice - just speak naturally!
          </Paragraph>
        </Col>
        <Col>
          <Button
            icon={<SettingOutlined />}
            onClick={() => setIsSettingsModalVisible(true)}
          >
            Settings
          </Button>
        </Col>
      </Row>

      <Alert
        message="🎤 Voice Search is Active"
        description="Click the microphone button and speak your search query. Our AI will understand natural language."
        type="info"
        showIcon={false}
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Voice Searches"
              value={totalSearches}
              prefix={<SearchOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Avg Results per Search"
              value={avgResults}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Recognition Accuracy"
              value={96}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <AudioOutlined />
                <span>Voice Input</span>
              </Space>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Button
                  type={isListening ? 'default' : 'primary'}
                  danger={isListening}
                  size="large"
                  shape="circle"
                  icon={isListening ? <AudioMutedOutlined /> : <AudioOutlined />}
                  onClick={isListening ? handleStopListening : handleStartListening}
                  style={{
                    width: 120,
                    height: 120,
                    fontSize: 48,
                    boxShadow: isListening
                      ? '0 0 30px rgba(255, 77, 79, 0.5)'
                      : '0 0 30px rgba(24, 144, 255, 0.3)',
                    animation: isListening ? 'pulse 1.5s infinite' : 'none',
                  }}
                />

                <div style={{ marginTop: 24 }}>
                  {isListening ? (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Badge status="processing" text="Listening..." />
                      <Progress
                        percent={audioLevel}
                        showInfo={false}
                        strokeColor={{
                          '0%': '#ff4d4f',
                          '50%': '#ff7a45',
                          '100%': '#ffa940',
                        }}
                        style={{ marginTop: 12 }}
                      />
                    </Space>
                  ) : (
                    <Text type="secondary">
                      Click the microphone to start voice search
                    </Text>
                  )}
                </div>
              </div>

              <Divider />

              {transcript && (
                <div>
                  <Text strong>Recognized Speech:</Text>
                  <div
                    style={{
                      background: '#e6f7ff',
                      padding: 16,
                      borderRadius: 8,
                      marginTop: 8,
                      border: '1px solid #91d5ff',
                    }}
                  >
                    <Space>
                      <SearchOutlined style={{ fontSize: 20, color: '#1890ff' }} />
                      <Text style={{ fontSize: 18 }}>{transcript}</Text>
                    </Space>
                  </div>

                  {!settings.autoSearch && (
                    <Button
                      type="primary"
                      icon={<SearchOutlined />}
                      onClick={() => handleSearch(transcript)}
                      loading={isSearching}
                      block
                      style={{ marginTop: 12 }}
                    >
                      Search
                    </Button>
                  )}
                </div>
              )}

              {isSearching && (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Space direction="vertical">
                    <ThunderboltOutlined
                      spin
                      style={{ fontSize: 32, color: '#1890ff' }}
                    />
                    <Text>Searching products...</Text>
                  </Space>
                </div>
              )}

              {searchResults.length > 0 && !isSearching && (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <Space>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text strong>
                        Found {searchResults.length} matching products
                      </Text>
                    </Space>
                  </div>

                  <List
                    dataSource={searchResults}
                    renderItem={(product) => (
                      <List.Item
                        actions={[
                          <Tooltip title="Add to Cart">
                            <Button
                              type="primary"
                              icon={<ShoppingCartOutlined />}
                              disabled={!product.inStock}
                            >
                              Add
                            </Button>
                          </Tooltip>,
                        ]}
                        style={{
                          opacity: product.inStock ? 1 : 0.6,
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            <Badge
                              count={`${product.relevanceScore}%`}
                              style={{ backgroundColor: '#52c41a' }}
                            >
                              <Avatar
                                src={product.productImage}
                                shape="square"
                                size={64}
                              />
                            </Badge>
                          }
                          title={
                            <Space>
                              <Text strong>{product.productName}</Text>
                              {!product.inStock && (
                                <Tag color="error">Out of Stock</Tag>
                              )}
                            </Space>
                          }
                          description={
                            <Space direction="vertical" size="small">
                              <div>
                                <Tag color="blue">{product.category}</Tag>
                              </div>
                              <div>
                                <Space>
                                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                    <DollarOutlined />
                                    {product.price.toFixed(2)}
                                  </Text>
                                  <Divider type="vertical" />
                                  <Space size="small">
                                    <StarOutlined style={{ color: '#faad14' }} />
                                    <Text>{product.rating}</Text>
                                    <Text type="secondary">
                                      ({product.reviews} reviews)
                                    </Text>
                                  </Space>
                                </Space>
                              </div>
                            </Space>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <HistoryOutlined />
                <span>Search History</span>
              </Space>
            }
            extra={
              searchHistory.length > 0 && (
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleClearHistory}
                >
                  Clear All
                </Button>
              )
            }
          >
            {searchHistory.length === 0 ? (
              <Empty description="No search history yet" />
            ) : (
              <List
                dataSource={searchHistory}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Tooltip title="Search Again">
                        <Button
                          type="link"
                          icon={<SearchOutlined />}
                          onClick={() => handleRepeatSearch(item.query)}
                        >
                          Repeat
                        </Button>
                      </Tooltip>,
                      <Tooltip title="Delete">
                        <Button
                          type="link"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteHistoryItem(item.id)}
                        />
                      </Tooltip>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<AudioOutlined />}
                          style={{ background: '#1890ff' }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>"{item.query}"</Text>
                          <Tag color="green">{item.resultsCount} results</Tag>
                        </Space>
                      }
                      description={
                        <Space>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {getTimeAgo(item.timestamp)}
                          </Text>
                          <Divider type="vertical" />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.language}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

          <Card
            title={
              <Space>
                <QuestionCircleOutlined />
                <span>Voice Search Tips</span>
              </Space>
            }
            style={{ marginTop: 16 }}
          >
            <List size="small">
              <List.Item>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Speak clearly and naturally</Text>
                </Space>
              </List.Item>
              <List.Item>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Use specific product names or categories</Text>
                </Space>
              </List.Item>
              <List.Item>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Include colors, sizes, or brands for better results</Text>
                </Space>
              </List.Item>
              <List.Item>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Try "show me" or "find" commands</Text>
                </Space>
              </List.Item>
            </List>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <SettingOutlined />
            <span>Voice Search Settings</span>
          </Space>
        }
        open={isSettingsModalVisible}
        onCancel={() => setIsSettingsModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsSettingsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>Language</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Select voice recognition language
                </Text>
              </div>
              <Select
                value={settings.language}
                onChange={(value) => setSettings({ ...settings, language: value })}
                style={{ width: 150 }}
              >
                <Option value="en-US">English (US)</Option>
                <Option value="en-GB">English (UK)</Option>
                <Option value="es-ES">Spanish</Option>
                <Option value="fr-FR">French</Option>
                <Option value="de-DE">German</Option>
                <Option value="zh-CN">Chinese</Option>
              </Select>
            </Space>
          </div>

          <Divider style={{ margin: 0 }} />

          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>Auto Search</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Automatically search after voice input
                </Text>
              </div>
              <Switch
                checked={settings.autoSearch}
                onChange={(checked) => setSettings({ ...settings, autoSearch: checked })}
              />
            </Space>
          </div>

          <Divider style={{ margin: 0 }} />

          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>Sound Effects</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Play sounds during voice recognition
                </Text>
              </div>
              <Switch
                checked={settings.soundEffects}
                onChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
              />
            </Space>
          </div>

          <Divider style={{ margin: 0 }} />

          <div>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <div>
                <Text strong>Save History</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Store voice search history
                </Text>
              </div>
              <Switch
                checked={settings.saveHistory}
                onChange={(checked) => setSettings({ ...settings, saveHistory: checked })}
              />
            </Space>
          </div>
        </Space>
      </Modal>

      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 30px rgba(255, 77, 79, 0.5);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 50px rgba(255, 77, 79, 0.8);
            }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceSearchPage;
