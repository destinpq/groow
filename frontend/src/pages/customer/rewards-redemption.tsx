import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Rate,
  Avatar,
  Divider,
  message,
  Statistic,
  Progress,
} from 'antd';
import {
  GiftOutlined,
  TrophyOutlined,
  StarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Reward {
  id: number;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'product' | 'shipping' | 'voucher';
  value: string;
  stock: number;
  image: string;
  redeemed: number;
}

interface UserReward {
  id: number;
  userId: number;
  userName: string;
  rewardName: string;
  pointsSpent: number;
  redeemedAt: string;
  status: 'pending' | 'claimed' | 'expired';
}

interface LoyaltyTier {
  name: string;
  minPoints: number;
  color: string;
  benefits: string[];
  multiplier: number;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    minPoints: 0,
    color: '#cd7f32',
    benefits: ['1x points on purchases', 'Birthday discount'],
    multiplier: 1,
  },
  {
    name: 'Silver',
    minPoints: 1000,
    color: '#C0C0C0',
    benefits: ['1.5x points on purchases', 'Free shipping on orders over $50', 'Early access to sales'],
    multiplier: 1.5,
  },
  {
    name: 'Gold',
    minPoints: 5000,
    color: '#FFD700',
    benefits: ['2x points on purchases', 'Free shipping always', 'Priority customer support', 'Exclusive deals'],
    multiplier: 2,
  },
  {
    name: 'Platinum',
    minPoints: 10000,
    color: '#E5E4E2',
    benefits: [
      '3x points on purchases',
      'Free express shipping',
      'VIP support',
      'Exclusive products',
      'Personal shopper',
    ],
    multiplier: 3,
  },
];

const mockRewards: Reward[] = [
  {
    id: 1,
    name: '$10 Off Coupon',
    description: 'Save $10 on your next purchase of $50 or more',
    pointsCost: 500,
    type: 'discount',
    value: '$10',
    stock: 100,
    image: '🎟️',
    redeemed: 45,
  },
  {
    id: 2,
    name: '$25 Off Coupon',
    description: 'Save $25 on your next purchase of $100 or more',
    pointsCost: 1200,
    type: 'discount',
    value: '$25',
    stock: 50,
    image: '🎫',
    redeemed: 28,
  },
  {
    id: 3,
    name: 'Free Shipping',
    description: 'Free standard shipping on your next order',
    pointsCost: 300,
    type: 'shipping',
    value: 'Free',
    stock: 200,
    image: '📦',
    redeemed: 89,
  },
  {
    id: 4,
    name: 'Premium Gift Box',
    description: 'Exclusive branded gift box with premium items',
    pointsCost: 2500,
    type: 'product',
    value: '$50',
    stock: 25,
    image: '🎁',
    redeemed: 12,
  },
  {
    id: 5,
    name: '$50 Voucher',
    description: 'Redeem for $50 credit on any purchase',
    pointsCost: 2000,
    type: 'voucher',
    value: '$50',
    stock: 30,
    image: '💳',
    redeemed: 18,
  },
];

const mockRedemptions: UserReward[] = [
  {
    id: 1,
    userId: 101,
    userName: 'John Doe',
    rewardName: '$10 Off Coupon',
    pointsSpent: 500,
    redeemedAt: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm'),
    status: 'claimed',
  },
  {
    id: 2,
    userId: 102,
    userName: 'Jane Smith',
    rewardName: 'Free Shipping',
    pointsSpent: 300,
    redeemedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm'),
    status: 'pending',
  },
  {
    id: 3,
    userId: 103,
    userName: 'Bob Johnson',
    rewardName: '$25 Off Coupon',
    pointsSpent: 1200,
    redeemedAt: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm'),
    status: 'claimed',
  },
];

