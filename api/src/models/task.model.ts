import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';

export type TaskStatus =
  | 'scheduled'
  | 'execution'
  | 'processing'
  | 'completed'
  | 'error'
  | 'failed';

@Entity({ name: 'tasks' })
export class Task extends BaseModel {
  @Column()
  executionId: string;

  @Column({ nullable: true })
  previousTaskId: string | null;

  @Column()
  workflowId: string;

  @Column()
  workflowStepId: string;

  @Column()
  walletId: string;

  @Column()
  walletName: string;

  @Column()
  toolId: string;

  @Column({
    type: 'enum',
    enum: [
      'scheduled',
      'execution',
      'processing',
      'completed',
      'failed',
      'error',
    ],
    default: 'ghost',
  })
  status: TaskStatus;

  @Column('json')
  params: any;

  @Column('json')
  data: any;

  @Column('json')
  error: any;

  @Column({ nullable: true })
  createdAt: Date | null;

  @Column({ nullable: true })
  startedAt: Date | null;

  @Column({ nullable: true })
  endedAt: Date | null;
}
