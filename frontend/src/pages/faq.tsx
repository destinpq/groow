import React from 'react';
import { Card, Row, Col, Typography, Divider, Collapse, Input } from 'antd';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How can I track my order?',
        a: 'You can track your order by logging into your account and visiting the "My Orders" section. Click on the order you want to track to see real-time status updates and tracking information.',
      },
      {
        q: 'What are the shipping charges?',
        a: 'Shipping charges vary based on your location, order value, and selected shipping method. Orders above $50 qualify for free standard shipping. Express shipping is available at an additional cost.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5-7 business days, while express delivery takes 2-3 business days. International orders may take 10-15 business days depending on the destination.',
      },
      {
        q: 'Can I change my shipping address?',
        a: 'You can change your shipping address before the order is shipped. Contact our support team immediately or update the address in your order details if the order is still in "Processing" status.',
      },
    ],
  },
  {
    category: 'Payments',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, digital wallets, and Cash on Delivery (COD) for eligible orders.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, all payment transactions are processed through secure, encrypted connections. We use industry-standard SSL certificates and do not store your complete card details on our servers.',
      },
      {
        q: 'When will my payment be charged?',
        a: 'For online payments, your card is charged immediately upon order confirmation. For Cash on Delivery, payment is collected at the time of delivery.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy for most items. Products must be unused, in original packaging, and in resalable condition. Some items like electronics may have different return windows.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Log into your account, go to "My Orders", select the order you want to return, and click "Return Items". Follow the instructions to complete the return request.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Once we receive and inspect the returned item, refunds are processed within 5-7 business days. The amount will be credited to your original payment method or wallet.',
      },
      {
        q: 'Who pays for return shipping?',
        a: 'For defective or wrong items, we provide a free return shipping label. For other returns, return shipping costs may apply based on the reason for return.',
      },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page, enter your registered email address, and you will receive a password reset link. Follow the link to create a new password.',
      },
      {
        q: 'Can I change my email address?',
        a: 'Yes, you can update your email address in the "Account Settings" section. You will need to verify the new email address before the change takes effect.',
      },
      {
        q: 'How do I delete my account?',
        a: 'To delete your account, please contact our customer support team. Note that account deletion is permanent and all your data will be removed.',
      },
    ],
  },
  {
    category: 'Products',
    questions: [
      {
        q: 'How do I know if a product is genuine?',
        a: 'All products sold by verified vendors are authentic. Look for the "Verified Seller" badge on product pages. We also provide manufacturer warranties for applicable products.',
      },
      {
        q: 'Can I request a product that is not listed?',
        a: 'Yes! You can submit an RFQ (Request for Quotation) for any product. Multiple vendors can respond with their quotes, and you can choose the best offer.',
      },
      {
        q: 'What if I receive a damaged product?',
        a: 'If you receive a damaged product, please contact us within 48 hours with photos of the damage. We will arrange for a replacement or full refund immediately.',
      },
    ],
  },
  {
    category: 'Vendor Program',
    questions: [
      {
        q: 'How can I become a vendor?',
        a: 'Click on "Become a Vendor" in the footer, complete the registration form, and submit your KYC documents. Our team will review your application within 2-3 business days.',
      },
      {
        q: 'What documents are required for vendor verification?',
        a: 'You need to provide business registration documents, tax ID, bank account details, and identity proof. The exact requirements depend on your business type.',
      },
      {
        q: 'What are the commission rates?',
        a: 'Commission rates vary by product category and sales volume. Standard rates range from 5-15%. Premium membership plans offer reduced commission rates.',
      },
    ],
  },
];

const FAQPage: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <QuestionCircleOutlined style={{ fontSize: 64, color: '#FF9900', marginBottom: 16 }} />
        <Title level={1}>Frequently Asked Questions</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Find answers to common questions about shopping, shipping, returns, and more
        </Paragraph>

        {/* Search */}
        <Input
          size="large"
          placeholder="Search FAQs..."
          prefix={<SearchOutlined />}
          style={{ maxWidth: 600, marginTop: 24 }}
        />
      </div>

      {/* Quick Links */}
      <Card style={{ marginBottom: 32 }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Title level={4}>📦 Orders & Shipping</Title>
              <Text type="secondary">Track orders, shipping info</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Title level={4}>💳 Payments</Title>
              <Text type="secondary">Payment methods, security</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Title level={4}>↩️ Returns</Title>
              <Text type="secondary">Return policy, refunds</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* FAQ Categories */}
      {faqs.map((category, index) => (
        <div key={index} style={{ marginBottom: 32 }}>
          <Title level={3}>
            {category.category}
          </Title>
          <Divider />
          <Collapse
            defaultActiveKey={index === 0 ? ['0'] : []}
            expandIconPosition="end"
            ghost
          >
            {category.questions.map((item, qIndex) => (
              <Panel
                header={<Text strong style={{ fontSize: 16 }}>{item.q}</Text>}
                key={qIndex}
                style={{ marginBottom: 8 }}
              >
                <Paragraph style={{ paddingLeft: 24, fontSize: 15 }}>
                  {item.a}
                </Paragraph>
              </Panel>
            ))}
          </Collapse>
        </div>
      ))}

      {/* Contact Support */}
      <Card style={{ marginTop: 48, background: '#f5f5f5' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={3}>Still have questions?</Title>
          <Paragraph style={{ fontSize: 16 }}>
            Can't find what you're looking for? Our support team is here to help!
          </Paragraph>
          <Row gutter={16} justify="center" style={{ marginTop: 24 }}>
            <Col>
              <Card hoverable>
                <Title level={4}>📧 Email Support</Title>
                <Text>support@groow.com</Text>
                <br />
                <Text type="secondary">Response within 24 hours</Text>
              </Card>
            </Col>
            <Col>
              <Card hoverable>
                <Title level={4}>📞 Phone Support</Title>
                <Text>1-800-GROOW-HELP</Text>
                <br />
                <Text type="secondary">Mon-Fri, 9 AM - 6 PM</Text>
              </Card>
            </Col>
            <Col>
              <Card hoverable>
                <Title level={4}>💬 Live Chat</Title>
                <Text>Available 24/7</Text>
                <br />
                <Text type="secondary">Click the chat icon</Text>
              </Card>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default FAQPage;
