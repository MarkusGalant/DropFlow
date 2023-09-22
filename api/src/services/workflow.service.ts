import { MongoRepository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Workflow, WorkflowStep } from 'src/models';
import {
  WorkflowDto,
  WorkflowStepDto,
  CreateWorkflowDto,
  UpdateWorkflowDto,
} from 'src/dtos';
import { createId } from 'src/utils';

@Injectable()
export class WorkflowService {
  constructor(
    @InjectRepository(Workflow)
    private workflowRepository: MongoRepository<Workflow>,
    private eventEmitter: EventEmitter2,
  ) {}

  private static mapWorkflowStep(workflowStep: WorkflowStep): WorkflowStepDto {
    return {
      id: workflowStep.id,
      toolId: workflowStep.toolId,
      params: workflowStep.params,
    };
  }

  private static mapWorkflow(workflow: Workflow): WorkflowDto {
    return {
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      steps: workflow.steps.map(WorkflowService.mapWorkflowStep),
    };
  }

  public async getAll(): Promise<WorkflowDto[]> {
    const workflows = await this.workflowRepository.find();

    return workflows.map(WorkflowService.mapWorkflow);
  }

  public async getOneById(workflowId: string): Promise<WorkflowDto> {
    const workflow = await this.workflowRepository.findOneOrFail({
      where: { id: workflowId },
    });

    return WorkflowService.mapWorkflow(workflow);
  }

  public async createOne(data: CreateWorkflowDto) {
    const entity = this.workflowRepository.create({
      id: createId(),
      ...data,
    });

    const result = await this.workflowRepository.save(entity);

    this.eventEmitter.emit('workflow.created', result);

    return { id: result.id };
  }

  public async updateOne(workflowId: string, data: UpdateWorkflowDto) {
    const entity = await this.workflowRepository.findOneOrFail({
      where: { id: workflowId },
    });

    this.workflowRepository.merge(entity, data);

    const result = await this.workflowRepository.save(entity);

    this.eventEmitter.emit('workflow.updated', result);
  }

  public async deleteOne(workflowId: string) {
    const entity = await this.workflowRepository.findOneOrFail({
      where: { id: workflowId },
    });

    const result = await this.workflowRepository.remove(entity);

    this.eventEmitter.emit('workflow.deleted', result);
  }
}
