/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink as RouterLink } from 'react-router-dom';

import { useExecutions } from '../../hooks';
import { Box, Container, Stack, Typography } from '@mui/material';

import GridTable, { Column } from '../../components/GridTable';
import { formatDate } from '../../utils';

const columns: Column[] = [
  {
    field: 'note',
    header: 'Name',
    align: 'left',
    renderCell: (name: any) => <>{name}</>,
  },
  {
    field: 'workflow.name',
    header: 'Workflow',
    align: 'left',
    renderCell: (workflow: any) => <>{workflow?.name}</>,
  },
  {
    field: 'startedAt',
    header: 'Date',
    align: 'left',
    renderCell: (startedAt: any) => <>{formatDate(startedAt)}</>,
  },
  {
    field: 'status',
    header: 'Status',
    align: 'left',
    renderCell: (name: any) => <>{name}</>,
  },
];

const Executions = () => {
  const { data: executions } = useExecutions();

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Executions
        </Typography>
      </Stack>

      <Box>
        <GridTable
          keyField="id"
          rows={executions}
          columns={columns}
          tableRowProps={(row) => ({
            component: RouterLink,
            to: `${row.id}`,
            sx: { 'text-decoration': 'none' },
          })}
        />
      </Box>
    </Container>
  );
};

export default Executions;
