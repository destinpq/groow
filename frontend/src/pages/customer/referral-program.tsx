import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Space,
  Tag,
  message,
  List,
  Avatar,
  Statistic,
  Progress,
  Divider,
  Alert,
  Steps,
  Table,
  Tooltip,
  QRCode,
  Modal,
  Badge,
} from 'antd';
import {
  GiftOutlined,
  CopyOutlined,
  ShareAltOutlined,
  DollarOutlined,
  UserAddOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  QrcodeOutlined,
  MailOutlined,
  FacebookOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  LinkedinOutlined,
  StarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface Referral {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'signed_up' | 'purchased' | 'rewarded';
  signupDate?: string;
  purchaseDate?: string;
  rewardAmount: number;
  orderValue?: number;
}

interface Reward {
  id: number;
  type: 'store_credit' | 'discount' | 'cashback';
  amount: number;
  description: string;
  earnedDate: string;
  expiryDate?: string;
  status: 'pending' | 'available' | 'used' | 'expired';
}

interface ReferralTier {
  name: string;
  minReferrals: number;
  bonusPercentage: number;
  perks: string[];
  color: string;
  icon: React.ReactNode;
}

const mockReferrals: Referral[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@email.com',
    status: 'rewarded',
    signupDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    purchaseDate: dayjs().subtract(25, 'days').format('YYYY-MM-DD'),
    rewardAmount: 25,
    orderValue: 150,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@email.com',
    status: 'purchased',
    signupDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    purchaseDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    rewardAmount: 25,
    orderValue: 200,
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@email.com',
    status: 'signed_up',
    signupDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    rewardAmount: 0,
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@email.com',
    status: 'pending',
    rewardAmount: 0,
  },
];

const mockRewards: Reward[] = [
  {
    id: 1,
    type: 'store_credit',
    amount: 25,
    description: 'Referral reward for John Doe purchase',
    earnedDate: dayjs().subtract(25, 'days').format('YYYY-MM-DD'),
    status: 'used',
  },
  {
    id: 2,
    type: 'store_credit',
    amount: 25,
    description: 'Referral reward for Jane Smith purchase',
    earnedDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    expiryDate: dayjs().add(80, 'days').format('YYYY-MM-DD'),
    status: 'available',
  },
];

const referralTiers: ReferralTier[] = [
  {
    name: 'Bronze',
    minReferrals: 0,
    bonusPercentage: 0,
    perks: ['$10 per referral', 'Basic rewards'],
    color: '#CD7F32',
    icon: <StarOutlined />,
  },
  {
    name: 'Silver',
    minReferrals: 5,
    bonusPercentage: 10,
    perks: ['$10 per referral', '10% bonus rewards', 'Priority support'],
    color: '#C0C0C0',
    icon: <StarOutlined />,
  },
  {
    name: 'Gold',
    minReferrals: 15,
    bonusPercentage: 20,
    perks: ['$15 per referral', '20% bonus rewards', 'Exclusive deals', 'Early access'],
    color: '#FFD700',
    icon: <TrophyOutlined />,
  },
  {
    name: 'Platinum',
    minReferrals: 30,
    bonusPercentage: 30,
    perks: [
      '$20 per referral',
      '30% bonus rewards',
      'VIP support',
      'Exclusive events',
      'Special gifts',
    ],
    color: '#E5E4E2',
    icon: <TrophyOutlined />,
  },
];

