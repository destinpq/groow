import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Customer } from '@/modules/auth/entities/customer.entity';
import { Quotation } from './quotation.entity';
import { RfqStatus } from '@/common/enums';

@Entity('rfqs')
export class Rfq extends BaseEntity {
  @Column({ unique: true })
  rfqNumber: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'simple-json' })
  items: Array<{
    productId: string;
    quantity: number;
    specifications?: string;
  }>;

  @Column({ nullable: true })
  targetPrice: string;

  @Column({ nullable: true })
  deliveryLocation: string;

  @Column({ nullable: true })
  requiredBy: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: string[];

  @Column({ type: 'enum', enum: RfqStatus, default: RfqStatus.OPEN })
  status: RfqStatus;

  @OneToMany(() => Quotation, quotation => quotation.rfq)
  quotations: Quotation[];

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
