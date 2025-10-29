import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'actor_id', type: 'bigint', nullable: true })
  actorId?: number;

  @Column({ length: 50 })
  action!: string;

  @Column({ name: 'target_type', length: 50, nullable: true })
  targetType?: string;

  @Column({ name: 'target_id', type: 'bigint', nullable: true })
  targetId?: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'actor_id' })
  actor?: User;
}