import React, { useState, useEffect } from 'react';
import { Tabs, Form, Input, Upload, Button, Switch, Select, message, Card, Spin } from 'antd';
import { UploadOutlined, SaveOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import { settingsAPI } from '@/services/api/settings';
import type { GeneralSettings, SEOSettings, PaymentSettings, EmailSettings } from '@/services/api/settings';

const AdminSettings = () => {
  const [generalForm] = Form.useForm();
  const [seoForm] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const settings = await settingsAPI.getAll();
      
      // Populate forms with fetched data
      generalForm.setFieldsValue(settings.general);
      seoForm.setFieldsValue(settings.seo);
      paymentForm.setFieldsValue(settings.payment);
      emailForm.setFieldsValue(settings.email);
    } catch (error) {
      message.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formName: string, form: any, updateFunc: any) => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      await updateFunc(values);
      message.success(`${formName} settings saved successfully`);
    } catch (error) {
      message.error(`Failed to save ${formName} settings`);
    } finally {
      setLoading(false);
    }
  };

  const generalSettings = (
    <Card>
      <Form 
        form={generalForm} 
        layout="vertical" 
        onFinish={() => handleSave('General', generalForm, settingsAPI.updateGeneral)}
      >
        <Form.Item label="Site Name" name="siteName" initialValue="Groow">
          <Input />
        </Form.Item>
        
        <Form.Item label="Site Logo" name="logo">
          <Upload listType="picture">
            <Button icon={<UploadOutlined />}>Upload Logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Site Favicon" name="favicon">
          <Upload listType="picture">
            <Button icon={<UploadOutlined />}>Upload Favicon</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Contact Email" name="contactEmail" initialValue="contact@groow.com">
          <Input type="email" />
        </Form.Item>

        <Form.Item label="Contact Phone" name="contactPhone" initialValue="+1 234 567 8900">
          <Input />
        </Form.Item>

        <Form.Item label="Address" name="address">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Timezone" name="timezone" initialValue="UTC">
          <Select>
            <Select.Option value="UTC">UTC</Select.Option>
            <Select.Option value="EST">Eastern Time</Select.Option>
            <Select.Option value="PST">Pacific Time</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Currency" name="currency" initialValue="USD">
          <Select>
            <Select.Option value="USD">USD - US Dollar</Select.Option>
            <Select.Option value="EUR">EUR - Euro</Select.Option>
            <Select.Option value="GBP">GBP - British Pound</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Maintenance Mode" name="maintenance" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save General Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const seoSettings = (
    <Card>
      <Form 
        form={seoForm} 
        layout="vertical" 
        onFinish={() => handleSave('SEO', seoForm, settingsAPI.updateSEO)}
      >
        <Form.Item label="Meta Title" name="metaTitle">
          <Input placeholder="Your site's meta title" />
        </Form.Item>

        <Form.Item label="Meta Description" name="metaDescription">
          <Input.TextArea rows={3} placeholder="Your site's meta description" />
        </Form.Item>

        <Form.Item label="Meta Keywords" name="metaKeywords">
          <Select mode="tags" placeholder="Enter keywords">
            <Select.Option value="ecommerce">E-commerce</Select.Option>
            <Select.Option value="wholesale">Wholesale</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Google Analytics ID" name="googleAnalytics">
          <Input placeholder="UA-XXXXXXXXX-X" />
        </Form.Item>

        <Form.Item label="Google Search Console" name="googleConsole">
          <Input.TextArea rows={2} placeholder="Verification code" />
        </Form.Item>

        <Form.Item label="Facebook Pixel ID" name="facebookPixel">
          <Input placeholder="Facebook Pixel ID" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save SEO Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const paymentSettings = (
    <Card>
      <Form 
        form={paymentForm} 
        layout="vertical" 
        onFinish={() => handleSave('Payment', paymentForm, settingsAPI.updatePayment)}
      >
        <h3>Stripe</h3>
        <Form.Item label="Stripe Publishable Key" name="stripePublishable">
          <Input.Password placeholder="pk_live_..." />
        </Form.Item>

        <Form.Item label="Stripe Secret Key" name="stripeSecret">
          <Input.Password placeholder="sk_live_..." />
        </Form.Item>

        <Form.Item label="Enable Stripe" name="stripeEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <h3 style={{ marginTop: 24 }}>PayPal</h3>
        <Form.Item label="PayPal Client ID" name="paypalClientId">
          <Input.Password />
        </Form.Item>

        <Form.Item label="PayPal Secret" name="paypalSecret">
          <Input.Password />
        </Form.Item>

        <Form.Item label="PayPal Mode" name="paypalMode" initialValue="sandbox">
          <Select>
            <Select.Option value="sandbox">Sandbox (Test)</Select.Option>
            <Select.Option value="live">Live</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Enable PayPal" name="paypalEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <h3 style={{ marginTop: 24 }}>Cash on Delivery</h3>
        <Form.Item label="Enable COD" name="codEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save Payment Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const emailSettings = (
    <Card>
      <Form 
        form={emailForm} 
        layout="vertical" 
        onFinish={() => handleSave('Email', emailForm, settingsAPI.updateEmail)}
      >
        <Form.Item label="SMTP Host" name="smtpHost" initialValue="smtp.gmail.com">
          <Input />
        </Form.Item>

        <Form.Item label="SMTP Port" name="smtpPort" initialValue="587">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="SMTP Username" name="smtpUsername">
          <Input />
        </Form.Item>

        <Form.Item label="SMTP Password" name="smtpPassword">
          <Input.Password />
        </Form.Item>

        <Form.Item label="From Email" name="fromEmail">
          <Input type="email" />
        </Form.Item>

        <Form.Item label="From Name" name="fromName" initialValue="Groow">
          <Input />
        </Form.Item>

        <Form.Item label="Enable Email Notifications" name="emailEnabled" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
            Save Email Settings
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const items: TabsProps['items'] = [
    {
      key: 'general',
      label: 'General',
      children: generalSettings,
    },
    {
      key: 'seo',
      label: 'SEO & Analytics',
      children: seoSettings,
    },
    {
      key: 'payment',
      label: 'Payment Gateways',
      children: paymentSettings,
    },
    {
      key: 'email',
      label: 'Email Configuration',
      children: emailSettings,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <h1>System Settings</h1>
        <Tabs defaultActiveKey="general" items={items} />
      </div>
    </Spin>
  );
};

export default AdminSettings;
