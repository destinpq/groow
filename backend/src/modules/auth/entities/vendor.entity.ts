import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from './user.entity';
import { VendorVerificationStatus } from '@/common/enums';

@Entity('vendors')
export class Vendor extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  businessName: string;

  @Column({ nullable: true })
  businessRegistrationNumber: string;

  @Column({ nullable: true })
  gstNumber: string;

  @Column({ nullable: true })
  panNumber: string;

  @Column({ type: 'text', nullable: true })
  businessAddress: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  pincode: string;

  @Column({ type: 'enum', enum: VendorVerificationStatus, default: VendorVerificationStatus.PENDING })
  verificationStatus: VendorVerificationStatus;

  @Column({ type: 'simple-json', nullable: true })
  kycDocuments: {
    type: string;
    url: string;
    status: string;
  }[];

  @Column({ type: 'boolean', default: false })
  isStoreActive: boolean;

  @Column({ nullable: true })
  subscriptionPlanId: string;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  walletBalance: number;

  @Column({ type: 'simple-json', nullable: true })
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
}