const RewardsRedemptionPage: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [form] = Form.useForm();

  const handleRedeemReward = (reward: Reward) => {
    setSelectedReward(reward);
    setIsModalVisible(true);
  };

  const handleConfirmRedemption = () => {
    message.success('Reward redeemed successfully!');
    setIsModalVisible(false);
    form.resetFields();
  };

  const rewardColumns: ColumnsType<Reward> = [
    {
      title: 'Reward',
      key: 'reward',
      render: (_, record) => (
        <Space>
          <Avatar size={48} style={{ fontSize: 24 }}>
            {record.image}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.description}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: Reward['type']) => {
        const colors: Record<Reward['type'], string> = {
          discount: 'blue',
          product: 'purple',
          shipping: 'green',
          voucher: 'orange',
        };
        return <Tag color={colors[type]}>{type.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Discount', value: 'discount' },
        { text: 'Product', value: 'product' },
        { text: 'Shipping', value: 'shipping' },
        { text: 'Voucher', value: 'voucher' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Points Cost',
      dataIndex: 'pointsCost',
      key: 'pointsCost',
      render: (points) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text strong>{points.toLocaleString()}</Text>
        </Space>
      ),
      sorter: (a, b) => a.pointsCost - b.pointsCost,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => <Text strong style={{ color: '#52c41a' }}>{value}</Text>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 50 ? 'green' : stock > 20 ? 'orange' : 'red'}>{stock} available</Tag>
      ),
    },
    {
      title: 'Redeemed',
      dataIndex: 'redeemed',
      key: 'redeemed',
      render: (redeemed) => <Text type="secondary">{redeemed} times</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<GiftOutlined />}
          onClick={() => handleRedeemReward(record)}
          disabled={record.stock === 0}
        >
          Redeem
        </Button>
      ),
    },
  ];

  const redemptionColumns: ColumnsType<UserReward> = [
    {
      title: 'User',
      key: 'user',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text>{record.userName}</Text>
        </Space>
      ),
    },
    {
      title: 'Reward',
      dataIndex: 'rewardName',
      key: 'rewardName',
    },
    {
      title: 'Points Spent',
      dataIndex: 'pointsSpent',
      key: 'pointsSpent',
      render: (points) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{points.toLocaleString()}</Text>
        </Space>
      ),
    },
    {
      title: 'Redeemed At',
      dataIndex: 'redeemedAt',
      key: 'redeemedAt',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserReward['status']) => {
        const config: Record<UserReward['status'], { color: string; text: string }> = {
          pending: { color: 'orange', text: 'Pending' },
          claimed: { color: 'green', text: 'Claimed' },
          expired: { color: 'red', text: 'Expired' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Claimed', value: 'claimed' },
        { text: 'Expired', value: 'expired' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  const totalRedemptions = mockRedemptions.length;
  const totalPointsSpent = mockRedemptions.reduce((sum, r) => sum + r.pointsSpent, 0);
  const activeRewards = mockRewards.filter((r) => r.stock > 0).length;
  const avgRedemptionValue = totalPointsSpent / totalRedemptions;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <GiftOutlined style={{ color: '#1890ff' }} /> Rewards & Redemption
        </Title>
        <Paragraph type="secondary">
          Manage loyalty rewards, track redemptions, and configure tier benefits
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Rewards"
              value={activeRewards}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={`/ ${mockRewards.length}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Redemptions"
              value={totalRedemptions}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Points Redeemed"
              value={totalPointsSpent}
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Redemption"
              value={avgRedemptionValue}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={0}
              suffix="pts"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card title="Available Rewards" style={{ marginBottom: 16 }}>
            <Table
              columns={rewardColumns}
              dataSource={mockRewards}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Card title="Recent Redemptions">
            <Table
              columns={redemptionColumns}
              dataSource={mockRedemptions}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Loyalty Tiers" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {loyaltyTiers.map((tier, index) => (
                <Card
                  key={tier.name}
                  size="small"
                  style={{ borderLeft: `4px solid ${tier.color}` }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <TrophyOutlined style={{ fontSize: 24, color: tier.color }} />
                        <Text strong style={{ fontSize: 16 }}>
                          {tier.name}
                        </Text>
                      </Space>
                      <Tag color={tier.color}>{tier.multiplier}x</Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {tier.minPoints.toLocaleString()}+ points required
                    </Text>
                    <Divider style={{ margin: '8px 0' }} />
                    <div>
                      <Text strong style={{ fontSize: 12 }}>
                        Benefits:
                      </Text>
                      <ul style={{ margin: '4px 0', paddingLeft: 20, fontSize: 12 }}>
                        {tier.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>

          <Card title="Popular Rewards">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {mockRewards
                .sort((a, b) => b.redeemed - a.redeemed)
                .slice(0, 5)
                .map((reward) => (
                  <div key={reward.id}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Space>
                        <span style={{ fontSize: 20 }}>{reward.image}</span>
                        <div>
                          <Text strong style={{ fontSize: 12 }}>
                            {reward.name}
                          </Text>
                          <div>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              {reward.pointsCost} pts
                            </Text>
                          </div>
                        </div>
                      </Space>
                      <Tag color="blue">{reward.redeemed}</Tag>
                    </Space>
                    <Progress
                      percent={(reward.redeemed / (reward.stock + reward.redeemed)) * 100}
                      size="small"
                      showInfo={false}
                    />
                  </div>
                ))}
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={`Redeem: ${selectedReward?.name}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmRedemption}>
            Confirm Redemption
          </Button>,
        ]}
      >
        {selectedReward && (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48 }}>{selectedReward.image}</div>
              <Title level={4}>{selectedReward.name}</Title>
              <Paragraph type="secondary">{selectedReward.description}</Paragraph>
            </div>
            <Divider />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Points Cost:</Text>
              <Text strong style={{ color: '#faad14' }}>
                <StarOutlined /> {selectedReward.pointsCost.toLocaleString()}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Value:</Text>
              <Text strong style={{ color: '#52c41a' }}>
                {selectedReward.value}
              </Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>Stock Available:</Text>
              <Tag color={selectedReward.stock > 50 ? 'green' : 'orange'}>
                {selectedReward.stock} remaining
              </Tag>
            </div>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default RewardsRedemptionPage;
