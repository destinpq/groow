import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Select,
  Space,
  Tag,
  Badge,
  Divider,
  Button,
  Avatar,
  Tabs,
} from 'antd';
import {
  PlayCircleOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  LikeOutlined,
  LikeFilled,
  BookOutlined,
  ToolOutlined,
  ShoppingOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'tutorial' | 'product-demo' | 'how-to' | 'tips' | 'unboxing' | 'comparison';
  views: number;
  likes: number;
  isLiked: boolean;
  uploadedAt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedProducts: string[];
}

const mockVideos: Video[] = [
  {
    id: 1,
    title: 'Complete Setup Guide - Gaming Laptop',
    description: 'Learn how to set up your new gaming laptop, install drivers, and optimize performance',
    thumbnail: 'https://via.placeholder.com/400x225?text=Gaming+Laptop+Setup',
    duration: '12:45',
    category: 'tutorial',
    views: 15420,
    likes: 1243,
    isLiked: true,
    uploadedAt: dayjs().subtract(7, 'days').format('YYYY-MM-DD'),
    difficulty: 'beginner',
    relatedProducts: ['Gaming Laptop Pro X1', 'Cooling Pad'],
  },
  {
    id: 2,
    title: 'iPhone 16 Pro Max - First Look & Unboxing',
    description: "What's in the box? Get a detailed look at Apple's latest flagship smartphone",
    thumbnail: 'https://via.placeholder.com/400x225?text=iPhone+Unboxing',
    duration: '8:32',
    category: 'unboxing',
    views: 45230,
    likes: 3892,
    isLiked: false,
    uploadedAt: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    difficulty: 'beginner',
    relatedProducts: ['iPhone 16 Pro Max', 'MagSafe Charger'],
  },
  {
    id: 3,
    title: 'How to Build Your First PC - Step by Step',
    description: 'Complete PC building tutorial for beginners, from components to cable management',
    thumbnail: 'https://via.placeholder.com/400x225?text=PC+Building+Guide',
    duration: '25:18',
    category: 'how-to',
    views: 89560,
    likes: 7234,
    isLiked: true,
    uploadedAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    difficulty: 'intermediate',
    relatedProducts: ['PC Case', 'Motherboard', 'CPU', 'Graphics Card'],
  },
  {
    id: 4,
    title: '10 Photography Tips for Beginners',
    description: 'Master the basics of photography with these essential tips and tricks',
    thumbnail: 'https://via.placeholder.com/400x225?text=Photography+Tips',
    duration: '15:42',
    category: 'tips',
    views: 23450,
    likes: 1876,
    isLiked: false,
    uploadedAt: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    difficulty: 'beginner',
    relatedProducts: ['DSLR Camera', 'Tripod', 'Camera Bag'],
  },
  {
    id: 5,
    title: 'Sony WH-1000XM5 vs Bose 700 - Which is Better?',
    description: 'Detailed comparison of two flagship noise-canceling headphones',
    thumbnail: 'https://via.placeholder.com/400x225?text=Headphones+Comparison',
    duration: '18:25',
    category: 'comparison',
    views: 67890,
    likes: 5432,
    isLiked: false,
    uploadedAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    difficulty: 'beginner',
    relatedProducts: ['Sony WH-1000XM5', 'Bose 700'],
  },
  {
    id: 6,
    title: 'MacBook Pro M4 - Performance Review & Benchmarks',
    description: 'In-depth look at the new M4 chip performance, battery life, and real-world usage',
    thumbnail: 'https://via.placeholder.com/400x225?text=MacBook+Review',
    duration: '21:15',
    category: 'product-demo',
    views: 112340,
    likes: 9876,
    isLiked: true,
    uploadedAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD'),
    difficulty: 'intermediate',
    relatedProducts: ['MacBook Pro M4', 'USB-C Hub'],
  },
  {
    id: 7,
    title: 'Advanced Camera Settings Explained',
    description: 'Deep dive into ISO, aperture, shutter speed, and manual mode',
    thumbnail: 'https://via.placeholder.com/400x225?text=Camera+Settings',
    duration: '32:50',
    category: 'tutorial',
    views: 34560,
    likes: 2890,
    isLiked: false,
    uploadedAt: dayjs().subtract(20, 'days').format('YYYY-MM-DD'),
    difficulty: 'advanced',
    relatedProducts: ['DSLR Camera', 'Camera Lens Kit'],
  },
  {
    id: 8,
    title: 'Mechanical Keyboard Buying Guide 2025',
    description: 'Everything you need to know about switches, keycaps, and layouts',
    thumbnail: 'https://via.placeholder.com/400x225?text=Keyboard+Guide',
    duration: '16:20',
    category: 'tips',
    views: 45670,
    likes: 3765,
    isLiked: true,
    uploadedAt: dayjs().subtract(12, 'days').format('YYYY-MM-DD'),
    difficulty: 'intermediate',
    relatedProducts: ['Mechanical Keyboard', 'Custom Keycaps'],
  },
];

const VideoTutorialsPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>(mockVideos);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const handleToggleLike = (videoId: number) => {
    setVideos(
      videos.map((v) =>
        v.id === videoId
          ? {
              ...v,
              isLiked: !v.isLiked,
              likes: v.isLiked ? v.likes - 1 : v.likes + 1,
            }
          : v
      )
    );
  };

  const filteredVideos = videos.filter((video) => {
    if (categoryFilter !== 'all' && video.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && video.difficulty !== difficultyFilter) return false;
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const categoryConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    tutorial: { color: 'blue', text: 'Tutorial', icon: <BookOutlined /> },
    'product-demo': { color: 'purple', text: 'Product Demo', icon: <ShoppingOutlined /> },
    'how-to': { color: 'green', text: 'How To', icon: <ToolOutlined /> },
    tips: { color: 'orange', text: 'Tips & Tricks', icon: <TrophyOutlined /> },
    unboxing: { color: 'cyan', text: 'Unboxing', icon: <PlayCircleOutlined /> },
    comparison: { color: 'magenta', text: 'Comparison', icon: <PlayCircleOutlined /> },
  };

  const difficultyConfig: Record<string, { color: string }> = {
    beginner: { color: 'green' },
    intermediate: { color: 'orange' },
    advanced: { color: 'red' },
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <PlayCircleOutlined style={{ color: '#ff4d4f' }} /> Video Tutorials & Demos
        </Title>
        <Paragraph type="secondary">
          Learn how to use your products with our comprehensive video guides
        </Paragraph>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col xs={24} md={12}>
            <Search
              placeholder="Search videos..."
              size="large"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={6}>
            <Select
              size="large"
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Categories</Option>
              <Option value="tutorial">Tutorials</Option>
              <Option value="product-demo">Product Demos</Option>
              <Option value="how-to">How To</Option>
              <Option value="tips">Tips & Tricks</Option>
              <Option value="unboxing">Unboxing</Option>
              <Option value="comparison">Comparisons</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Select
              size="large"
              value={difficultyFilter}
              onChange={setDifficultyFilter}
              style={{ width: '100%' }}
            >
              <Option value="all">All Levels</Option>
              <Option value="beginner">Beginner</Option>
              <Option value="intermediate">Intermediate</Option>
              <Option value="advanced">Advanced</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">{filteredVideos.length} videos found</Text>
      </div>

      <Row gutter={[16, 16]}>
        {filteredVideos.map((video) => (
          <Col xs={24} sm={12} lg={8} key={video.id}>
            <Card
              hoverable
              cover={
                <div style={{ position: 'relative' }}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    style={{ width: '100%', height: 225, objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s',
                      cursor: 'pointer',
                    }}
                    className="video-overlay"
                  >
                    <PlayCircleOutlined style={{ fontSize: 64, color: 'white' }} />
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                    }}
                  >
                    {video.duration}
                  </div>
                  <Badge
                    count={categoryConfig[video.category].text}
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      background: '#1890ff',
                    }}
                  />
                </div>
              }
              style={{ height: '100%' }}
            >
              <div style={{ marginBottom: 8 }}>
                <Space>
                  <Tag color={categoryConfig[video.category].color} icon={categoryConfig[video.category].icon}>
                    {categoryConfig[video.category].text}
                  </Tag>
                  <Tag color={difficultyConfig[video.difficulty].color}>
                    {video.difficulty.charAt(0).toUpperCase() + video.difficulty.slice(1)}
                  </Tag>
                </Space>
              </div>

              <Title level={5} style={{ marginBottom: 8 }} ellipsis={{ rows: 2 }}>
                {video.title}
              </Title>

              <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ marginBottom: 12, fontSize: 13 }}>
                {video.description}
              </Paragraph>

              <Divider style={{ margin: '12px 0' }} />

              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Row justify="space-between">
                  <Col>
                    <Space size="large">
                      <span>
                        <EyeOutlined style={{ marginRight: 4, color: '#1890ff' }} />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {video.views.toLocaleString()}
                        </Text>
                      </span>
                      <span style={{ cursor: 'pointer' }} onClick={() => handleToggleLike(video.id)}>
                        {video.isLiked ? (
                          <LikeFilled style={{ marginRight: 4, color: '#ff4d4f' }} />
                        ) : (
                          <LikeOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                        )}
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {video.likes.toLocaleString()}
                        </Text>
                      </span>
                    </Space>
                  </Col>
                  <Col>
                    <ClockCircleOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(video.uploadedAt).fromNow()}
                    </Text>
                  </Col>
                </Row>

                {video.relatedProducts.length > 0 && (
                  <div>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block', marginBottom: 4 }}>
                      Related Products:
                    </Text>
                    <Space wrap size="small">
                      {video.relatedProducts.slice(0, 2).map((product, index) => (
                        <Tag key={index} style={{ fontSize: 11, margin: 0 }}>
                          {product}
                        </Tag>
                      ))}
                      {video.relatedProducts.length > 2 && (
                        <Tag style={{ fontSize: 11, margin: 0 }}>+{video.relatedProducts.length - 2}</Tag>
                      )}
                    </Space>
                  </div>
                )}
              </Space>

              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                block
                style={{ marginTop: 12 }}
              >
                Watch Now
              </Button>
            </Card>

            <style>
              {`
                .video-overlay:hover {
                  opacity: 1 !important;
                }
              `}
            </style>
          </Col>
        ))}
      </Row>

      {filteredVideos.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <PlayCircleOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
            <Title level={4}>No Videos Found</Title>
            <Paragraph type="secondary">
              Try adjusting your filters or search terms
            </Paragraph>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VideoTutorialsPage;
