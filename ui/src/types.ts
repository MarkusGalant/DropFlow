/* eslint-disable @typescript-eslint/no-explicit-any */
export type WalletGroup = {
  id: string;
  name: string;
};

export type Wallet = {
  id: string;
  name: string;
  address: string;
  groupId: string;
};

export type ImportWallets = {
  groupId: string;
  mnemonics: string[];
};

export type Network = {
  id: string;
  name: string;
  icon: string;
  rpc: string;
  explorer: string;
  networkId: number;
  chainId: number;
  symbol: string;
  decimals: number;
};

export type Workflow = {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
};

export type WorkflowStep = {
  id: string;
  toolId: string;
  params: any;
};

export type Tool = {
  id: string;
  name: string;
  networkId: string;
  icon: string;
  defaultParams: any;
  ui: any;
};

export type Execution = {
  id: string;
  note: string;
  workflow: Workflow;
  walletGroupId: string;
  startedAt: string | null;
  endedAt: string | null;
};

export type Task = {
  id: string;
  executionId: string;
  previousTaskId: string | null;
  workflowId: string;
  workflowStepId: string;
  walletId: string;
  toolId: string;
  status:
    | 'scheduled'
    | 'execution'
    | 'processing'
    | 'completed'
    | 'error'
    | 'failed';
  params: any;
  data: any;
  error: any;
  createdAt: string | null;
  startedAt: string | null;
  endedAt: string | null;
};

export type UpdateNetwork = Network;
export type CreateWalletGroup = Omit<WalletGroup, 'id'>;
export type CreateWorkflow = Omit<Workflow, 'id'>;
export type UpdateWorkflow = Workflow;

export type CreateExecution = Pick<
  Execution,
  'note' | 'workflow' | 'walletGroupId'
>;
