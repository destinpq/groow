import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { SupportTicket } from './support-ticket.entity';
import { User } from '@/modules/auth/entities/user.entity';

@Entity('ticket_messages')
export class TicketMessage extends BaseEntity {
  @ManyToOne(() => SupportTicket)
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @Column()
  ticketId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  senderId: string;

  @Column()
  senderType: string; // customer, staff, system

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'simple-json', nullable: true })
  attachments: {
    id: string;
    filename: string;
    url: string;
    size: number;
  }[];

  @Column({ default: false })
  isInternal: boolean; // Internal notes visible only to staff

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'simple-json', nullable: true })
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}