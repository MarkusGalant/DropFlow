import { Fragment } from 'react';
import { NavLink as RouterLink, useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  useWorkflows,
  useCreateWorkflow,
  useDeleteWorkflow,
  useTools,
} from '../../hooks';

import MoreActionMenu from '../../components/MoreActionMenu';

type StepElementProps = {
  name: string;
  icon: string;
};

const StepElement = ({ name, icon }: StepElementProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Avatar src={icon} sx={{ height: 18, width: 'auto' }} />
      <Box>{name}</Box>
    </Stack>
  );
};

const Workflows = () => {
  const navigate = useNavigate();
  const { data: workflows } = useWorkflows();
  const { data: tools } = useTools();
  const { mutateAsync: createWorkflow } = useCreateWorkflow();
  const { mutateAsync: deleteWorkflow } = useDeleteWorkflow();

  const addWorkflow = async () => {
    const { id } = await createWorkflow({
      name: `Workflow ${workflows.length + 1}`,
      description: '',
      steps: [],
    });

    navigate(`${id}`);
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4" gutterBottom>
          Workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => addWorkflow()}
        >
          Create Workflow
        </Button>
      </Stack>

      <Box>
        <Grid container spacing={2}>
          {workflows.map((workflow) => (
            <Grid key={workflow.id} item xs={4}>
              <Card sx={{ width: '100%' }}>
                <CardActionArea
                  component={RouterLink}
                  to={workflow.id}
                  sx={{ minHeight: 200 }}
                >
                  <CardHeader
                    title={workflow.name}
                    action={
                      <MoreActionMenu>
                        <MenuItem>Export</MenuItem>
                        <MenuItem
                          onClick={async () =>
                            await deleteWorkflow(workflow.id)
                          }
                        >
                          <DeleteIcon color="error" sx={{ mr: 2 }} />
                          <Box>Delete</Box>
                        </MenuItem>
                      </MoreActionMenu>
                    }
                  />
                  <CardContent>
                    {workflow.steps.map((step) => {
                      const tool = tools.find(
                        (tool) => tool.id === step.toolId,
                      );

                      return tool ? (
                        <Fragment>
                          <StepElement {...tool} />
                        </Fragment>
                      ) : (
                        <>Not found tool</>
                      );
                    })}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Workflows;
