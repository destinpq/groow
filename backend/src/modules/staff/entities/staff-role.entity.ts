import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Staff } from './staff.entity';

@Entity('staff_roles')
export class StaffRole extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-json' })
  permissions: {
    orders: {
      view: boolean;
      edit: boolean;
      delete: boolean;
      refund: boolean;
    };
    products: {
      view: boolean;
      edit: boolean;
      delete: boolean;
      approve: boolean;
    };
    customers: {
      view: boolean;
      edit: boolean;
      suspend: boolean;
    };
    vendors: {
      view: boolean;
      edit: boolean;
      verify: boolean;
      suspend: boolean;
    };
    finance: {
      view: boolean;
      processPayouts: boolean;
      processRefunds: boolean;
    };
    reports: {
      view: boolean;
      export: boolean;
    };
    support: {
      view: boolean;
      assign: boolean;
      resolve: boolean;
    };
    staff: {
      view: boolean;
      manage: boolean;
    };
  };

  @Column({ default: true })
  isActive: boolean;
}