import { FC, useState } from 'react';

//@mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useCreateWalletGroup } from '../../hooks';

type CreateWalletGroupDialogsProps = DialogProps;

const CreateWalletGroupDialog: FC<CreateWalletGroupDialogsProps> = ({
  onClose,
  ...props
}) => {
  const [fields, setFiled] = useState({
    name: '',
  });
  const { mutate, isLoading: isLoadingCreate } = useCreateWalletGroup();

  const createWalletGroup = async () => {
    const data = {
      name: fields.name,
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
      <DialogTitle id="alert-dialog-title">Create Wallet Group</DialogTitle>
      <DialogContent>
        <Stack sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={fields.name}
            onChange={(e) =>
              setFiled((val) => ({
                ...val,
                name: e.target.value,
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
          disabled={isLoadingCreate}
          onClick={createWalletGroup}
          autoFocus
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWalletGroupDialog;
