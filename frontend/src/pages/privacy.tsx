import React from 'react';
import { Card, Typography, Divider, Anchor, Row, Col } from 'antd';

const { Title, Paragraph, Text } = Typography;
const { Link } = Anchor;

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Row gutter={32}>
        <Col xs={24} md={6}>
          <Anchor
            affix={false}
            items={[
              { key: 'intro', href: '#intro', title: 'Introduction' },
              { key: 'info-collect', href: '#info-collect', title: 'Information We Collect' },
              { key: 'info-use', href: '#info-use', title: 'How We Use Your Information' },
              { key: 'cookies', href: '#cookies', title: 'Cookies and Tracking' },
              { key: 'sharing', href: '#sharing', title: 'Information Sharing' },
              { key: 'security', href: '#security', title: 'Data Security' },
              { key: 'rights', href: '#rights', title: 'Your Rights' },
              { key: 'changes', href: '#changes', title: 'Policy Changes' },
              { key: 'contact', href: '#contact', title: 'Contact Us' },
            ]}
          />
        </Col>

        <Col xs={24} md={18}>
          <Card>
            <Title level={1}>Privacy Policy</Title>
            <Text type="secondary">Last Updated: November 4, 2025</Text>

            <Divider />

            <div id="intro">
              <Title level={3}>1. Introduction</Title>
              <Paragraph>
                Welcome to Groow ("we," "our," or "us"). We are committed to protecting your
                personal information and your right to privacy. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you visit our
                website and use our services.
              </Paragraph>
              <Paragraph>
                By using our platform, you agree to the collection and use of information in
                accordance with this policy. If you do not agree with our policies and practices,
                please do not use our services.
              </Paragraph>
            </div>

            <Divider />

            <div id="info-collect">
              <Title level={3}>2. Information We Collect</Title>
              
              <Title level={4}>2.1 Personal Information</Title>
              <Paragraph>
                We collect information that you provide directly to us, including:
              </Paragraph>
              <ul>
                <li>Name, email address, and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment card information (processed securely by third-party providers)</li>
                <li>Account credentials (username and password)</li>
                <li>Communication preferences</li>
                <li>Product reviews and ratings</li>
              </ul>

              <Title level={4}>2.2 Automatically Collected Information</Title>
              <Paragraph>
                When you access our platform, we automatically collect certain information:
              </Paragraph>
              <ul>
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages viewed, time spent, click patterns)</li>
                <li>Location data (with your permission)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <Title level={4}>2.3 Information from Third Parties</Title>
              <Paragraph>
                We may receive information from:
              </Paragraph>
              <ul>
                <li>Social media platforms (if you connect your account)</li>
                <li>Payment processors</li>
                <li>Analytics providers</li>
                <li>Marketing partners</li>
              </ul>
            </div>

            <Divider />

            <div id="info-use">
              <Title level={3}>3. How We Use Your Information</Title>
              <Paragraph>
                We use your information for the following purposes:
              </Paragraph>
              <ul>
                <li><strong>Order Processing:</strong> To process and fulfill your orders, including payment processing and shipping</li>
                <li><strong>Account Management:</strong> To create and maintain your account</li>
                <li><strong>Customer Service:</strong> To respond to your inquiries and provide support</li>
                <li><strong>Personalization:</strong> To personalize your experience and provide product recommendations</li>
                <li><strong>Marketing:</strong> To send promotional materials (with your consent)</li>
                <li><strong>Analytics:</strong> To understand how our platform is used and improve our services</li>
                <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </div>

            <Divider />

            <div id="cookies">
              <Title level={3}>4. Cookies and Tracking Technologies</Title>
              <Paragraph>
                We use cookies and similar tracking technologies to:
              </Paragraph>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Provide targeted advertising</li>
                <li>Analyze traffic and usage patterns</li>
              </ul>
              <Paragraph>
                You can control cookies through your browser settings. However, disabling cookies
                may affect the functionality of our platform.
              </Paragraph>
            </div>

            <Divider />

            <div id="sharing">
              <Title level={3}>5. Information Sharing and Disclosure</Title>
              <Paragraph>
                We may share your information with:
              </Paragraph>
              <ul>
                <li><strong>Vendors:</strong> To fulfill orders and provide services</li>
                <li><strong>Service Providers:</strong> Payment processors, shipping companies, analytics providers</li>
                <li><strong>Business Partners:</strong> For marketing and promotional purposes (with your consent)</li>
                <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              </ul>
              <Paragraph>
                <strong>We do not sell your personal information to third parties.</strong>
              </Paragraph>
            </div>

            <Divider />

            <div id="security">
              <Title level={3}>6. Data Security</Title>
              <Paragraph>
                We implement appropriate technical and organizational measures to protect your
                personal information, including:
              </Paragraph>
              <ul>
                <li>SSL encryption for data transmission</li>
                <li>Secure data storage with encryption at rest</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <Paragraph>
                However, no method of transmission over the internet is 100% secure. While we
                strive to protect your information, we cannot guarantee absolute security.
              </Paragraph>
            </div>

            <Divider />

            <div id="rights">
              <Title level={3}>7. Your Privacy Rights</Title>
              <Paragraph>
                Depending on your location, you may have the following rights:
              </Paragraph>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your information</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <Paragraph>
                To exercise these rights, please contact us at privacy@groow.com.
              </Paragraph>
            </div>

            <Divider />

            <div id="changes">
              <Title level={3}>8. Changes to This Privacy Policy</Title>
              <Paragraph>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last Updated" date.
              </Paragraph>
              <Paragraph>
                We encourage you to review this Privacy Policy periodically for any changes.
              </Paragraph>
            </div>

            <Divider />

            <div id="contact">
              <Title level={3}>9. Contact Us</Title>
              <Paragraph>
                If you have questions or concerns about this Privacy Policy, please contact us at:
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> privacy@groow.com<br />
                <strong>Phone:</strong> 1-800-GROOW-HELP<br />
                <strong>Address:</strong> 123 Commerce Street, Suite 500, New York, NY 10001
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PrivacyPolicyPage;
