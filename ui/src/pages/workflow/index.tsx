import { Fragment, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

//@mui
import {
  Avatar,
  Box,
  Container,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';

import MenuButton from '../../components/ButtonMenu';
import WorkflowStep from './workflow-step';

import {
  useTools,
  useWalletGroups,
  useWorkflow,
  useUpdateWorkflow,
  useCreateExecution,
  useNetworks,
} from '../../hooks';
import { Tool } from '../../types';

function Workflow() {
  const { workflowId } = useParams();

  if (!workflowId) throw Error('Not found');

  const navigate = useNavigate();

  const { data: tools } = useTools();
  const { data: networks } = useNetworks();
  const { data: walletGroups } = useWalletGroups();

  const { data: workflow } = useWorkflow(workflowId);
  const { mutateAsync: update } = useUpdateWorkflow(workflowId);

  const { mutateAsync: createExecution } = useCreateExecution();

  const addStep = async (tool: Tool) => {
    if (!workflow) throw Error('Workflow not found');

    await update({
      ...workflow,
      steps: [
        ...workflow.steps,
        {
          id: `${Date.now()}`,
          toolId: tool.id,
          params: tool.defaultParams,
        },
      ],
    });
  };

  const removeStep = async (stepId: string) => {
    if (!workflow) throw Error('Workflow not found');

    await update({
      ...workflow,
      steps: workflow.steps.filter((it) => it.id !== stepId),
    });
  };

  const changePrams =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (stepId: string, params: any) => {
      if (!workflow) throw Error('Workflow not found');

      await update({
        ...workflow,
        steps: workflow.steps.map((it) =>
          it.id === stepId
            ? {
                ...it,
                params,
              }
            : it,
        ),
      });
    };

  const execute = async (walletGroupId: string) => {
    if (!workflow) throw Error('Workflow not found');

    const { id } = await createExecution({
      note: `Execution ${workflow.name}`,
      workflow,
      walletGroupId,
    });

    navigate(`../executions/${id}`);
  };

  const toolMenu = useMemo(
    () =>
      networks.map((network) => {
        const nTools = tools.filter((tool) => tool.networkId === network.id);

        return nTools.length ? (
          <>
            <MenuItem
              key={network.id}
              sx={{ minWidth: 250, typography: 'subtitle1' }}
            >
              {network.name}
            </MenuItem>
            <Divider />
            {nTools.map((tool) => (
              <MenuItem
                key={tool.id}
                sx={{ pl: 4, justifyItems: 'center' }}
                onClick={() => addStep(tool)}
              >
                <Avatar
                  src={tool.icon}
                  sx={{ py: 1, height: 32, width: 'auto', mr: 2 }}
                />
                {tool.name}
              </MenuItem>
            ))}
          </>
        ) : (
          <></>
        );
      }),
    [workflow, networks, tools],
  );

  const walletGroupsMenu = useMemo(
    () =>
      walletGroups.map((walletGroup) => (
        <MenuItem
          key={walletGroup.id}
          sx={{ minWidth: 200 }}
          onClick={() => execute(walletGroup.id)}
        >
          {walletGroup.name}
        </MenuItem>
      )),
    [workflow, walletGroups],
  );

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          {workflow && workflow.name}
        </Typography>
        <Stack spacing={2} direction="row">
          <MenuButton variant="contained" menu={toolMenu}>
            Add Step
          </MenuButton>
          <MenuButton variant="contained" menu={walletGroupsMenu}>
            Execute
          </MenuButton>
        </Stack>
      </Stack>

      <Grid spacing={4} container>
        {workflow &&
          workflow.steps.map((step) => {
            const tool = tools.find((t) => t.id === step.toolId);
            return tool ? (
              <Fragment key={step.id}>
                <Grid item xs={12} lg={6}>
                  <WorkflowStep
                    ui={tool.ui}
                    title={
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                          src={tool.icon}
                          sx={{ height: 24, width: 'auto' }}
                        />
                        <Box>{tool.name}</Box>
                      </Stack>
                    }
                    params={step.params}
                    onParamsChange={(params) => changePrams(step.id, params)}
                    onAction={(action) => {
                      if (action === 'delete') removeStep(step.id);
                    }}
                  />
                </Grid>
              </Fragment>
            ) : (
              <Fragment key={step.id}>Tool not found</Fragment>
            );
          })}
      </Grid>
    </Container>
  );
}

export default Workflow;
