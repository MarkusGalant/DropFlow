import { Column, Entity } from 'typeorm';

import { BaseModel } from './base.model';

@Entity({ name: 'workflow' })
export class Workflow extends BaseModel {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('simple-array', { default: [] })
  steps: WorkflowStep[];
}

export class WorkflowStep {
  @Column()
  id: string;

  @Column()
  toolId: string;

  @Column('json')
  params: any;
}
