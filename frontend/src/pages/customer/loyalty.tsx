import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Tag,
  Table,
  Space,
  Button,
  Statistic,
  Badge,
  Divider,
  Timeline,
  Alert,
  Tabs,
} from 'antd';
import {
  TrophyOutlined,
  GiftOutlined,
  StarFilled,
  CrownOutlined,
  ShoppingOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;

interface LoyaltyTier {
  name: string;
  minPoints: number;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
}

interface PointsHistory {
  id: number;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  date: string;
  orderId?: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'freeShipping' | 'product' | 'exclusive';
  image: string;
  available: boolean;
}

const tiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    benefits: ['5% off on orders', 'Birthday bonus', 'Early access to sales'],
    color: '#CD7F32',
    icon: <StarFilled />,
  },
  {
    name: 'Silver',
    minPoints: 500,
    benefits: ['10% off on orders', 'Free shipping on orders over $50', 'Priority support', 'Exclusive products'],
    color: '#C0C0C0',
    icon: <TrophyOutlined />,
  },
  {
    name: 'Gold',
    minPoints: 1500,
    benefits: ['15% off on orders', 'Free shipping always', 'VIP support', 'Double points events', 'Gift wrapping'],
    color: '#FFD700',
    icon: <CrownOutlined />,
  },
  {
    name: 'Platinum',
    minPoints: 3000,
    benefits: ['20% off on orders', 'Free express shipping', 'Personal shopper', 'Triple points events', 'Exclusive previews', 'No minimum purchase'],
    color: '#E5E4E2',
    icon: <RocketOutlined />,
  },
];

const mockPointsHistory: PointsHistory[] = [
  {
    id: 1,
    type: 'earned',
    points: 150,
    description: 'Purchase reward',
    date: '2024-11-01',
    orderId: 'ORD-12345',
  },
  {
    id: 2,
    type: 'earned',
    points: 50,
    description: 'Product review',
    date: '2024-10-28',
  },
  {
    id: 3,
    type: 'redeemed',
    points: -100,
    description: 'Redeemed for 10% discount coupon',
    date: '2024-10-25',
  },
  {
    id: 4,
    type: 'earned',
    points: 200,
    description: 'Purchase reward',
    date: '2024-10-20',
    orderId: 'ORD-12340',
  },
  {
    id: 5,
    type: 'earned',
    points: 100,
    description: 'Referral bonus',
    date: '2024-10-15',
  },
];

const mockRewards: Reward[] = [
  {
    id: 1,
    name: '$10 OFF Coupon',
    description: 'Save $10 on your next purchase',
    pointsCost: 100,
    type: 'discount',
    image: 'https://via.placeholder.com/150?text=$10+OFF',
    available: true,
  },
  {
    id: 2,
    name: 'Free Shipping',
    description: 'Free standard shipping on your next order',
    pointsCost: 50,
    type: 'freeShipping',
    image: 'https://via.placeholder.com/150?text=Free+Ship',
    available: true,
  },
  {
    id: 3,
    name: '$25 OFF Coupon',
    description: 'Save $25 on orders over $100',
    pointsCost: 250,
    type: 'discount',
    image: 'https://via.placeholder.com/150?text=$25+OFF',
    available: true,
  },
  {
    id: 4,
    name: 'Premium Water Bottle',
    description: 'Exclusive branded stainless steel water bottle',
    pointsCost: 500,
    type: 'product',
    image: 'https://via.placeholder.com/150?text=Bottle',
    available: true,
  },
  {
    id: 5,
    name: 'VIP Shopping Hour',
    description: 'Exclusive 1-hour early access to sales',
    pointsCost: 300,
    type: 'exclusive',
    image: 'https://via.placeholder.com/150?text=VIP',
    available: false,
  },
  {
    id: 6,
    name: '$50 OFF Coupon',
    description: 'Save $50 on orders over $200',
    pointsCost: 500,
    type: 'discount',
    image: 'https://via.placeholder.com/150?text=$50+OFF',
    available: true,
  },
];

