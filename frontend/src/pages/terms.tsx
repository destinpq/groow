import React from 'react';
import { Card, Typography, Collapse, Anchor } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { Link } = Anchor;

const TermsPage: React.FC = () => {
  const sections = [
    {
      key: '1',
      title: '1. Acceptance of Terms',
      content: (
        <>
          <Paragraph>
            By accessing and using GROOW ("the Platform"), you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to abide by the above, please
            do not use this service.
          </Paragraph>
          <Paragraph>
            These Terms of Service ("Terms") govern your access to and use of our website, products,
            and services ("Services"). Please read them carefully.
          </Paragraph>
        </>
      ),
    },
    {
      key: '2',
      title: '2. Use License',
      content: (
        <>
          <Paragraph>
            Permission is granted to temporarily download one copy of the materials on GROOW's
            website for personal, non-commercial transitory viewing only.
          </Paragraph>
          <Paragraph>This license shall automatically terminate if you violate any of these restrictions:</Paragraph>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software contained on the Platform</li>
            <li>Remove any copyright or proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
        </>
      ),
    },
    {
      key: '3',
      title: '3. User Accounts',
      content: (
        <>
          <Paragraph>
            When you create an account with us, you must provide information that is accurate,
            complete, and current at all times.
          </Paragraph>
          <Paragraph>You are responsible for:</Paragraph>
          <ul>
            <li>Maintaining the confidentiality of your account and password</li>
            <li>Restricting access to your computer and account</li>
            <li>All activities that occur under your account or password</li>
            <li>Notifying us immediately of any unauthorized use</li>
          </ul>
          <Paragraph>
            We reserve the right to refuse service, terminate accounts, or remove content at our
            sole discretion.
          </Paragraph>
        </>
      ),
    },
    {
      key: '4',
      title: '4. Vendor Terms',
      content: (
        <>
          <Paragraph>If you are a vendor on our platform, you agree to:</Paragraph>
          <ul>
            <li>Provide accurate product information and pricing</li>
            <li>Fulfill orders in a timely manner</li>
            <li>Handle customer service professionally</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Pay applicable fees and commissions</li>
            <li>Maintain adequate inventory levels</li>
            <li>Process refunds according to our refund policy</li>
          </ul>
          <Paragraph>
            Vendors must complete KYC verification and maintain valid business documentation.
            Failure to comply may result in account suspension or termination.
          </Paragraph>
        </>
      ),
    },
    {
      key: '5',
      title: '5. Payment Terms',
      content: (
        <>
          <Paragraph>All payments are processed securely through our payment partners.</Paragraph>
          <Paragraph>Customer Payment Terms:</Paragraph>
          <ul>
            <li>Prices are subject to change without notice</li>
            <li>All prices are in USD unless otherwise stated</li>
            <li>Payment must be received before order processing</li>
            <li>We accept major credit cards, debit cards, and other listed payment methods</li>
          </ul>
          <Paragraph>Vendor Payment Terms:</Paragraph>
          <ul>
            <li>Platform commission is deducted from each sale</li>
            <li>Payouts are processed according to your payout schedule</li>
            <li>Minimum payout threshold is $100</li>
            <li>Transaction fees may apply based on payment method</li>
          </ul>
        </>
      ),
    },
    {
      key: '6',
      title: '6. Returns and Refunds',
      content: (
        <>
          <Paragraph>
            Our Return & Refund Policy is detailed on a separate page. Please review it carefully
            before making a purchase.
          </Paragraph>
          <Paragraph>General Terms:</Paragraph>
          <ul>
            <li>Returns must be requested within 30 days of delivery</li>
            <li>Items must be in original condition with tags attached</li>
            <li>Refunds will be processed to the original payment method</li>
            <li>Shipping costs are non-refundable unless item is defective</li>
          </ul>
        </>
      ),
    },
    {
      key: '7',
      title: '7. Prohibited Activities',
      content: (
        <>
          <Paragraph>You may not use our platform to:</Paragraph>
          <ul>
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit harmful code, viruses, or malware</li>
            <li>Engage in fraudulent activities</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Sell counterfeit, illegal, or prohibited items</li>
            <li>Manipulate prices or engage in unfair practices</li>
            <li>Scrape or collect data without permission</li>
          </ul>
        </>
      ),
    },
    {
      key: '8',
      title: '8. Intellectual Property',
      content: (
        <>
          <Paragraph>
            The Platform and its original content, features, and functionality are owned by GROOW
            and are protected by international copyright, trademark, patent, trade secret, and other
            intellectual property laws.
          </Paragraph>
          <Paragraph>
            You may not reproduce, distribute, modify, create derivative works of, publicly display,
            publicly perform, republish, download, store, or transmit any of the material on our
            Platform without prior written consent.
          </Paragraph>
        </>
      ),
    },
    {
      key: '9',
      title: '9. Disclaimer',
      content: (
        <>
          <Paragraph>
            The materials on GROOW's website are provided on an 'as is' basis. GROOW makes no
            warranties, expressed or implied, and hereby disclaims and negates all other warranties
            including, without limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of intellectual property or other
            violation of rights.
          </Paragraph>
          <Paragraph>
            We do not warrant that the service will be uninterrupted, timely, secure, or error-free.
          </Paragraph>
        </>
      ),
    },
    {
      key: '10',
      title: '10. Limitation of Liability',
      content: (
        <>
          <Paragraph>
            In no event shall GROOW or its suppliers be liable for any damages (including, without
            limitation, damages for loss of data or profit, or due to business interruption) arising
            out of the use or inability to use the materials on GROOW's website.
          </Paragraph>
          <Paragraph>
            Our maximum liability for any claim shall not exceed the amount paid by you for the
            services in the twelve (12) months preceding the claim.
          </Paragraph>
        </>
      ),
    },
    {
      key: '11',
      title: '11. Governing Law',
      content: (
        <>
          <Paragraph>
            These Terms shall be governed and construed in accordance with the laws of the United
            States, without regard to its conflict of law provisions.
          </Paragraph>
          <Paragraph>
            Any disputes arising from these Terms will be resolved in the courts of [Your
            Jurisdiction].
          </Paragraph>
        </>
      ),
    },
    {
      key: '12',
      title: '12. Changes to Terms',
      content: (
        <>
          <Paragraph>
            We reserve the right to modify or replace these Terms at any time. We will provide
            notice of any material changes by posting the new Terms on this page and updating the
            "Last Updated" date.
          </Paragraph>
          <Paragraph>
            Your continued use of the Platform after any changes constitutes acceptance of the new
            Terms.
          </Paragraph>
        </>
      ),
    },
    {
      key: '13',
      title: '13. Contact Us',
      content: (
        <>
          <Paragraph>
            If you have any questions about these Terms, please contact us at:
          </Paragraph>
          <ul>
            <li>Email: legal@groow.com</li>
            <li>Phone: +1 (555) 123-4567</li>
            <li>Address: 123 Commerce Street, Suite 100, New York, NY 10001</li>
          </ul>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <FileTextOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
          <Title level={2} style={{ marginBottom: 8 }}>
            Terms and Conditions
          </Title>
          <Text type="secondary">Last Updated: November 4, 2025</Text>
        </div>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* Navigation */}
          <div style={{ width: 250, flexShrink: 0, display: window.innerWidth > 768 ? 'block' : 'none' }}>
            <Anchor offsetTop={80}>
              {sections.map((section) => (
                <Link key={section.key} href={`#section-${section.key}`} title={section.title} />
              ))}
            </Anchor>
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <Collapse
              defaultActiveKey={['1']}
              ghost
              expandIconPosition="end"
            >
              {sections.map((section) => (
                <Panel
                  header={<Text strong style={{ fontSize: 16 }}>{section.title}</Text>}
                  key={section.key}
                  id={`section-${section.key}`}
                >
                  {section.content}
                </Panel>
              ))}
            </Collapse>

            {/* Agreement */}
            <Card style={{ marginTop: 32, background: '#f5f5f5' }}>
              <Paragraph strong>
                By using GROOW, you acknowledge that you have read, understood, and agree to be
                bound by these Terms and Conditions.
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}>
                If you do not agree to these terms, please do not use our platform.
              </Paragraph>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TermsPage;
