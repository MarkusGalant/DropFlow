import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import configuration, { EnvironmentVariables } from './app.env';

import { NetworkController } from './controllers/network.controller';
import { WalletController } from './controllers/wallet.controller';
import { WorkflowController } from './controllers/workflow.controller';
import { ToolController } from './controllers/tool.controller';
import { ExecutionController } from './controllers/execution.controller';

import {
  Network,
  Task,
  Wallet,
  WalletGroup,
  Workflow,
  WorkflowExecution,
} from './models';
import {
  NetworkService,
  WalletService,
  TaskService,
  WorkflowExecutionService,
  WorkflowService,
} from './services';

import { AppRunner } from './app.runner';

// tools
import { ToolManager } from './tools/tool.manager';
import { Seeder } from './app.seeder';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => configuration],
    }),
    // LoggerModule.forRoot({
    //   pinoHttp: {
    //     level: process.env.LOG_LEVEL || 'debug',
    //     serializers: {
    //       req: (req) => ({
    //         id: req.raw.id,
    //         method: req.raw.method,
    //         url: req.raw.url,
    //         query: req.raw.query,
    //         params: req.raw.params,
    //         body: req.raw.body,
    //       }),
    //     },
    //   },
    // }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        type: 'mongodb',
        url: configService.getOrThrow('DATABASE_URL'),
        entities: [
          Network,
          Wallet,
          WalletGroup,
          Workflow,
          WorkflowExecution,
          Task,
        ],
      }),
    }),
    TypeOrmModule.forFeature([
      Network,
      Wallet,
      WalletGroup,
      Workflow,
      WorkflowExecution,
      Task,
    ]),
  ],
  controllers: [
    NetworkController,
    WalletController,
    WorkflowController,
    ToolController,
    ExecutionController,
  ],
  providers: [
    // Services
    NetworkService,
    WalletService,
    TaskService,
    WorkflowService,
    WorkflowExecutionService,

    // Runner
    AppRunner,
    Seeder,

    // Tools
    ToolManager,
  ],
})
export class AppModule {}
