import { MongoRepository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Wallet, Task, Workflow, WorkflowExecution } from 'src/models';
import { CreateWorkflowExecutionDto, WorkflowExecutionDto } from 'src/dtos';
import { createId } from 'src/utils';

@Injectable()
export class WorkflowExecutionService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: MongoRepository<Workflow>,
    @InjectRepository(WorkflowExecution)
    private workflowExecutionRepository: MongoRepository<WorkflowExecution>,
    @InjectRepository(Wallet)
    private walletRepository: MongoRepository<Wallet>,
    @InjectRepository(Task)
    private taskRepository: MongoRepository<Task>,

    private eventEmitter: EventEmitter2,
  ) {}

  private static mapWorkflowExecution(
    workflowExecution: WorkflowExecution,
  ): WorkflowExecutionDto {
    return {
      id: workflowExecution.id,
      note: workflowExecution.note,
      walletGroupId: workflowExecution.walletGroupId,
      workflow: workflowExecution.workflow,
      startedAt: workflowExecution.startedAt?.toISOString() || null,
      endedAt: workflowExecution.endedAt?.toISOString() || null,
    };
  }

  public async getAll(): Promise<WorkflowExecutionDto[]> {
    const executions = await this.workflowExecutionRepository.find({
      where: {},
      order: { startedAt: -1 },
    });

    return executions.map(WorkflowExecutionService.mapWorkflowExecution);
  }

  public async getOne(executionId: string): Promise<WorkflowExecutionDto> {
    const execution = await this.workflowExecutionRepository.findOneOrFail({
      where: { id: executionId },
    });

    return WorkflowExecutionService.mapWorkflowExecution(execution);
  }

  public async execute(data: CreateWorkflowExecutionDto) {
    const wallets = await this.walletRepository.find({
      where: { groupId: data.walletGroupId },
    });

    const execution = this.workflowExecutionRepository.create({
      id: createId(),
      ...data,
      startedAt: new Date(),
      endedAt: null,
    });

    const tasks: Task[] = [];

    for (const wallet of wallets) {
      let previousId: string | null = null;

      for (const step of data.workflow.steps) {
        const task = this.taskRepository.create({
          id: createId(),
          executionId: execution.id,
          previousTaskId: previousId,
          workflowId: data.workflow.id,
          workflowStepId: step.id,
          walletId: wallet.id,
          walletName: wallet.name,
          toolId: step.toolId,
          status: 'scheduled',
          params: step.params,
          data: null,
          error: null,
          createdAt: new Date(),
          startedAt: null,
          endedAt: null,
        });

        previousId = task.id;

        tasks.push(task);
      }
    }

    const result1 = await this.workflowExecutionRepository.save(execution);
    const result2 = await this.taskRepository.save(tasks);

    this.eventEmitter.emit('workflow-execution.created', result1);
    this.eventEmitter.emit('tasks.created', result2);

    return { id: result1.id };
  }
}
