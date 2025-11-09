import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { Staff } from '@/modules/staff/entities/staff.entity';

@Entity('support_tickets')
export class SupportTicket extends BaseEntity {
  @Column()
  ticketNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column()
  customerId: string;

  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: Staff;

  @Column({ nullable: true })
  assignedToId: string;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string; // order, payment, product, account, technical, other

  @Column()
  priority: string; // low, medium, high, urgent

  @Column()
  status: string; // open, in_progress, waiting_customer, resolved, closed

  @Column({ nullable: true })
  orderId: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: {
    id: string;
    filename: string;
    url: string;
    uploadedAt: string;
  }[];

  @Column({ type: 'timestamp', nullable: true })
  firstResponseAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ nullable: true })
  resolution: string;

  @Column({ type: 'int', nullable: true })
  customerRating: number; // 1-5

  @Column({ type: 'text', nullable: true })
  customerFeedback: string;

  @Column({ type: 'simple-json', nullable: true })
  escalation: {
    isEscalated: boolean;
    escalatedAt: string;
    escalatedBy: string;
    escalationReason: string;
  };

  @Column({ type: 'text', nullable: true })
  internalNotes: string;
}