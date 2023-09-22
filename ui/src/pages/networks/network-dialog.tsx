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
      <DialogTitle id="alert-dialog-title">Network</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={network.name}
            disabled
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                name: e.target.value,
              }))
            }
          />
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
          <TextField
            fullWidth
            label="Icon"
            value={network.icon}
            disabled
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                icon: e.target.value,
              }))
            }
          />

          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Network ID"
              value={network.networkId}
              disabled
              onChange={(e) =>
                setValues((val) => ({
                  ...val,
                  networkId: e.target.value,
                }))
              }
            />
            <TextField
              fullWidth
              label="Chain ID"
              value={network.chainId}
              disabled
              onChange={(e) =>
                setValues((val) => ({
                  ...val,
                  chainId: e.target.value,
                }))
              }
            />
          </Stack>

          <TextField
            fullWidth
            label="Symbol"
            value={network.symbol}
            disabled
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                symbol: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label="Decimals"
            value={network.decimals}
            disabled
            onChange={(e) =>
              setValues((val) => ({
                ...val,
                decimals: e.target.value,
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
