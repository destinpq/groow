import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Tag,
  Modal,
  Form,
  Input,
  message,
  Avatar,
  Divider,
  Tooltip,
  Badge,
  Select,
} from 'antd';
import {
  QuestionCircleOutlined,
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Answer {
  id: number;
  text: string;
  answeredBy: 'seller' | 'customer';
  answererName: string;
  answeredAt: string;
  isVerified: boolean;
  helpfulVotes: number;
  isHelpful: boolean;
}

interface Question {
  id: number;
  question: string;
  askedBy: string;
  askedAt: string;
  category: 'product-info' | 'shipping' | 'compatibility' | 'warranty' | 'other';
  status: 'answered' | 'pending' | 'no-answer';
  answers: Answer[];
  helpfulVotes: number;
  isHelpful: boolean;
  totalAnswers: number;
}

const mockQuestions: Question[] = [
  {
    id: 1,
    question: 'Is this laptop suitable for video editing with 4K footage?',
    askedBy: 'John D.',
    askedAt: dayjs().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
    category: 'product-info',
    status: 'answered',
    helpfulVotes: 15,
    isHelpful: true,
    totalAnswers: 2,
    answers: [
      {
        id: 1,
        text: 'Yes! This laptop comes with 32GB RAM and RTX 4060 graphics card, which handles 4K video editing smoothly in Adobe Premiere Pro and DaVinci Resolve. I use it daily for professional video work.',
        answeredBy: 'seller',
        answererName: 'TechStore Official',
        answeredAt: dayjs().subtract(2, 'days').add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        isVerified: true,
        helpfulVotes: 12,
        isHelpful: true,
      },
      {
        id: 2,
        text: "I've been using this for 3 months now. It handles 4K editing really well. No issues with timeline scrubbing or rendering.",
        answeredBy: 'customer',
        answererName: 'Sarah M.',
        answeredAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
        isVerified: false,
        helpfulVotes: 8,
        isHelpful: false,
      },
    ],
  },
  {
    id: 2,
    question: 'Does this come with a warranty? If so, how long?',
    askedBy: 'Mike R.',
    askedAt: dayjs().subtract(5, 'days').format('YYYY-MM-DD HH:mm:ss'),
    category: 'warranty',
    status: 'answered',
    helpfulVotes: 10,
    isHelpful: false,
    totalAnswers: 1,
    answers: [
      {
        id: 3,
        text: 'This product comes with a 2-year manufacturer warranty covering hardware defects. We also offer extended warranty options at checkout.',
        answeredBy: 'seller',
        answererName: 'TechStore Official',
        answeredAt: dayjs().subtract(5, 'days').add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
        isVerified: true,
        helpfulVotes: 10,
        isHelpful: false,
      },
    ],
  },
  {
    id: 3,
    question: 'Can this laptop run the latest games at high settings?',
    askedBy: 'Alex T.',
    askedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    category: 'product-info',
    status: 'pending',
    helpfulVotes: 3,
    isHelpful: false,
    totalAnswers: 0,
    answers: [],
  },
  {
    id: 4,
    question: 'What is the expected delivery time for international shipping?',
    askedBy: 'Emma W.',
    askedAt: dayjs().subtract(3, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    category: 'shipping',
    status: 'pending',
    helpfulVotes: 1,
    isHelpful: false,
    totalAnswers: 0,
    answers: [],
  },
  {
    id: 5,
    question: 'Is the RAM upgradeable? What is the maximum supported?',
    askedBy: 'Tom H.',
    askedAt: dayjs().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
    category: 'compatibility',
    status: 'answered',
    helpfulVotes: 20,
    isHelpful: true,
    totalAnswers: 2,
    answers: [
      {
        id: 4,
        text: 'Yes, the laptop has 2 SO-DIMM slots. It comes with 32GB (2x16GB) and supports up to 64GB (2x32GB) DDR5 RAM.',
        answeredBy: 'seller',
        answererName: 'TechStore Official',
        answeredAt: dayjs().subtract(7, 'days').add(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
        isVerified: true,
        helpfulVotes: 18,
        isHelpful: true,
      },
      {
        id: 5,
        text: 'Just upgraded mine to 64GB last week. Super easy process, took only 10 minutes!',
        answeredBy: 'customer',
        answererName: 'Chris P.',
        answeredAt: dayjs().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
        isVerified: false,
        helpfulVotes: 5,
        isHelpful: false,
      },
    ],
  },
];

const ProductQAPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isAskModalVisible, setIsAskModalVisible] = useState<boolean>(false);
  const [isAnswerModalVisible, setIsAnswerModalVisible] = useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [form] = Form.useForm();
  const [answerForm] = Form.useForm();

  const handleAskQuestion = () => {
    setIsAskModalVisible(true);
  };

  const handleSubmitQuestion = (values: any) => {
    const newQuestion: Question = {
      id: questions.length + 1,
      question: values.question,
      askedBy: 'You',
      askedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      category: values.category,
      status: 'pending',
      helpfulVotes: 0,
      isHelpful: false,
      totalAnswers: 0,
      answers: [],
    };

    setQuestions([newQuestion, ...questions]);
    message.success('Question posted successfully! You will be notified when someone answers.');
    setIsAskModalVisible(false);
    form.resetFields();
  };

  const handleAnswerQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsAnswerModalVisible(true);
  };

  const handleSubmitAnswer = (values: any) => {
    if (!selectedQuestion) return;

    const newAnswer: Answer = {
      id: selectedQuestion.answers.length + 1,
      text: values.answer,
      answeredBy: 'customer',
      answererName: 'You',
      answeredAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      isVerified: false,
      helpfulVotes: 0,
      isHelpful: false,
    };

    setQuestions(
      questions.map((q) =>
        q.id === selectedQuestion.id
          ? {
              ...q,
              status: 'answered',
              totalAnswers: q.totalAnswers + 1,
              answers: [...q.answers, newAnswer],
            }
          : q
      )
    );

    message.success('Answer posted successfully!');
    setIsAnswerModalVisible(false);
    answerForm.resetFields();
  };

  const handleToggleQuestionHelpful = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              isHelpful: !q.isHelpful,
              helpfulVotes: q.isHelpful ? q.helpfulVotes - 1 : q.helpfulVotes + 1,
            }
          : q
      )
    );
  };

  const handleToggleAnswerHelpful = (questionId: number, answerId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a) =>
                a.id === answerId
                  ? {
                      ...a,
                      isHelpful: !a.isHelpful,
                      helpfulVotes: a.isHelpful ? a.helpfulVotes - 1 : a.helpfulVotes + 1,
                    }
                  : a
              ),
            }
          : q
      )
    );
  };

  const filteredQuestions = questions.filter((q) => {
    if (filterStatus !== 'all' && q.status !== filterStatus) return false;
    if (filterCategory !== 'all' && q.category !== filterCategory) return false;
    return true;
  });

  const categoryConfig: Record<string, { color: string; text: string }> = {
    'product-info': { color: 'blue', text: 'Product Info' },
    shipping: { color: 'green', text: 'Shipping' },
    compatibility: { color: 'purple', text: 'Compatibility' },
    warranty: { color: 'orange', text: 'Warranty' },
    other: { color: 'default', text: 'Other' },
  };

  const statusConfig: Record<string, { color: string; text: string; icon: React.ReactNode }> = {
    answered: { color: 'green', text: 'Answered', icon: <CheckCircleOutlined /> },
    pending: { color: 'orange', text: 'Pending', icon: <ClockCircleOutlined /> },
    'no-answer': { color: 'red', text: 'No Answer', icon: <QuestionCircleOutlined /> },
  };

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3}>
            <QuestionCircleOutlined style={{ color: '#1890ff' }} /> Product Q&A
          </Title>
          <Paragraph type="secondary">
            Ask questions and get answers from the community and sellers
          </Paragraph>
        </Col>
        <Col>
          <Button type="primary" icon={<QuestionCircleOutlined />} onClick={handleAskQuestion}>
            Ask a Question
          </Button>
        </Col>
      </Row>

      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Filter by:</Text>
          </Col>
          <Col>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: 150 }}
              placeholder="Status"
            >
              <Option value="all">All Status</Option>
              <Option value="answered">Answered</Option>
              <Option value="pending">Pending</Option>
              <Option value="no-answer">No Answer</Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={filterCategory}
              onChange={setFilterCategory}
              style={{ width: 150 }}
              placeholder="Category"
            >
              <Option value="all">All Categories</Option>
              <Option value="product-info">Product Info</Option>
              <Option value="shipping">Shipping</Option>
              <Option value="compatibility">Compatibility</Option>
              <Option value="warranty">Warranty</Option>
              <Option value="other">Other</Option>
            </Select>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Text type="secondary">{filteredQuestions.length} questions</Text>
          </Col>
        </Row>
      </Card>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {filteredQuestions.map((question) => (
          <Card key={question.id}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 12 }}>
                  <Space>
                    <Tag color={categoryConfig[question.category].color}>
                      {categoryConfig[question.category].text}
                    </Tag>
                    <Tag color={statusConfig[question.status].color} icon={statusConfig[question.status].icon}>
                      {statusConfig[question.status].text}
                    </Tag>
                    {question.totalAnswers > 0 && (
                      <Badge count={question.totalAnswers} showZero style={{ backgroundColor: '#52c41a' }}>
                        <MessageOutlined style={{ fontSize: 16, color: '#52c41a' }} />
                      </Badge>
                    )}
                  </Space>
                </div>

                <Title level={5} style={{ marginBottom: 8 }}>
                  <QuestionCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                  {question.question}
                </Title>

                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Asked by <Text strong>{question.askedBy}</Text> • {dayjs(question.askedAt).fromNow()}
                    </Text>
                  </Space>
                </div>

                {question.answers.length > 0 && (
                  <div style={{ background: '#fafafa', padding: 16, borderRadius: 8, marginTop: 16 }}>
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                      {question.answers.map((answer) => (
                        <div key={answer.id}>
                          <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                            <Avatar
                              size="small"
                              icon={answer.answeredBy === 'seller' ? <ShopOutlined /> : <UserOutlined />}
                              style={{
                                background: answer.answeredBy === 'seller' ? '#1890ff' : '#52c41a',
                              }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ marginBottom: 4 }}>
                                <Space>
                                  <Text strong>{answer.answererName}</Text>
                                  {answer.isVerified && (
                                    <Tooltip title="Verified Seller">
                                      <CheckCircleOutlined style={{ color: '#1890ff' }} />
                                    </Tooltip>
                                  )}
                                  {answer.answeredBy === 'seller' && (
                                    <Tag color="blue" style={{ margin: 0 }}>
                                      Seller
                                    </Tag>
                                  )}
                                </Space>
                              </div>
                              <Paragraph style={{ marginBottom: 8 }}>{answer.text}</Paragraph>
                              <Space size="large">
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {dayjs(answer.answeredAt).fromNow()}
                                </Text>
                                <Button
                                  type="text"
                                  size="small"
                                  icon={answer.isHelpful ? <LikeFilled /> : <LikeOutlined />}
                                  onClick={() => handleToggleAnswerHelpful(question.id, answer.id)}
                                  style={{ color: answer.isHelpful ? '#1890ff' : undefined }}
                                >
                                  Helpful ({answer.helpfulVotes})
                                </Button>
                              </Space>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Space>
                  </div>
                )}

                <Divider style={{ margin: '16px 0' }} />

                <Row justify="space-between" align="middle">
                  <Col>
                    <Space>
                      <Button
                        type="text"
                        icon={question.isHelpful ? <LikeFilled /> : <LikeOutlined />}
                        onClick={() => handleToggleQuestionHelpful(question.id)}
                        style={{ color: question.isHelpful ? '#1890ff' : undefined }}
                      >
                        Helpful ({question.helpfulVotes})
                      </Button>
                    </Space>
                  </Col>
                  <Col>
                    <Button type="link" icon={<MessageOutlined />} onClick={() => handleAnswerQuestion(question)}>
                      Answer this question
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Card>
        ))}
      </Space>

      {filteredQuestions.length === 0 && (
        <Card>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <QuestionCircleOutlined style={{ fontSize: 64, color: '#d9d9d9', marginBottom: 16 }} />
            <Title level={4}>No questions found</Title>
            <Paragraph type="secondary">
              Be the first to ask a question about this product!
            </Paragraph>
            <Button type="primary" icon={<QuestionCircleOutlined />} onClick={handleAskQuestion}>
              Ask a Question
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title="Ask a Question"
        open={isAskModalVisible}
        onCancel={() => setIsAskModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitQuestion}>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select placeholder="Select question category">
              <Option value="product-info">Product Information</Option>
              <Option value="shipping">Shipping & Delivery</Option>
              <Option value="compatibility">Compatibility</Option>
              <Option value="warranty">Warranty & Returns</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Your Question"
            name="question"
            rules={[
              { required: true, message: 'Please enter your question' },
              { min: 10, message: 'Question must be at least 10 characters' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="What would you like to know about this product?"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <div style={{ background: '#f0f2f5', padding: 12, borderRadius: 4, marginBottom: 16 }}>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              Tips for asking good questions:
            </Text>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Be specific and clear</li>
              <li>Check if your question has already been asked</li>
              <li>Focus on product features and specifications</li>
              <li>Avoid including personal information</li>
            </ul>
          </div>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<QuestionCircleOutlined />}>
                Post Question
              </Button>
              <Button onClick={() => setIsAskModalVisible(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Answer Question"
        open={isAnswerModalVisible}
        onCancel={() => setIsAnswerModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedQuestion && (
          <div>
            <div style={{ background: '#f0f2f5', padding: 16, borderRadius: 8, marginBottom: 24 }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                Question:
              </Text>
              <Paragraph>{selectedQuestion.question}</Paragraph>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Asked by {selectedQuestion.askedBy} • {dayjs(selectedQuestion.askedAt).fromNow()}
              </Text>
            </div>

            <Form form={answerForm} layout="vertical" onFinish={handleSubmitAnswer}>
              <Form.Item
                label="Your Answer"
                name="answer"
                rules={[
                  { required: true, message: 'Please enter your answer' },
                  { min: 20, message: 'Answer must be at least 20 characters' },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Share your knowledge or experience..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 4, marginBottom: 16, border: '1px solid #91d5ff' }}>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Helpful answer guidelines:
                </Text>
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li>Provide accurate and helpful information</li>
                  <li>Share personal experience if applicable</li>
                  <li>Be respectful and courteous</li>
                  <li>Avoid promotional content</li>
                </ul>
              </div>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<MessageOutlined />}>
                    Post Answer
                  </Button>
                  <Button onClick={() => setIsAnswerModalVisible(false)}>Cancel</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductQAPage;
