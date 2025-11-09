import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class NotificationService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmailVerification(email: string, token: string) {
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    
    const html = `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `;

    await this.sendEmail(email, 'Verify Your Email', html);
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    
    const html = `
      <h1>Reset Your Password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await this.sendEmail(email, 'Password Reset Request', html);
  }

  async sendOrderConfirmation(email: string, orderData: any) {
    const html = `
      <h1>Order Confirmed</h1>
      <p>Thank you for your order! Order ID: ${orderData.orderId}</p>
      <p>Total: $${orderData.total}</p>
    `;

    await this.sendEmail(email, 'Order Confirmation', html);
  }

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <h1>Welcome to Groow!</h1>
      <p>Hi ${name},</p>
      <p>Thank you for joining Groow E-Commerce Platform.</p>
    `;

    await this.sendEmail(email, 'Welcome to Groow', html);
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendPushNotification(userId: string, title: string, body: string) {
    // Implement push notification logic here
    // Can integrate with Firebase Cloud Messaging, OneSignal, etc.
    console.log(`Push notification to ${userId}: ${title} - ${body}`);
  }

  // Enhanced notification methods for order management
  
  async sendOrderStatusUpdate(customerId: string, orderId: string, status: string) {
    const statusMessages = {
      'manifested': 'Your order has been manifested and will be shipped soon',
      'shipped': 'Your order has been shipped and is on its way',
      'delivered': 'Your order has been delivered successfully',
      'cancelled': 'Your order has been cancelled',
      'hold': 'Your order is currently on hold'
    };

    const message = statusMessages[status] || `Your order status has been updated to ${status}`;
    
    await this.sendPushNotification(customerId, 'Order Update', message);
  }

  async sendShippingUpdate(customerId: string, orderId: string, trackingNumber: string) {
    const message = `Your order has been shipped! Track it using: ${trackingNumber}`;
    await this.sendPushNotification(customerId, 'Order Shipped', message);
  }

  async sendOrderHold(customerId: string, orderId: string, reason: string) {
    const message = `Your order has been put on hold. Reason: ${reason}`;
    await this.sendPushNotification(customerId, 'Order Hold', message);
  }

  async sendDisputeNotification(customerId: string, orderId: string, reason: string) {
    const message = `A dispute has been raised for your order. Reason: ${reason}`;
    await this.sendPushNotification(customerId, 'Order Dispute', message);
  }

  async sendReturnNotification(customerId: string, orderId: string) {
    const message = 'Your return request has been received and is being processed';
    await this.sendPushNotification(customerId, 'Return Request', message);
  }

  async sendRefundNotification(customerId: string, orderId: string, amount: number) {
    const message = `Your refund of $${amount.toFixed(2)} has been processed`;
    await this.sendPushNotification(customerId, 'Refund Processed', message);
  }

  async sendDeliveryUpdate(customerId: string, orderId: string, status: string) {
    const message = `Delivery update for your order: ${status}`;
    await this.sendPushNotification(customerId, 'Delivery Update', message);
  }
}
