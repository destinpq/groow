import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { StaffRoleAssignment } from './staff-role-assignment.entity';

@Entity('staff')
export class Staff extends BaseEntity {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column()
  employeeId: string;

  @Column()
  department: string;

  @Column()
  position: string;

  @Column()
  reportingManagerId: string;

  @Column({ type: 'date' })
  joinDate: Date;

  @Column({ type: 'date', nullable: true })
  exitDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column()
  employmentType: string; // full-time, part-time, contract

  @Column()
  status: string; // active, inactive, on_leave, terminated

  @Column({ type: 'simple-json', nullable: true })
  personalInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };

  @Column({ type: 'simple-json', nullable: true })
  workSchedule: {
    workingDays: string[];
    startTime: string;
    endTime: string;
    timezone: string;
  };

  @Column({ type: 'simple-json', nullable: true })
  benefits: {
    healthInsurance: boolean;
    paidLeave: number;
    sickLeave: number;
    bonus: boolean;
  };

  @Column({ type: 'simple-json', nullable: true })
  attendance: Record<string, {
    date: string;
    status: string; // present, absent, half-day, sick-leave, vacation
    checkIn?: string;
    checkOut?: string;
    hours?: number;
    notes?: string;
  }>;

  @Column({ type: 'simple-json', nullable: true })
  performance: Record<string, {
    year: string;
    rating: number;
    goals: string[];
    achievements: string[];
    feedback: string;
    reviewer: string;
    reviewDate: string;
    updatedAt: string;
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => StaffRoleAssignment, assignment => assignment.staff)
  roleAssignments: StaffRoleAssignment[];
}