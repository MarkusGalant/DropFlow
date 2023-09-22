import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';
import { Workflow } from './workflow.model';

@Entity({ name: 'workflow-execution' })
export class WorkflowExecution extends BaseModel {
  @Column()
  note: string;

  @Column('json')
  workflow: Workflow;

  @Column()
  walletGroupId: string;

  @Column({ nullable: true })
  startedAt: Date | null;

  @Column({ nullable: true })
  endedAt: Date | null;
}
