import { FC, useState } from 'react';

//@mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useUpdateNetwork } from '../../hooks';
import { Network } from '../../types';

type NetworkDialogProps = DialogProps & {
  network: Network;
};

const NetworkDialog: FC<NetworkDialogProps> = ({
  network,
  onClose,
  ...props
}) => {
  const [values, setValues] = useState({
    rpc: network.rpc,
    explorer: network.explorer,
  });

  const { mutate, isLoading } = useUpdateNetwork(network.id);

  const createWalletGroup = async () => {
    const data = {
      ...network,
      rpc: values.rpc,
      explorer: values.explorer,
    };

    mutate(data, {
      onSuccess: () => {
        onClose && onClose({}, 'backdropClick');
      },
      onError: () => {
        onClose && onClose({}, 'backdropClick');
      },
    });
  };

  return (
    <Dialog {...props} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{network.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="RPC"
            value={values.rpc}
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                rpc: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label="Explorer"
            value={values.explorer}
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                explorer: e.target.value,
              }))
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={() => onClose && onClose({}, 'backdropClick')}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={isLoading}
          onClick={createWalletGroup}
          autoFocus
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NetworkDialog;
