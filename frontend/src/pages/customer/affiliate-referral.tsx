import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Select,
  DatePicker,
  Input,
  message,
  Statistic,
  Progress,
  Tooltip,
  Badge,
  Modal,
  Descriptions,
} from 'antd';
import {
  TeamOutlined,
  DollarOutlined,
  ShoppingOutlined,
  TrophyOutlined,
  UserAddOutlined,
  ShareAltOutlined,
  GiftOutlined,
  CopyOutlined,
  LinkOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { Line, Column } from '@ant-design/charts';

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

interface Referral {
  id: number;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'completed';
  signupDate: string;
  firstPurchaseDate: string;
  totalSpent: number;
  commission: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface Commission {
  id: number;
  date: string;
  referralName: string;
  orderAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: 'pending' | 'approved' | 'paid';
}

const mockReferrals: Referral[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    status: 'completed',
    signupDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    firstPurchaseDate: dayjs().subtract(28, 'days').format('YYYY-MM-DD'),
    totalSpent: 450,
    commission: 45,
    tier: 'gold',
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane@example.com',
    status: 'active',
    signupDate: dayjs().subtract(15, 'days').format('YYYY-MM-DD'),
    firstPurchaseDate: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    totalSpent: 200,
    commission: 20,
    tier: 'silver',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'pending',
    signupDate: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    firstPurchaseDate: '',
    totalSpent: 0,
    commission: 0,
    tier: 'bronze',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    status: 'completed',
    signupDate: dayjs().subtract(60, 'days').format('YYYY-MM-DD'),
    firstPurchaseDate: dayjs().subtract(55, 'days').format('YYYY-MM-DD'),
    totalSpent: 800,
    commission: 80,
    tier: 'platinum',
  },
];

const mockCommissions: Commission[] = [
  {
    id: 1,
    date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    referralName: 'John Smith',
    orderAmount: 150,
    commissionRate: 10,
    commissionAmount: 15,
    status: 'approved',
  },
  {
    id: 2,
    date: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    referralName: 'Alice Brown',
    orderAmount: 300,
    commissionRate: 10,
    commissionAmount: 30,
    status: 'paid',
  },
  {
    id: 3,
    date: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    referralName: 'Jane Doe',
    orderAmount: 100,
    commissionRate: 10,
    commissionAmount: 10,
    status: 'pending',
  },
];

const AffiliateReferralPage: React.FC = () => {
  const [referralCode] = useState<string>('REF-ABC123');
  const [referralLink] = useState<string>('https://example.com/ref/ABC123');
  const [isShareModalVisible, setIsShareModalVisible] = useState<boolean>(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    message.success('Referral code copied to clipboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    message.success('Referral link copied to clipboard');
  };

  const handleShareLink = () => {
    setIsShareModalVisible(true);
  };

  const referralColumns: ColumnsType<Referral> = [
    {
      title: 'Referral',
      key: 'referral',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Referral['status']) => {
        const config: Record<Referral['status'], { color: string; text: string }> = {
          pending: { color: 'orange', text: 'Pending' },
          active: { color: 'blue', text: 'Active' },
          completed: { color: 'green', text: 'Completed' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Active', value: 'active' },
        { text: 'Completed', value: 'completed' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier',
      render: (tier: Referral['tier']) => {
        const config: Record<Referral['tier'], { color: string; icon: React.ReactNode }> = {
          bronze: { color: '#cd7f32', icon: <TrophyOutlined /> },
          silver: { color: '#c0c0c0', icon: <TrophyOutlined /> },
          gold: { color: '#ffd700', icon: <TrophyOutlined /> },
          platinum: { color: '#e5e4e2', icon: <TrophyOutlined /> },
        };
        return (
          <Tag color={config[tier].color} icon={config[tier].icon}>
            {tier.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Signup Date',
      dataIndex: 'signupDate',
      key: 'signupDate',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount) => <Text strong>${amount}</Text>,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Commission Earned',
      dataIndex: 'commission',
      key: 'commission',
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${amount}
        </Text>
      ),
      sorter: (a, b) => a.commission - b.commission,
    },
  ];

  const commissionColumns: ColumnsType<Commission> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <Text>{dayjs(date).format('MMM DD, YYYY')}</Text>,
    },
    {
      title: 'Referral',
      dataIndex: 'referralName',
      key: 'referralName',
    },
    {
      title: 'Order Amount',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render: (amount) => <Text>${amount}</Text>,
    },
    {
      title: 'Commission Rate',
      dataIndex: 'commissionRate',
      key: 'commissionRate',
      render: (rate) => <Text>{rate}%</Text>,
    },
    {
      title: 'Commission',
      dataIndex: 'commissionAmount',
      key: 'commissionAmount',
      render: (amount) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${amount}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Commission['status']) => {
        const config: Record<Commission['status'], { color: string; text: string }> = {
          pending: { color: 'orange', text: 'Pending' },
          approved: { color: 'blue', text: 'Approved' },
          paid: { color: 'green', text: 'Paid' },
        };
        return <Tag color={config[status].color}>{config[status].text}</Tag>;
      },
    },
  ];

  const totalReferrals = mockReferrals.length;
  const activeReferrals = mockReferrals.filter((r) => r.status === 'active').length;
  const totalCommission = mockReferrals.reduce((sum, r) => sum + r.commission, 0);
  const pendingCommission = mockCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.commissionAmount, 0);

  const referralTrendData = [
    { month: 'Jan', referrals: 5 },
    { month: 'Feb', referrals: 8 },
    { month: 'Mar', referrals: 12 },
    { month: 'Apr', referrals: 15 },
    { month: 'May', referrals: 20 },
    { month: 'Jun', referrals: 25 },
  ];

  const commissionData = [
    { month: 'Jan', commission: 50 },
    { month: 'Feb', commission: 80 },
    { month: 'Mar', commission: 120 },
    { month: 'Apr', commission: 150 },
    { month: 'May', commission: 200 },
    { month: 'Jun', commission: 250 },
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TeamOutlined style={{ color: '#1890ff' }} /> Affiliate & Referral Program
        </Title>
        <Paragraph type="secondary">
          Earn commissions by referring friends and family to our store
        </Paragraph>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Referrals"
              value={totalReferrals}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Referrals"
              value={activeReferrals}
              prefix={<UserAddOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Commission"
              value={totalCommission}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Commission"
              value={pendingCommission}
              prefix="$"
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Your Referral Code">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div
                style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 8,
                  textAlign: 'center',
                }}
              >
                <Text style={{ color: 'white', fontSize: 12, display: 'block', marginBottom: 8 }}>
                  Your Referral Code
                </Text>
                <Text strong style={{ color: 'white', fontSize: 32, letterSpacing: 4 }}>
                  {referralCode}
                </Text>
              </div>

              <Space style={{ width: '100%', justifyContent: 'center' }} size="middle">
                <Button icon={<CopyOutlined />} onClick={handleCopyCode}>
                  Copy Code
                </Button>
                <Button type="primary" icon={<ShareAltOutlined />} onClick={handleShareLink}>
                  Share Link
                </Button>
              </Space>

              <div>
                <Text type="secondary" style={{ display: 'block', marginBottom: 8, fontSize: 12 }}>
                  Your Referral Link:
                </Text>
                <Input
                  value={referralLink}
                  readOnly
                  addonAfter={
                    <Tooltip title="Copy Link">
                      <LinkOutlined onClick={handleCopyLink} style={{ cursor: 'pointer' }} />
                    </Tooltip>
                  }
                />
              </div>

              <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 4 }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  How it works:
                </Text>
                <ol style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>Share your referral code or link with friends</li>
                  <li>They sign up and make their first purchase</li>
                  <li>You earn 10% commission on their orders</li>
                  <li>Your friend gets 15% off their first order</li>
                </ol>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Commission Tiers">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                  <Col>
                    <Space>
                      <TrophyOutlined style={{ color: '#cd7f32' }} />
                      <Text strong>Bronze (0-5 referrals)</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text>10% commission</Text>
                  </Col>
                </Row>
                <Progress percent={100} strokeColor="#cd7f32" showInfo={false} />
              </div>

              <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                  <Col>
                    <Space>
                      <TrophyOutlined style={{ color: '#c0c0c0' }} />
                      <Text strong>Silver (6-15 referrals)</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text>12% commission</Text>
                  </Col>
                </Row>
                <Progress percent={40} strokeColor="#c0c0c0" showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  2 more referrals to unlock
                </Text>
              </div>

              <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                  <Col>
                    <Space>
                      <TrophyOutlined style={{ color: '#ffd700' }} />
                      <Text strong>Gold (16-30 referrals)</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text>15% commission</Text>
                  </Col>
                </Row>
                <Progress percent={0} strokeColor="#ffd700" showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Locked
                </Text>
              </div>

              <div>
                <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
                  <Col>
                    <Space>
                      <TrophyOutlined style={{ color: '#e5e4e2' }} />
                      <Text strong>Platinum (31+ referrals)</Text>
                    </Space>
                  </Col>
                  <Col>
                    <Text>20% commission</Text>
                  </Col>
                </Row>
                <Progress percent={0} strokeColor="#e5e4e2" showInfo={false} />
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Locked
                </Text>
              </div>

              <div style={{ background: '#f6ffed', padding: 12, borderRadius: 4, border: '1px solid #b7eb8f' }}>
                <Space>
                  <GiftOutlined style={{ color: '#52c41a' }} />
                  <div>
                    <Text strong style={{ color: '#52c41a', display: 'block', fontSize: 12 }}>
                      Bonus: Unlock Silver tier to get a $50 bonus!
                    </Text>
                  </div>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="Referral Trend">
            <Line
              data={referralTrendData}
              xField="month"
              yField="referrals"
              height={250}
              point={{ size: 5, shape: 'diamond' }}
              label={{
                style: {
                  fill: '#1890ff',
                },
              }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Commission Earned">
            <Column
              data={commissionData}
              xField="month"
              yField="commission"
              height={250}
              label={{
                position: 'top',
                style: {
                  fill: '#52c41a',
                },
              }}
              columnStyle={{
                fill: 'l(270) 0:#52c41a 1:#95de64',
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="My Referrals" style={{ marginBottom: 16 }}>
        <Table columns={referralColumns} dataSource={mockReferrals} rowKey="id" pagination={false} />
      </Card>

      <Card title="Commission History">
        <Table columns={commissionColumns} dataSource={mockCommissions} rowKey="id" pagination={false} />
      </Card>

      <Modal
        title="Share Your Referral Link"
        open={isShareModalVisible}
        onCancel={() => setIsShareModalVisible(false)}
        footer={null}
        width={500}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">Share via social media or email</Text>
          </div>

          <Input.TextArea
            value={`Join me on this amazing store! Use my referral code ${referralCode} and get 15% off your first order: ${referralLink}`}
            rows={4}
            readOnly
          />

          <Row gutter={16}>
            <Col span={12}>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => message.success('Sharing on Facebook')}
              >
                Facebook
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => message.success('Sharing on Twitter')}
              >
                Twitter
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => message.success('Copying WhatsApp message')}
              >
                WhatsApp
              </Button>
            </Col>
            <Col span={12}>
              <Button
                block
                icon={<ShareAltOutlined />}
                onClick={() => message.success('Opening email client')}
              >
                Email
              </Button>
            </Col>
          </Row>

          <Button type="primary" block icon={<CopyOutlined />} onClick={handleCopyLink}>
            Copy Link
          </Button>
        </Space>
      </Modal>
    </div>
  );
};

export default AffiliateReferralPage;
