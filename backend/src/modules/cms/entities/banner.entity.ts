import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@Entity('banners')
export class Banner extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  link: string;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: 'home' })
  placement: string; // home, category, product, etc.
}
