import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ThemeProvider from './theme';

import Layout from './pages/layout';
import Networks from './pages/networks';
import Wallets from './pages/wallets';
import Workflow from './pages/workflow';
import Workflows from './pages/workflows';
import Executions from './pages/executions';
import Execution from './pages/execution';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'wallets',
        element: <Wallets />,
      },
      {
        path: 'networks',
        element: <Networks />,
      },
      {
        path: 'workflows',
        element: <Workflows />,
      },
      {
        path: 'workflows/:workflowId',
        element: <Workflow />,
      },
      {
        path: 'executions',
        element: <Executions />,
      },
      {
        path: 'executions/:executionId',
        element: <Execution />,
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <RouterProvider
          router={router}
          fallbackElement={<p>Initial Load...</p>}
        />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
