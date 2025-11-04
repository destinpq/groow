import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Select,
  Table,
  Tag,
  Statistic,
  Space,
  Button,
  Progress,
  Alert,
  Tabs,
  Form,
  Input,
  Switch,
  message,
} from 'antd';
import {
  GlobalOutlined,
  TranslationOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  progress: number;
  status: 'active' | 'draft' | 'disabled';
  totalStrings: number;
  translatedStrings: number;
  rtl: boolean;
}

interface TranslationKey {
  key: string;
  category: string;
  english: string;
  translations: Record<string, string>;
  status: 'complete' | 'partial' | 'missing';
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    progress: 100,
    status: 'active',
    totalStrings: 500,
    translatedStrings: 500,
    rtl: false,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    progress: 95,
    status: 'active',
    totalStrings: 500,
    translatedStrings: 475,
    rtl: false,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    progress: 88,
    status: 'active',
    totalStrings: 500,
    translatedStrings: 440,
    rtl: false,
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    progress: 92,
    status: 'active',
    totalStrings: 500,
    translatedStrings: 460,
    rtl: false,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    progress: 75,
    status: 'draft',
    totalStrings: 500,
    translatedStrings: 375,
    rtl: false,
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    progress: 70,
    status: 'draft',
    totalStrings: 500,
    translatedStrings: 350,
    rtl: false,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    progress: 60,
    status: 'draft',
    totalStrings: 500,
    translatedStrings: 300,
    rtl: true,
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    progress: 45,
    status: 'draft',
    totalStrings: 500,
    translatedStrings: 225,
    rtl: false,
  },
];

const translationKeys: TranslationKey[] = [
  {
    key: 'common.welcome',
    category: 'Common',
    english: 'Welcome',
    translations: {
      es: 'Bienvenido',
      fr: 'Bienvenue',
      de: 'Willkommen',
      zh: '欢迎',
      ja: 'ようこそ',
      ar: 'مرحباً',
      hi: 'स्वागत है',
    },
    status: 'complete',
  },
  {
    key: 'common.search',
    category: 'Common',
    english: 'Search',
    translations: {
      es: 'Buscar',
      fr: 'Rechercher',
      de: 'Suchen',
      zh: '搜索',
      ja: '検索',
      ar: 'بحث',
      hi: 'खोज',
    },
    status: 'complete',
  },
  {
    key: 'product.addToCart',
    category: 'Product',
    english: 'Add to Cart',
    translations: {
      es: 'Añadir al carrito',
      fr: 'Ajouter au panier',
      de: 'In den Warenkorb',
      zh: '加入购物车',
      ja: 'カートに追加',
      ar: '',
      hi: '',
    },
    status: 'partial',
  },
  {
    key: 'checkout.placeOrder',
    category: 'Checkout',
    english: 'Place Order',
    translations: {
      es: 'Realizar pedido',
      fr: 'Passer commande',
      de: 'Bestellung aufgeben',
      zh: '下订单',
      ja: '注文する',
      ar: 'تقديم الطلب',
      hi: 'आर्डर करें',
    },
    status: 'complete',
  },
  {
    key: 'user.profile',
    category: 'User',
    english: 'Profile',
    translations: {
      es: 'Perfil',
      fr: 'Profil',
      de: 'Profil',
      zh: '',
      ja: '',
      ar: '',
      hi: '',
    },
    status: 'partial',
  },
];

const InternationalizationPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  const handleToggleLanguage = (code: string, enabled: boolean) => {
    message.success(`${enabled ? 'Enabled' : 'Disabled'} ${code.toUpperCase()}`);
  };

  const handleExportTranslations = (code: string) => {
    message.success(`Exported translations for ${code.toUpperCase()}`);
  };

  const languageColumns: ColumnsType<Language> = [
    {
      title: 'Language',
      key: 'language',
      render: (_, record) => (
        <Space>
          <span style={{ fontSize: 24 }}>{record.flag}</span>
          <div>
            <Text strong>{record.name}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.nativeName}
              </Text>
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (code) => <Tag>{code.toUpperCase()}</Tag>,
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, record) => (
        <div>
          <Progress percent={record.progress} size="small" />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.translatedStrings}/{record.totalStrings} strings
          </Text>
        </div>
      ),
      sorter: (a, b) => a.progress - b.progress,
    },
    {
      title: 'Direction',
      dataIndex: 'rtl',
      key: 'rtl',
      render: (rtl) => <Tag color={rtl ? 'orange' : 'blue'}>{rtl ? 'RTL' : 'LTR'}</Tag>,
      filters: [
        { text: 'LTR', value: false },
        { text: 'RTL', value: true },
      ],
      onFilter: (value, record) => record.rtl === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Language['status']) => {
        const colors: Record<Language['status'], string> = { 
          active: 'green', 
          draft: 'orange', 
          disabled: 'red' 
        };
        const icons: Record<Language['status'], React.ReactNode> = {
          active: <CheckCircleOutlined />,
          draft: <ClockCircleOutlined />,
          disabled: <ClockCircleOutlined />,
        };
        return (
          <Tag color={colors[status]} icon={icons[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Draft', value: 'draft' },
        { text: 'Disabled', value: 'disabled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => setSelectedLanguage(record.code)}
          >
            Edit
          </Button>
          <Button size="small" onClick={() => handleExportTranslations(record.code)}>
            Export
          </Button>
          <Switch
            size="small"
            checked={record.status === 'active'}
            onChange={(checked) => handleToggleLanguage(record.code, checked)}
          />
        </Space>
      ),
    },
  ];

  const translationColumns: ColumnsType<TranslationKey> = [
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      width: 200,
      render: (key) => <Text code>{key}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: [
        { text: 'Common', value: 'Common' },
        { text: 'Product', value: 'Product' },
        { text: 'Checkout', value: 'Checkout' },
        { text: 'User', value: 'User' },
      ],
      onFilter: (value, record) => record.category === value,
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: 'English',
      dataIndex: 'english',
      key: 'english',
      width: 150,
    },
    {
      title: selectedLanguage.toUpperCase(),
      key: 'translation',
      width: 200,
      render: (_, record) => {
        const translation = record.translations[selectedLanguage];
        return translation ? (
          <Text>{translation}</Text>
        ) : (
          <Text type="secondary" italic>
            Not translated
          </Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: TranslationKey['status']) => {
        const colors: Record<TranslationKey['status'], string> = { 
          complete: 'green', 
          partial: 'orange', 
          missing: 'red' 
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'Complete', value: 'complete' },
        { text: 'Partial', value: 'partial' },
        { text: 'Missing', value: 'missing' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button size="small" icon={<EditOutlined />}>
          Edit
        </Button>
      ),
    },
  ];

  const activeLanguages = languages.filter((l) => l.status === 'active').length;
  const avgProgress =
    languages.reduce((sum, l) => sum + l.progress, 0) / languages.length;

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <TranslationOutlined style={{ color: '#1890ff' }} /> Internationalization (i18n)
        </Title>
        <Paragraph type="secondary">
          Manage translations and multi-language support
        </Paragraph>
      </div>

      <Alert
        message="Multi-Language Support Active"
        description={`${activeLanguages} languages are currently active. Translations are automatically loaded based on user preferences.`}
        type="success"
        showIcon
        closable
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Languages"
              value={languages.length}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Languages"
              value={activeLanguages}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Progress"
              value={avgProgress}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Translation Keys"
              value={translationKeys.length}
              prefix={<TranslationOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="languages"
        items={[
          {
            key: 'languages',
            label: 'Languages',
            children: (
              <Card
                title="Supported Languages"
                extra={
                  <Button type="primary" icon={<PlusOutlined />}>
                    Add Language
                  </Button>
                }
              >
                <Table
                  columns={languageColumns}
                  dataSource={languages}
                  rowKey="code"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'translations',
            label: 'Translations',
            children: (
              <Card
                title="Translation Strings"
                extra={
                  <Space>
                    <Text>Viewing:</Text>
                    <Select
                      value={selectedLanguage}
                      onChange={setSelectedLanguage}
                      style={{ width: 150 }}
                    >
                      {languages.map((lang) => (
                        <Select.Option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="primary" icon={<PlusOutlined />}>
                      Add Key
                    </Button>
                  </Space>
                }
              >
                <Table
                  columns={translationColumns}
                  dataSource={translationKeys}
                  rowKey="key"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            ),
          },
          {
            key: 'settings',
            label: 'Settings',
            children: (
              <Card title="i18n Settings">
                <Form layout="vertical">
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Default Language">
                        <Select defaultValue="en" style={{ width: '100%' }}>
                          {languages.map((lang) => (
                            <Select.Option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Fallback Language">
                        <Select defaultValue="en" style={{ width: '100%' }}>
                          {languages.map((lang) => (
                            <Select.Option key={lang.code} value={lang.code}>
                              {lang.flag} {lang.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="Auto-detect User Language" valuePropName="checked">
                        <Switch defaultChecked />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="Show Language Switcher" valuePropName="checked">
                        <Switch defaultChecked />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item>
                        <Button type="primary">Save Settings</Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            ),
          },
        ]}
      />
    </div>
  );
};

export default InternationalizationPage;