const ReferralProgramPage: React.FC = () => {
  const [referrals] = useState<Referral[]>(mockReferrals);
  const [rewards] = useState<Reward[]>(mockRewards);
  const [isQRModalVisible, setIsQRModalVisible] = useState<boolean>(false);

  const referralCode = 'JOHN2024';
  const referralLink = `https://shop.com/ref/${referralCode}`;

  const successfulReferrals = referrals.filter((r) => r.status === 'rewarded').length;
  const pendingReferrals = referrals.filter((r) => r.status === 'pending' || r.status === 'signed_up').length;
  const totalEarnings = rewards.reduce((sum, r) => sum + r.amount, 0);
  const availableBalance = rewards
    .filter((r) => r.status === 'available')
    .reduce((sum, r) => sum + r.amount, 0);

  const getCurrentTier = () => {
    for (let i = referralTiers.length - 1; i >= 0; i--) {
      if (successfulReferrals >= referralTiers[i].minReferrals) {
        return referralTiers[i];
      }
    }
    return referralTiers[0];
  };

  const getNextTier = () => {
    const currentTier = getCurrentTier();
    const currentIndex = referralTiers.findIndex((t) => t.name === currentTier.name);
    return currentIndex < referralTiers.length - 1 ? referralTiers[currentIndex + 1] : null;
  };

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();
  const referralsToNextTier = nextTier ? nextTier.minReferrals - successfulReferrals : 0;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    message.success('Referral code copied!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    message.success('Referral link copied!');
  };

  const handleShare = (platform: string) => {
    const text = `Join me on Shop.com and get $10 off your first order! Use my referral code: ${referralCode}`;
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
      email: `mailto:?subject=Join me on Shop.com&body=${encodeURIComponent(text + '\n\n' + referralLink)}`,
    };
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  const referralColumns: ColumnsType<Referral> = [
    {
      title: 'Friend',
      key: 'friend',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>{record.name[0]}</Avatar>
          <div>
            <div>
              <Text strong>{record.name}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Referral['status']) => {
        const statusConfig = {
          pending: { color: 'default', text: 'Invited', icon: <MailOutlined /> },
          signed_up: { color: 'processing', text: 'Signed Up', icon: <UserAddOutlined /> },
          purchased: { color: 'warning', text: 'Purchased', icon: <CheckCircleOutlined /> },
          rewarded: { color: 'success', text: 'Rewarded', icon: <GiftOutlined /> },
        };
        const config = statusConfig[status];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Signup Date',
      dataIndex: 'signupDate',
      key: 'signupDate',
      render: (date) => (date ? dayjs(date).format('MMM DD, YYYY') : '-'),
    },
    {
      title: 'Order Value',
      dataIndex: 'orderValue',
      key: 'orderValue',
      render: (value) => (value ? `$${value.toFixed(2)}` : '-'),
    },
    {
      title: 'Your Reward',
      dataIndex: 'rewardAmount',
      key: 'reward',
      render: (amount) => (
        <Text strong style={{ color: amount > 0 ? '#52c41a' : '#999' }}>
          ${amount.toFixed(2)}
        </Text>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <GiftOutlined style={{ color: '#1890ff' }} /> Referral Program
          </Title>
          <Paragraph type="secondary">Share the love and earn rewards!</Paragraph>
        </Col>
      </Row>

      <Alert
        message="🎉 Give $10, Get $10!"
        description="Share your referral link with friends. When they make their first purchase, you both get $10 in store credit!"
        type="success"
        showIcon={false}
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Referrals"
              value={successfulReferrals}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Pending"
              value={pendingReferrals}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Earned"
              value={totalEarnings}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Available Balance"
              value={availableBalance}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <ShareAltOutlined />
                <span>Share Your Referral Link</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong style={{ marginBottom: 8, display: 'block' }}>
                  Your Referral Code
                </Text>
                <Input
                  size="large"
                  value={referralCode}
                  readOnly
                  addonAfter={
                    <Tooltip title="Copy code">
                      <CopyOutlined onClick={handleCopyCode} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  }
                  style={{ fontWeight: 'bold', fontSize: 18 }}
                />
              </div>

              <div>
                <Text strong style={{ marginBottom: 8, display: 'block' }}>
                  Your Referral Link
                </Text>
                <Input
                  size="large"
                  value={referralLink}
                  readOnly
                  addonAfter={
                    <Tooltip title="Copy link">
                      <CopyOutlined onClick={handleCopyLink} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  }
                />
              </div>

              <Divider>Share Via</Divider>

              <Row gutter={16} justify="center">
                <Col>
                  <Button
                    size="large"
                    icon={<FacebookOutlined />}
                    onClick={() => handleShare('facebook')}
                    style={{ background: '#1877f2', color: '#fff', border: 'none' }}
                  >
                    Facebook
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    icon={<TwitterOutlined />}
                    onClick={() => handleShare('twitter')}
                    style={{ background: '#1da1f2', color: '#fff', border: 'none' }}
                  >
                    Twitter
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    icon={<WhatsAppOutlined />}
                    onClick={() => handleShare('whatsapp')}
                    style={{ background: '#25d366', color: '#fff', border: 'none' }}
                  >
                    WhatsApp
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    icon={<LinkedinOutlined />}
                    onClick={() => handleShare('linkedin')}
                    style={{ background: '#0077b5', color: '#fff', border: 'none' }}
                  >
                    LinkedIn
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    icon={<MailOutlined />}
                    onClick={() => handleShare('email')}
                  >
                    Email
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    icon={<QrcodeOutlined />}
                    onClick={() => setIsQRModalVisible(true)}
                  >
                    QR Code
                  </Button>
                </Col>
              </Row>
            </Space>
          </Card>

          <Card title="How It Works">
            <Steps
              direction="vertical"
              current={-1}
              items={[
                {
                  title: 'Share Your Link',
                  description:
                    'Send your unique referral link to friends and family via email, social media, or messaging apps.',
                  icon: <ShareAltOutlined />,
                },
                {
                  title: 'Friend Signs Up',
                  description:
                    'Your friend creates an account using your referral link and gets $10 off their first order.',
                  icon: <UserAddOutlined />,
                },
                {
                  title: 'Friend Makes Purchase',
                  description:
                    'When your friend completes their first purchase, you earn $10 in store credit!',
                  icon: <DollarOutlined />,
                },
                {
                  title: 'Get Your Reward',
                  description:
                    'Use your earned credits on any future purchase. Credits are automatically applied at checkout.',
                  icon: <GiftOutlined />,
                },
              ]}
            />
          </Card>

          <Card title="Your Referrals" style={{ marginTop: 24 }}>
            <Table
              columns={referralColumns}
              dataSource={referrals}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <span>Your Tier Status</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 48,
                  color: currentTier.color,
                  marginBottom: 8,
                }}
              >
                {currentTier.icon}
              </div>
              <Title level={3} style={{ margin: 0, color: currentTier.color }}>
                {currentTier.name}
              </Title>
              <Text type="secondary">Current Tier</Text>
            </div>

            <List
              size="small"
              header={<Text strong>Your Perks</Text>}
              dataSource={currentTier.perks}
              renderItem={(perk) => (
                <List.Item>
                  <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                  {perk}
                </List.Item>
              )}
            />

            {nextTier && (
              <>
                <Divider />
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Progress to {nextTier.name}</Text>
                  </div>
                  <Progress
                    percent={(successfulReferrals / nextTier.minReferrals) * 100}
                    strokeColor={nextTier.color}
                    format={() => `${successfulReferrals}/${nextTier.minReferrals}`}
                  />
                  <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                    {referralsToNextTier} more referrals to unlock {nextTier.name} tier!
                  </Text>
                </div>
              </>
            )}
          </Card>

          <Card title="All Tiers">
            <List
              dataSource={referralTiers}
              renderItem={(tier) => {
                const isCurrentTier = tier.name === currentTier.name;
                const isUnlocked = successfulReferrals >= tier.minReferrals;

                return (
                  <List.Item
                    style={{
                      background: isCurrentTier ? '#e6f7ff' : 'transparent',
                      padding: 12,
                      borderRadius: 8,
                      marginBottom: 8,
                      border: isCurrentTier ? '2px solid #1890ff' : '1px solid #f0f0f0',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          style={{
                            backgroundColor: tier.color,
                            color: '#000',
                          }}
                        >
                          {tier.icon}
                        </Avatar>
                      }
                      title={
                        <Space>
                          <Text strong style={{ color: tier.color }}>
                            {tier.name}
                          </Text>
                          {isCurrentTier && <Tag color="blue">Current</Tag>}
                          {isUnlocked && !isCurrentTier && (
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          )}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {tier.minReferrals}+ successful referrals
                          </Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            +{tier.bonusPercentage}% bonus rewards
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="QR Code"
        open={isQRModalVisible}
        onCancel={() => setIsQRModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsQRModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: 24 }}>
          <QRCode value={referralLink} size={256} />
          <Paragraph style={{ marginTop: 16 }}>
            Share this QR code with friends to let them scan and join!
          </Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default ReferralProgramPage;
