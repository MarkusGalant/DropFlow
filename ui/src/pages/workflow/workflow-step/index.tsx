/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  Box,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import SwapField from '../../../components/ToolForm/SwapField';
import MoreActionMenu from '../../../components/MoreActionMenu';

type WorkflowStepProps = {
  title: string;
  ui: any;
  params: any;
  onParamsChange: (params: any) => void;
  onAction: (action: 'delete') => void;
};

const WorkflowStep: FC<WorkflowStepProps> = ({
  title,
  params,
  ui,
  onParamsChange,
  onAction,
}) => {
  return (
    <Card sx={{ minHeight: 200 }}>
      <CardHeader
        title={title}
        action={
          <MoreActionMenu>
            <MenuItem onClick={() => onAction('delete')}>
              <DeleteIcon color="error" sx={{ mr: 2 }} />
              <Box>Delete</Box>
            </MenuItem>
          </MoreActionMenu>
        }
      />
      <CardContent>
        <Stack spacing={4}>
          <SwapField
            value={params.swap}
            onChange={(val) => onParamsChange({ ...params, swap: val })}
            {...ui.swap}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default WorkflowStep;
