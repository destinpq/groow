import React from 'react';
import { Card, Typography, Steps, Timeline, Alert, Space, Tag } from 'antd';
import {
  SyncOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

const ReturnPolicyPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <SyncOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
          <Title level={2} style={{ marginBottom: 8 }}>
            Return & Refund Policy
          </Title>
          <Text type="secondary">Our commitment to your satisfaction</Text>
        </div>

        {/* Key Highlights */}
        <Alert
          message="30-Day Return Policy"
          description="We offer hassle-free returns within 30 days of delivery for most products. Your satisfaction is our priority."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          style={{ marginBottom: 32 }}
        />

        {/* Return Eligibility */}
        <Title level={3} style={{ marginTop: 32 }}>
          Return Eligibility
        </Title>
        <Card size="small" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong style={{ color: '#52c41a' }}>
                ✓ Eligible for Return:
              </Text>
              <ul style={{ marginTop: 8 }}>
                <li>Product received is defective or damaged</li>
                <li>Wrong item was shipped</li>
                <li>Product does not match description</li>
                <li>Changed your mind (within 30 days)</li>
                <li>Product arrived late beyond promised date</li>
              </ul>
            </div>
            <div>
              <Text strong style={{ color: '#ff4d4f' }}>
                ✗ Not Eligible for Return:
              </Text>
              <ul style={{ marginTop: 8 }}>
                <li>Personalized or custom-made items</li>
                <li>Perishable goods (food, flowers, etc.)</li>
                <li>Intimate or sanitary goods</li>
                <li>Digital products or downloadable software</li>
                <li>Items without original packaging or tags</li>
                <li>Products damaged due to misuse</li>
              </ul>
            </div>
          </Space>
        </Card>

        {/* Return Process */}
        <Title level={3}>How to Return an Item</Title>
        <Steps
          direction="vertical"
          current={-1}
          style={{ marginBottom: 32 }}
        >
          <Step
            title="Request Return"
            description="Log into your account and go to 'My Orders'. Select the item you want to return and click 'Return Item'. Provide a reason for the return."
            icon={<ClockCircleOutlined />}
          />
          <Step
            title="Get Approval"
            description="Our team will review your request within 24-48 hours. You'll receive an email with return instructions and a prepaid shipping label (if applicable)."
            icon={<CheckCircleOutlined />}
          />
          <Step
            title="Pack & Ship"
            description="Pack the item securely in its original packaging. Attach the return label and drop it off at the designated shipping location."
            icon={<SyncOutlined />}
          />
          <Step
            title="Inspection"
            description="Once we receive your return, we'll inspect the item to ensure it meets our return criteria. This usually takes 3-5 business days."
            icon={<CheckCircleOutlined />}
          />
          <Step
            title="Refund Processed"
            description="After inspection, your refund will be processed to your original payment method within 5-7 business days."
            icon={<CheckCircleOutlined />}
          />
        </Steps>

        {/* Refund Timeline */}
        <Title level={3}>Refund Timeline</Title>
        <Timeline style={{ marginBottom: 32 }}>
          <Timeline.Item color="blue">
            <Text strong>Day 1-2:</Text> Return request submitted and approved
          </Timeline.Item>
          <Timeline.Item color="green">
            <Text strong>Day 3-7:</Text> Item received at our warehouse
          </Timeline.Item>
          <Timeline.Item color="orange">
            <Text strong>Day 8-10:</Text> Quality inspection completed
          </Timeline.Item>
          <Timeline.Item color="purple">
            <Text strong>Day 11-15:</Text> Refund initiated
          </Timeline.Item>
          <Timeline.Item>
            <Text strong>Day 16-20:</Text> Refund appears in your account (depending on your bank)
          </Timeline.Item>
        </Timeline>

        {/* Refund Methods */}
        <Title level={3}>Refund Methods</Title>
        <Card size="small" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Tag color="blue">Credit/Debit Card</Tag>
              <Text> - Refunded to original card within 5-7 business days</Text>
            </div>
            <div>
              <Tag color="green">PayPal</Tag>
              <Text> - Refunded to PayPal account within 2-3 business days</Text>
            </div>
            <div>
              <Tag color="purple">Wallet Credit</Tag>
              <Text> - Instant credit to your GROOW wallet (optional)</Text>
            </div>
            <div>
              <Tag color="orange">Bank Transfer</Tag>
              <Text> - Refunded within 7-10 business days</Text>
            </div>
          </Space>
        </Card>

        {/* Exchange Policy */}
        <Title level={3}>Exchange Policy</Title>
        <Paragraph>
          If you'd like to exchange an item for a different size, color, or variant:
        </Paragraph>
        <ul>
          <li>Contact customer support within 30 days of delivery</li>
          <li>The new item must be of equal or greater value</li>
          <li>Price difference will be charged if the new item costs more</li>
          <li>Exchanges are subject to stock availability</li>
          <li>Exchange shipping is free for defective items</li>
        </ul>

        {/* Shipping Costs */}
        <Title level={3}>Return Shipping Costs</Title>
        <Card size="small" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              <Text strong>Free Return Shipping:</Text>
              <ul>
                <li>Defective or damaged products</li>
                <li>Wrong item shipped</li>
                <li>Quality issues</li>
              </ul>
            </div>
            <div>
              <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
              <Text strong>Customer Pays Shipping:</Text>
              <ul>
                <li>Change of mind returns</li>
                <li>Ordered wrong size/color</li>
                <li>No longer needed</li>
              </ul>
            </div>
          </Space>
        </Card>

        {/* Restocking Fee */}
        <Title level={3}>Restocking Fees</Title>
        <Paragraph>
          Most returns are free of charge. However, a 15% restocking fee may apply in the following
          cases:
        </Paragraph>
        <ul>
          <li>Electronics that have been opened or used</li>
          <li>Large items (furniture, appliances) returned for non-defect reasons</li>
          <li>Clearance or final sale items (if return is allowed)</li>
        </ul>

        {/* Damaged Items */}
        <Alert
          message="Received a Damaged Item?"
          description="If you receive a damaged or defective item, please contact us immediately with photos. We'll arrange for a replacement or full refund at no cost to you."
          type="warning"
          showIcon
          style={{ marginTop: 24, marginBottom: 24 }}
        />

        {/* International Returns */}
        <Title level={3}>International Returns</Title>
        <Paragraph>
          For international orders, return shipping costs are the responsibility of the customer
          unless the item is defective or incorrect. Please contact our international support team
          for specific instructions.
        </Paragraph>
        <ul>
          <li>Return to local warehouse (if available in your country)</li>
          <li>Customs duties are non-refundable</li>
          <li>Allow additional 5-10 days for international processing</li>
        </ul>

        {/* Contact Support */}
        <Card style={{ marginTop: 32, background: '#f5f5f5' }}>
          <Title level={4}>Need Help?</Title>
          <Paragraph>
            If you have questions about returns or need assistance, our customer support team is
            here to help:
          </Paragraph>
          <Space direction="vertical">
            <Text>📧 Email: returns@groow.com</Text>
            <Text>📞 Phone: +1 (555) 123-4567</Text>
            <Text>💬 Live Chat: Available 24/7</Text>
          </Space>
        </Card>
      </Card>
    </div>
  );
};

export default ReturnPolicyPage;
