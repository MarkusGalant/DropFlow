import { FC, useState } from 'react';

//@mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useWalletGroups, useImportWallets } from '../../hooks';

type ImportWalletsDialogProps = DialogProps;

const ImportWalletsDialog: FC<ImportWalletsDialogProps> = ({
  onClose,
  ...props
}) => {
  const [fields, setFiled] = useState({
    group: '',
    content: '',
  });
  const { data: groups, isLoading: isLoadingGroup } = useWalletGroups();
  const { mutate, isLoading: isLoadingImport } = useImportWallets();

  const importWallets = async () => {
    const data = {
      groupId: fields.group,
      mnemonics: fields.content.split('\n'),
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
      <DialogTitle id="alert-dialog-title">Import wallets</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            select
            label="Group"
            value={fields.group}
            onChange={(e) =>
              setFiled((val) => ({
                ...val,
                group: e.target.value,
              }))
            }
          >
            {groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={15}
            placeholder="Mnemonics"
            value={fields.content}
            onChange={(e) =>
              setFiled((val) => ({
                ...val,
                content: e.target.value,
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
          disabled={isLoadingImport || isLoadingGroup}
          onClick={importWallets}
          autoFocus
        >
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportWalletsDialog;
