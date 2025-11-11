import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { Staff } from './staff.entity';
import { StaffRole } from './staff-role.entity';

@Entity('staff_role_assignments')
export class StaffRoleAssignment extends BaseEntity {
  @ManyToOne(() => Staff, staff => staff.roleAssignments)
  @JoinColumn({ name: 'staffId' })
  staff: Staff;

  @Column()
  staffId: string;

  @ManyToOne(() => StaffRole)
  @JoinColumn({ name: 'roleId' })
  role: StaffRole;

  @Column()
  roleId: string;

  @Column()
  assignedBy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @Column({ nullable: true })
  revokedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;
}