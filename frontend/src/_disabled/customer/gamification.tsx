import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  message,
  Statistic,
  Progress,
  Alert,
  Tabs,
  List,
  Avatar,
} from 'antd';
import {
  TrophyOutlined,
  GiftOutlined,
  StarOutlined,
  CrownOutlined,
  RocketOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'shopping' | 'social' | 'loyalty' | 'special';
  points: number;
  progress: number;
  target: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Badge {
  id: number;
  name: string;
  description: string;
  image: string;
  earnedAt: string;
  category: string;
}

interface Leaderboard {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  achievements: number;
  trend: 'up' | 'down' | 'stable';
}

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: 'First Purchase',
    description: 'Complete your first order',
    icon: <ShoppingCartOutlined />,
    category: 'shopping',
    points: 100,
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    reward: '$5 Store Credit',
    rarity: 'common',
  },
  {
    id: 2,
    title: 'Shopping Spree',
    description: 'Make 10 purchases',
    icon: <ShoppingCartOutlined />,
    category: 'shopping',
    points: 500,
    progress: 7,
    target: 10,
    unlocked: false,
    reward: '$25 Store Credit',
    rarity: 'rare',
  },
  {
    id: 3,
    title: 'VIP Shopper',
    description: 'Spend $1,000 total',
    icon: <CrownOutlined />,
    category: 'shopping',
    points: 1000,
    progress: 750,
    target: 1000,
    unlocked: false,
    reward: 'VIP Status for 3 months',
    rarity: 'epic',
  },
  {
    id: 4,
    title: 'Early Bird',
    description: 'Make a purchase before 8 AM',
    icon: <RocketOutlined />,
    category: 'special',
    points: 200,
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    reward: '5% Off Next Order',
    rarity: 'common',
  },
  {
    id: 5,
    title: 'Review Master',
    description: 'Write 20 product reviews',
    icon: <StarOutlined />,
    category: 'social',
    points: 300,
    progress: 12,
    target: 20,
    unlocked: false,
    reward: '$10 Store Credit',
    rarity: 'rare',
  },
  {
    id: 6,
    title: 'Social Butterfly',
    description: 'Share 5 products on social media',
    icon: <ShareAltOutlined />,
    category: 'social',
    points: 150,
    progress: 3,
    target: 5,
    unlocked: false,
    reward: '100 Loyalty Points',
    rarity: 'common',
  },
  {
    id: 7,
    title: 'Loyalty Legend',
    description: 'Reach Platinum tier',
    icon: <CrownOutlined />,
    category: 'loyalty',
    points: 2000,
    progress: 1,
    target: 1,
    unlocked: true,
    unlockedAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    reward: 'Lifetime 15% Discount',
    rarity: 'legendary',
  },
  {
    id: 8,
    title: 'Speed Demon',
    description: 'Complete checkout in under 60 seconds',
    icon: <ThunderboltOutlined />,
    category: 'special',
    points: 250,
    progress: 0,
    target: 1,
    unlocked: false,
    reward: 'Free Express Shipping',
    rarity: 'rare',
  },
  {
    id: 9,
    title: 'Wishlist Wizard',
    description: 'Add 50 items to wishlist',
    icon: <HeartOutlined />,
    category: 'shopping',
    points: 100,
    progress: 34,
    target: 50,
    unlocked: false,
    reward: '$5 Store Credit',
    rarity: 'common',
  },
  {
    id: 10,
    title: 'Gift Giver',
    description: 'Send 5 gift cards',
    icon: <GiftOutlined />,
    category: 'special',
    points: 400,
    progress: 2,
    target: 5,
    unlocked: false,
    reward: '$20 Gift Card',
    rarity: 'epic',
  },
];

const mockBadges: Badge[] = [
  {
    id: 1,
    name: 'First Purchase',
    description: 'Completed first order',
    image: 'https://via.placeholder.com/60?text=1st',
    earnedAt: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    category: 'Shopping',
  },
  {
    id: 2,
    name: 'Early Bird',
    description: 'Shopped before 8 AM',
    image: 'https://via.placeholder.com/60?text=Bird',
    earnedAt: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    category: 'Special',
  },
  {
    id: 3,
    name: 'Platinum Member',
    description: 'Reached Platinum tier',
    image: 'https://via.placeholder.com/60?text=Plat',
    earnedAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    category: 'Loyalty',
  },
];

