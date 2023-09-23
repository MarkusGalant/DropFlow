import { Fragment } from 'react';
import { useParams } from 'react-router-dom';

//@mui
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Typography,
  Tooltip,
} from '@mui/material';

import {
  useExecution,
  useExecutionTasks,
  useTools,
  useWallets,
} from '../../hooks';

import GridTable, { Column } from '../../components/GridTable';

import { formatDate } from '../../utils';
import Label from '../../components/Label';

import Transaction from './transaction';
import Price from './price';

const Execution = () => {
  const { executionId } = useParams();

  if (!executionId) throw Error('Not found');

  const { data: wallets } = useWallets();
  const { data: tools } = useTools();
  const { data: execution } = useExecution(executionId);
  const { data: tasks } = useExecutionTasks(executionId);

  const columns: Column[] = [
    {
      field: 'walletId',
      header: 'Wallet',
      renderCell: (walletId) => {
        const wallet = wallets.find((w) => w.id === walletId);

        return <>{wallet?.name}</>;
      },
    },
    {
      field: 'data',
      header: 'Transaction',
      renderCell: (data) => (data?.tx ? <Transaction tx={data?.tx} /> : <></>),
    },
    {
      field: 'data',
      header: 'Price',
      renderCell: (data) => (data?.tx ? <Price tx={data.tx} /> : <></>),
    },
    {
      field: 'status',
      header: 'Status',
      renderCell: (status, row) => {
        switch (status) {
          case 'scheduled':
            return (
              <Label variant="soft" color="primary">
                scheduled
              </Label>
            );
          case 'processing':
            return (
              <Label variant="soft" color="warning">
                processing
              </Label>
            );
          case 'execution':
            return (
              <Label variant="soft" color="warning">
                execution
              </Label>
            );
          case 'error':
            return (
              <Tooltip title={row.error?.message || 'Undetected error'}>
                <Label variant="soft" color="error">
                  failed
                </Label>
              </Tooltip>
            );
          case 'failed':
            return (
              <Tooltip title={row.error?.message || 'Undetected error'}>
                <Label variant="soft" color="error">
                  failed
                </Label>
              </Tooltip>
            );
          case 'completed':
            return (
              <Label variant="soft" color="success">
                completed
              </Label>
            );
          default:
            return <>No Status</>;
        }
      },
    },
    {
      field: 'startAt',
      header: 'Time',
      renderCell: (_, row) =>
        row.endedAt ? (
          <Tooltip
            title={`Start: ${formatDate(row.startedAt)} - Ended: ${formatDate(
              row.startedAt,
            )}`}
          >
            <>{row.startedAt && formatDate(row.startedAt)}</>
          </Tooltip>
        ) : (
          <>{row.startedAt && formatDate(row.startedAt)}</>
        ),
    },
  ];

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          {execution && execution.note}
        </Typography>
      </Stack>
      <Stack spacing={2}>
        {execution &&
          execution.workflow.steps.map((step) => {
            const tool = tools.find((t) => t.id === step.toolId);

            return tool ? (
              <Fragment key={step.id}>
                <Card>
                  <CardHeader title={tool.name} />
                  <CardContent>
                    <GridTable
                      keyField="id"
                      rows={tasks.filter((it) => it.workflowStepId == step.id)}
                      columns={columns}
                    />
                  </CardContent>
                </Card>
              </Fragment>
            ) : (
              <Fragment key={step.id}>Tool not found</Fragment>
            );
          })}
      </Stack>
    </Container>
  );
};

export default Execution;
