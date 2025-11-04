import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from './user.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  companyName: string;

  @Column({ type: 'simple-json', nullable: true })
  shippingAddresses: {
    id: string;
    label: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
    isDefault: boolean;
  }[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cashbackBalance: number;

  @Column({ type: 'simple-json', nullable: true })
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };

  @Column({ nullable: true })
  gstNumber: string;

  @Column({ type: 'boolean', default: false })
  isSubscribed: boolean;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;
}