const mockLeaderboard: Leaderboard[] = [
  {
    rank: 1,
    username: 'SuperShopper2025',
    avatar: 'https://via.placeholder.com/40?text=S',
    points: 15420,
    achievements: 28,
    trend: 'stable',
  },
  {
    rank: 2,
    username: 'DealHunter',
    avatar: 'https://via.placeholder.com/40?text=D',
    points: 14890,
    achievements: 26,
    trend: 'up',
  },
  {
    rank: 3,
    username: 'ShopaholicPro',
    avatar: 'https://via.placeholder.com/40?text=SP',
    points: 13250,
    achievements: 24,
    trend: 'down',
  },
  {
    rank: 4,
    username: 'TechGuru99',
    avatar: 'https://via.placeholder.com/40?text=TG',
    points: 12100,
    achievements: 22,
    trend: 'up',
  },
  {
    rank: 5,
    username: 'YOU',
    avatar: 'https://via.placeholder.com/40?text=You',
    points: 3850,
    achievements: 10,
    trend: 'up',
  },
];

const GamificationPage: React.FC = () => {
  const [achievements] = useState<Achievement[]>(mockAchievements);
  const [badges] = useState<Badge[]>(mockBadges);

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercentage = (unlockedCount / achievements.length) * 100;

  const rarityConfig = {
    common: { color: '#8c8c8c', label: 'Common', bg: '#f0f0f0' },
    rare: { color: '#1890ff', label: 'Rare', bg: '#e6f7ff' },
    epic: { color: '#722ed1', label: 'Epic', bg: '#f9f0ff' },
    legendary: { color: '#fa8c16', label: 'Legendary', bg: '#fff7e6' },
  };

  const achievementColumns: ColumnsType<Achievement> = [
    {
      title: 'Achievement',
      key: 'achievement',
      render: (_, record) => {
        const config = rarityConfig[record.rarity];
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: record.unlocked ? config.bg : '#f5f5f5',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                color: record.unlocked ? config.color : '#d9d9d9',
              }}
            >
              {record.icon}
            </div>
            <div>
              <div>
                <Text strong style={{ opacity: record.unlocked ? 1 : 0.5 }}>
                  {record.title}
                </Text>
              </div>
              <Paragraph
                type="secondary"
                style={{ margin: 0, fontSize: 12 }}
                ellipsis={{ rows: 1 }}
              >
                {record.description}
              </Paragraph>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => {
        const percent = (record.progress / record.target) * 100;
        return (
          <div style={{ minWidth: 150 }}>
            <div style={{ marginBottom: 4 }}>
              <Text style={{ fontSize: 12 }}>
                {record.progress} / {record.target}
              </Text>
            </div>
            <Progress
              percent={percent}
              showInfo={false}
              strokeColor={record.unlocked ? '#52c41a' : '#1890ff'}
              status={record.unlocked ? 'success' : 'active'}
            />
          </div>
        );
      },
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (points) => (
        <Text strong style={{ fontSize: 16, color: '#fa8c16' }}>
          +{points}
        </Text>
      ),
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      key: 'reward',
      render: (reward) => (
        <Tag icon={<GiftOutlined />} color="green">
          {reward}
        </Tag>
      ),
    },
    {
      title: 'Rarity',
      dataIndex: 'rarity',
      key: 'rarity',
      render: (rarity: Achievement['rarity']) => {
        const config = rarityConfig[rarity];
        return (
          <Tag color={config.color} style={{ fontWeight: 'bold' }}>
            {config.label.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Common', value: 'common' },
        { text: 'Rare', value: 'rare' },
        { text: 'Epic', value: 'epic' },
        { text: 'Legendary', value: 'legendary' },
      ],
      onFilter: (value, record) => record.rarity === value,
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.unlocked) {
          return (
            <div>
              <Tag color="success" icon={<TrophyOutlined />}>
                Unlocked
              </Tag>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(record.unlockedAt).format('MMM DD, YYYY')}
                </Text>
              </div>
            </div>
          );
        }
        const percent = (record.progress / record.target) * 100;
        return (
          <Tag color={percent >= 50 ? 'processing' : 'default'}>
            {percent >= 50 ? 'Almost There!' : 'In Progress'}
          </Tag>
        );
      },
      filters: [
        { text: 'Unlocked', value: 'unlocked' },
        { text: 'In Progress', value: 'progress' },
      ],
      onFilter: (value, record) => {
        if (value === 'unlocked') return record.unlocked;
        return !record.unlocked;
      },
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={3}>
        <TrophyOutlined style={{ color: '#fa8c16' }} /> Achievements & Gamification
      </Title>
      <Paragraph type="secondary">
        Unlock achievements, earn rewards, and compete with other shoppers
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Points"
              value={totalPoints}
              valueStyle={{ color: '#fa8c16' }}
              prefix={<StarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Achievements"
              value={unlockedCount}
              suffix={`/ ${achievements.length}`}
              valueStyle={{ color: '#1890ff' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Badges Earned"
              value={badges.length}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CrownOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Global Rank"
              value={5}
              suffix="th"
              valueStyle={{ color: '#722ed1' }}
              prefix={<RocketOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <Text strong>Overall Progress</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {progressPercentage.toFixed(1)}% Complete
          </Text>
        </div>
        <Progress
          percent={progressPercentage}
          strokeColor={{
            '0%': '#108ee9',
            '100%': '#87d068',
          }}
          status="active"
        />
      </Card>

      <Tabs defaultActiveKey="achievements" type="card">
        <TabPane
          tab={
            <span>
              <TrophyOutlined />
              Achievements ({unlockedCount}/{achievements.length})
            </span>
          }
          key="achievements"
        >
          <Alert
            message="💡 Complete achievements to earn points and rewards!"
            description="Points can be redeemed for store credit, discounts, and exclusive perks. Track your progress below."
            type="info"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={achievementColumns}
            dataSource={achievements}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <CrownOutlined />
              Badges ({badges.length})
            </span>
          }
          key="badges"
        >
          <Row gutter={[16, 16]}>
            {badges.map((badge) => (
              <Col key={badge.id} xs={24} sm={12} md={8} lg={6}>
                <Card hoverable>
                  <div style={{ textAlign: 'center' }}>
                    <Avatar
                      src={badge.image}
                      size={80}
                      style={{ marginBottom: 12 }}
                    />
                    <Title level={5} style={{ margin: 0 }}>
                      {badge.name}
                    </Title>
                    <Paragraph
                      type="secondary"
                      style={{ fontSize: 12, marginBottom: 8 }}
                    >
                      {badge.description}
                    </Paragraph>
                    <Tag color="blue">{badge.category}</Tag>
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Earned: {dayjs(badge.earnedAt).format('MMM DD, YYYY')}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <RocketOutlined />
              Leaderboard
            </span>
          }
          key="leaderboard"
        >
          <List
            dataSource={mockLeaderboard}
            renderItem={(item) => (
              <List.Item
                style={{
                  background: item.username === 'YOU' ? '#fff7e6' : '#fff',
                  padding: 16,
                  marginBottom: 8,
                  borderRadius: 8,
                  border: item.username === 'YOU' ? '2px solid #fa8c16' : '1px solid #f0f0f0',
                }}
              >
                <List.Item.Meta
                  avatar={
                    <div style={{ position: 'relative' }}>
                      <Avatar src={item.avatar} size={48} />
                      {item.rank <= 3 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background:
                              item.rank === 1
                                ? '#ffd700'
                                : item.rank === 2
                                ? '#c0c0c0'
                                : '#cd7f32',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: 12,
                          }}
                        >
                          {item.rank}
                        </div>
                      )}
                    </div>
                  }
                  title={
                    <Space>
                      {item.rank > 3 && (
                        <Text strong style={{ fontSize: 18, color: '#8c8c8c' }}>
                          #{item.rank}
                        </Text>
                      )}
                      <Text strong style={{ fontSize: 16 }}>
                        {item.username}
                      </Text>
                      {item.username === 'YOU' && (
                        <Tag color="orange">You</Tag>
                      )}
                    </Space>
                  }
                  description={
                    <Space size="large">
                      <Text>
                        <StarOutlined style={{ color: '#fa8c16' }} /> {item.points.toLocaleString()} points
                      </Text>
                      <Text>
                        <TrophyOutlined style={{ color: '#1890ff' }} /> {item.achievements} achievements
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
