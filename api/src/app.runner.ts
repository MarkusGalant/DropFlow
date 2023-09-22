import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TaskService } from './services/task.service';

let lock = false;

@Injectable()
export class AppRunner {
  private readonly logger = new Logger(AppRunner.name);

  constructor(private taskService: TaskService) {}

  @Cron('*/30 * * * * *')
  public async executeTasks() {
    this.logger.debug(`${Date.now()} | Start execute`);

    try {
      if (lock) return;

      lock = true;

      const task = await this.taskService.getTasksForExecution();

      if (!task) {
        this.logger.debug(`${Date.now()} | Not found Task to execute`);
        return;
      }

      const taskInProgress = await this.taskService.getInProgress();

      if (taskInProgress && taskInProgress.id !== task.id) {
        this.logger.debug(
          `${Date.now()} | Another task in progress taskInProgress:${taskInProgress?.id}`,
        );

        return;
      }

      this.logger.debug(`${Date.now()} | Start task: ${task.id}`);

      await this.taskService.execute(task.id);

      this.logger.debug(`${Date.now()} | Finished task: ${task.id}`);
    } catch (error) {
      this.logger.error('Error:', error);
    } finally {
      this.logger.debug(`${Date.now()} | Finished execute`);

      lock = false;
    }
  }
}
