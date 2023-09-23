import axios from 'axios';
import {
  Network,
  UpdateNetwork,
  WalletGroup,
  Wallet,
  ImportWallets,
  Workflow,
  CreateWorkflow,
  UpdateWorkflow,
  Tool,
  Execution,
  CreateExecution,
  Task,
  CreateWalletGroup,
} from './types';

export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export const getPrice = async () => {
  const { data } = await api.get<{ USD: number }>(
    'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
  );
  return {
    ETH: data.USD,
  };
};

export const getNetworks = async () => {
  const { data } = await api.get<Network[]>('/networks');
  return data;
};

export const updateNetwork =
  (networkId: string) => async (body: UpdateNetwork) => {
    const { data } = await api.put(`/networks/${networkId}`, body);
    return data;
  };

export const getWalletGroups = async () => {
  const { data } = await api.get<WalletGroup[]>('/wallets/groups');
  return data;
};

export const createWalletGroup = async (body: CreateWalletGroup) => {
  const { data } = await api.post(`/wallets/groups`, body);
  return data;
};

export const getWallets = async () => {
  const { data } = await api.get<Wallet[]>('/wallets');
  return data;
};

export const importWallets = async (body: ImportWallets) => {
  const { data } = await api.post('/wallets/import', body);
  return data;
};

export const getTools = async () => {
  const { data } = await api.get<Tool[]>(`/tools`);
  return data;
};

export const getWorkflows = async () => {
  const { data } = await api.get<Workflow[]>(`/workflows`);
  return data;
};

export const getWorkflow = async (workflowId: string) => {
  const { data } = await api.get<Workflow>(`/workflows/${workflowId}`);
  return data;
};

export const createWorkflow = async (body: CreateWorkflow) => {
  const { data } = await api.post(`/workflows`, body);
  return data;
};

export const updateWorkflow =
  (workflowId: string) => async (body: UpdateWorkflow) => {
    const { data } = await api.put(`/workflows/${workflowId}`, body);
    return data;
  };

export const deleteWorkflow = async (workflowId: string) => {
  const { data } = await api.delete(`/workflows/${workflowId}`);
  return data;
};

export const getExecutions = async () => {
  const { data } = await api.get<Execution[]>(`/executions/`);
  return data;
};

export const getExecution = async (executionId: string) => {
  const { data } = await api.get<Execution>(`/executions/${executionId}`);
  return data;
};

export const createExecution = async (body: CreateExecution) => {
  const { data } = await api.post(`/executions`, body);
  return data;
};

export const getExecutionTasks = async (executionId: string) => {
  const { data } = await api.get<Task[]>(`/executions/${executionId}/tasks`);
  return data;
};