const LoyaltyProgramPage: React.FC = () => {
  const [currentPoints] = useState(1250);
  const [pointsHistory] = useState<PointsHistory[]>(mockPointsHistory);
  const [rewards] = useState<Reward[]>(mockRewards);

  const getCurrentTier = () => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (currentPoints >= tiers[i].minPoints) {
        return { tier: tiers[i], index: i };
      }
    }
    return { tier: tiers[0], index: 0 };
  };

  const getNextTier = () => {
    const { index } = getCurrentTier();
    return index < tiers.length - 1 ? tiers[index + 1] : null;
  };

  const currentTierInfo = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNextTier = nextTier
    ? ((currentPoints - currentTierInfo.tier.minPoints) / (nextTier.minPoints - currentTierInfo.tier.minPoints)) * 100
    : 100;

  const historyColumns: ColumnsType<PointsHistory> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Activity',
      dataIndex: 'description',
      key: 'description',
      render: (desc, record) => (
        <div>
          <Text>{desc}</Text>
          {record.orderId && (
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Order: {record.orderId}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (points, record) => (
        <Tag color={record.type === 'earned' ? 'green' : 'orange'} style={{ fontSize: 14 }}>
          {points > 0 ? '+' : ''}{points}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TrophyOutlined style={{ color: '#FFD700' }} /> Loyalty Rewards Program
        </Title>
        <Paragraph type="secondary">
          Earn points with every purchase and unlock exclusive rewards
        </Paragraph>
      </div>

      {/* Current Status */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card>
            <Row gutter={24}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, color: currentTierInfo.tier.color, marginBottom: 8 }}>
                    {currentTierInfo.tier.icon}
                  </div>
                  <Title level={4} style={{ margin: 0, color: currentTierInfo.tier.color }}>
                    {currentTierInfo.tier.name}
                  </Title>
                  <Text type="secondary">Current Tier</Text>
                </div>
              </Col>
              <Col xs={24} sm={16}>
                <Statistic
                  title="Total Points"
                  value={currentPoints}
                  prefix={<StarFilled style={{ color: '#FFD700' }} />}
                  valueStyle={{ color: '#1890ff', fontSize: 36 }}
                  style={{ marginBottom: 16 }}
                />
                {nextTier && (
                  <div>
                    <div style={{ marginBottom: 8 }}>
                      <Text>
                        {nextTier.minPoints - currentPoints} points to {nextTier.name} tier
                      </Text>
                    </div>
                    <Progress
                      percent={Math.round(progressToNextTier)}
                      strokeColor={{
                        '0%': currentTierInfo.tier.color,
                        '100%': nextTier.color,
                      }}
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card style={{ height: '100%' }}>
            <Statistic
              title="Points This Month"
              value={300}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
              style={{ marginBottom: 16 }}
            />
            <Statistic
              title="Lifetime Points Earned"
              value={2450}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#ff9900' }}
            />
          </Card>
        </Col>
      </Row>

      {/* How to Earn Points */}
      <Card title="How to Earn Points" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <ShoppingOutlined style={{ fontSize: 32, color: '#1890ff', marginBottom: 8 }} />
              <Title level={5}>Make Purchases</Title>
              <Text type="secondary">Earn 10 points per $1 spent</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <StarFilled style={{ fontSize: 32, color: '#FFD700', marginBottom: 8 }} />
              <Title level={5}>Write Reviews</Title>
              <Text type="secondary">Earn 50 points per review</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: 32, color: '#52c41a', marginBottom: 8 }} />
              <Title level={5}>Refer Friends</Title>
              <Text type="secondary">Earn 100 points per referral</Text>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" style={{ textAlign: 'center' }}>
              <GiftOutlined style={{ fontSize: 32, color: '#ff9900', marginBottom: 8 }} />
              <Title level={5}>Birthday Bonus</Title>
              <Text type="secondary">Earn 200 points annually</Text>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Membership Tiers */}
      <Card title="Membership Tiers" style={{ marginBottom: 24 }}>
        <Timeline>
          {tiers.map((tier, index) => (
            <Timeline.Item
              key={tier.name}
              color={currentTierInfo.tier.name === tier.name ? tier.color : 'gray'}
              dot={
                currentTierInfo.tier.name === tier.name ? (
                  <CheckCircleOutlined style={{ fontSize: 20, color: tier.color }} />
                ) : (
                  <div style={{ fontSize: 16, color: tier.color }}>{tier.icon}</div>
                )
              }
            >
              <Card
                size="small"
                style={{
                  border: currentTierInfo.tier.name === tier.name ? `2px solid ${tier.color}` : '1px solid #d9d9d9',
                  background: currentTierInfo.tier.name === tier.name ? '#fafafa' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Title level={5} style={{ margin: 0, color: tier.color }}>
                    {tier.name} Tier
                  </Title>
                  <Tag color={tier.color}>{tier.minPoints}+ points</Tag>
                </div>
                <div>
                  {tier.benefits.map((benefit, idx) => (
                    <div key={idx} style={{ marginBottom: 4 }}>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      <Text>{benefit}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* Tabs for History and Rewards */}
      <Card>
        <Tabs
          items={[
            {
              key: 'rewards',
              label: (
                <span>
                  <GiftOutlined /> Available Rewards
                </span>
              ),
              children: (
                <Row gutter={[16, 16]}>
                  {rewards.map((reward) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={reward.id}>
                      <Badge.Ribbon
                        text={reward.available ? 'Available' : 'Coming Soon'}
                        color={reward.available ? 'green' : 'gray'}
                      >
                        <Card
                          hoverable
                          cover={
                            <img
                              src={reward.image}
                              alt={reward.name}
                              style={{ height: 150, objectFit: 'cover' }}
                            />
                          }
                        >
                          <Title level={5} ellipsis={{ rows: 1 }}>
                            {reward.name}
                          </Title>
                          <Paragraph type="secondary" ellipsis={{ rows: 2 }} style={{ minHeight: 44 }}>
                            {reward.description}
                          </Paragraph>
                          <div style={{ marginTop: 12 }}>
                            <Tag color="gold" style={{ fontSize: 14 }}>
                              <StarFilled /> {reward.pointsCost} points
                            </Tag>
                          </div>
                          <Button
                            type="primary"
                            block
                            style={{ marginTop: 12 }}
                            disabled={!reward.available || currentPoints < reward.pointsCost}
                          >
                            {currentPoints >= reward.pointsCost ? 'Redeem' : 'Not Enough Points'}
                          </Button>
                        </Card>
                      </Badge.Ribbon>
                    </Col>
                  ))}
                </Row>
              ),
            },
            {
              key: 'history',
              label: (
                <span>
                  <ShoppingOutlined /> Points History
                </span>
              ),
              children: <Table columns={historyColumns} dataSource={pointsHistory} rowKey="id" pagination={{ pageSize: 10 }} />,
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default LoyaltyProgramPage;
