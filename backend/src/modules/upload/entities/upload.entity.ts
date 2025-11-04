import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/auth/entities/user.entity';

@Entity('uploads')
export class Upload extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int' })
  size: number;

  @Column()
  path: string;

  @Column()
  url: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedBy' })
  uploader: User;

  @Column()
  uploadedBy: string;

  @Column({ nullable: true })
  entityType: string; // 'product', 'vendor', 'category', etc.

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata: Record<string, any>;
}
