import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { JsonRpcProvider, formatUnits } from 'ethers';
import { useRef, useState } from 'react';

import {
  getNetworks,
  updateNetwork,
  getWalletGroups,
  createWalletGroup,
  getTools,
  getWallets,
  importWallets,
  getWorkflow,
  getWorkflows,
  createWorkflow,
  getExecutions,
  updateWorkflow,
  deleteWorkflow,
  getExecution,
  getExecutionTasks,
  createExecution,
} from './api';
import { Network } from './types';

export const useBalance = (address: string, network: Network) => {
  return useQuery({
    cacheTime: 60 * 1000,
    queryKey: ['balance', address, network.id],
    queryFn: async () => {
      const provider = new JsonRpcProvider(network.rpc);

      const balance = await provider.getBalance(address);
      return formatUnits(balance, network.decimals);
    },
  });
};

export const useDialog = () => {
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [props, setProps] = useState<any>({
    open: true,
  });
  const promiseRef = useRef<{
    resolve: (value: unknown) => void;
    reject: (value: unknown) => void;
  }>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function show(props?: any) {
    return new Promise((resolve, reject) => {
      setProps({
        ...props,
      });
      setOpen(true);
      promiseRef.current = { resolve, reject };
    });
  }

  function onClose() {
    setProps(undefined);
    setOpen(false);
    promiseRef.current!.resolve(true);
  }

  return { show, open, props: { open, onClose, ...props } };
};

export const useNetworks = () => {
  return useQuery({
    queryKey: ['networks'],
    queryFn: getNetworks,
    initialData: [],
  });
};

export const useUpdateNetwork = (networkId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNetwork(networkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['networks'] });
    },
  });
};

export const useWalletGroups = () => {
  return useQuery({
    queryKey: ['wallet-groups'],
    queryFn: getWalletGroups,
    initialData: [],
  });
};

export const useCreateWalletGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWalletGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet-groups'] });
    },
  });
};

export const useWallets = () => {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: getWallets,
    initialData: [],
  });
};

export const useImportWallets = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: importWallets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
    },
  });
};

export const useTools = () => {
  return useQuery({
    queryKey: ['tools'],
    queryFn: getTools,
    initialData: [],
  });
};

export const useWorkflows = () => {
  return useQuery({
    queryKey: ['workflows'],
    queryFn: getWorkflows,
    initialData: [],
  });
};

export const useWorkflow = (workflowId: string) => {
  return useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => getWorkflow(workflowId),
  });
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
};

export const useUpdateWorkflow = (workflowId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateWorkflow(workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflow', workflowId] });
    },
  });
};

export const useDeleteWorkflow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWorkflow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });
};

export const useExecutions = () => {
  return useQuery({
    queryKey: ['executions'],
    queryFn: getExecutions,
    initialData: [],
  });
};

export const useExecution = (executionId: string) => {
  return useQuery({
    queryKey: ['execution', executionId],
    queryFn: () => getExecution(executionId),
  });
};

export const useCreateExecution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExecution,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executions'] });
    },
  });
};

export const useExecutionTasks = (executionId: string) => {
  return useQuery({
    queryKey: ['execution-tasks', executionId],
    queryFn: () => getExecutionTasks(executionId),
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 1000,
    initialData: [],
  });
};
