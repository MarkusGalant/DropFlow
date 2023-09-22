import { In, MongoRepository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { Wallet, Task } from '../models';

import { Tool, ToolManager } from '../tools/tool.manager';
import { TaskDto } from 'src/dtos/task.dto';

const convertError = (error) => {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {};
};

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: MongoRepository<Wallet>,
    @InjectRepository(Task)
    private taskRepository: MongoRepository<Task>,

    private toolManager: ToolManager,
    private eventEmitter: EventEmitter2,
  ) {}

  private static mapTask(task: Task): TaskDto {
    return task;
  }

  public async getOneTask(taskId: string): Promise<TaskDto> {
    const task = await this.taskRepository.findOneOrFail({
      where: { id: taskId },
    });

    return TaskService.mapTask(task);
  }

  public async getPrevCompleted(taskIds: string[]): Promise<TaskDto> {
    const task = await this.taskRepository.findOneOrFail({
      where: { id: In(taskIds), status: In(['completed', 'error', 'failed']) },
    });

    return TaskService.mapTask(task);
  }

  public async getInProgress(): Promise<TaskDto | null> {
    const task = await this.taskRepository.findOne({
      where: { status: In(['execution', 'processing']) },
    });

    return task ? TaskService.mapTask(task) : null;
  }

  public async getTasksForExecution(): Promise<TaskDto | null> {
    const task = await this.taskRepository
      .aggregate([
        {
          $lookup: {
            from: 'tasks',
            localField: 'previousId',
            foreignField: 'id',
            as: 'previousTask',
          },
        },
        {
          $match: {
            $or: [
              {
                status: { $in: ['scheduled', 'execution', 'processing'] },
                'previousTask.status': 'completed',
              },
              {
                status: { $in: ['scheduled', 'execution', 'processing'] },
                previousId: null,
              },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
      ])
      .toArray();

    return task.length ? TaskService.mapTask(task[0]) : null;
  }

  public async getAllByExecution(executionId: string): Promise<TaskDto[]> {
    const tasks = await this.taskRepository.find({ where: { executionId } });

    return tasks.map(TaskService.mapTask);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async execution(task: Task, _: Wallet, __: Tool) {
    this.taskRepository.merge(task, {
      status: 'execution',
      startedAt: new Date(),
    });

    await this.taskRepository.save(task);
  }

  private async processing(task: Task, wallet: Wallet, tool: Tool) {
    try {
      const result = await tool.execute(wallet, task.params);

      this.taskRepository.merge(task, { data: result, status: 'processing' });

      await this.taskRepository.save(task);
    } catch (error) {
      this.taskRepository.merge(task, {
        error: convertError(error),
        status: 'failed',
      });

      await this.taskRepository.save(task);
    }
  }

  private async complete(task: Task, wallet: Wallet, tool: Tool) {
    try {
      const isCompleted = await tool.isCompleted(wallet, task.data);

      if (isCompleted) {
        this.taskRepository.merge(task, {
          status: 'completed',
          endedAt: new Date(),
        });

        await this.taskRepository.save(task);
      }
    } catch (error) {
      this.taskRepository.merge(task, {
        error: convertError(error),
        status: 'error',
      });

      await this.taskRepository.save(task);
    }
  }

  public async execute(taskId: string) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId },
    });

    if (!task) return;

    try {
      const wallet = await this.walletRepository.findOneOrFail({
        where: { id: task.walletId },
      });

      const tool = await this.toolManager.findOneOrFail({
        where: { id: task.toolId },
      });

      if (task.status === 'scheduled') {
        await this.execution(task, wallet, tool);
      }

      if (task.status === 'execution') {
        await this.processing(task, wallet, tool);
      }

      if (task.status === 'processing') {
        await this.complete(task, wallet, tool);
      }
    } catch (error) {
      this.taskRepository.merge(task, {
        error: convertError(error),
        status: 'error',
        endedAt: new Date(),
      });

      await this.taskRepository.save(task);
    }
  }
}
