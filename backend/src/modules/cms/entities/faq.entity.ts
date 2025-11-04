import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('faqs')
export class Faq extends BaseEntity {
  @Column()
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ default: 'general' })
  category: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
