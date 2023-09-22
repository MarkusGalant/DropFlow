import React, { FC, useEffect, useState } from 'react';

import {
  Box,
  Button,
  Card,
  Container,
  Stack,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Link,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import {
  useDialog,
  useBalance,
  useWalletGroups,
  useWallets,
  useNetworks,
} from '../../hooks';

import GridTable, { Column } from '../../components/GridTable';
import MoreActionMenu from '../../components/MoreActionMenu';

import ImportWalletsDialog from './import-wallets-dialog';
import CreateWalletGroupDialog from './create-wallet-group-dialog';

import { Network } from '../../types';

type BalanceProps = {
  network: Network;
  address: string;
};

const baseColumns: Column[] = [
  {
    field: 'walletName',
    header: 'Wallet',
    align: 'left',
    renderCell: (name: string) => <>{name}</>,
  },
  {
    field: 'address',
    header: 'Address',
    align: 'left',
    renderCell: (address: string) => <>{address}</>,
  },
];

const Balance: FC<BalanceProps> = ({ network, address }) => {
  const { data: balance, isLoading } = useBalance(address, network);

  return isLoading ? (
    <>loading</>
  ) : (
    <>{`${balance ? balance.substring(0, 7) : '0.0'} ${network.symbol}`}</>
  );
};

export const MemoizedBalance = React.memo(Balance);

const Wallets = () => {
  const [tab, setTab] = useState('');
  const { data: groups } = useWalletGroups();
  const { data: wallets } = useWallets();
  const { data: networks } = useNetworks();

  const importWalletsDialog = useDialog();
  const createWalletGroupDialog = useDialog();

  useEffect(() => {
    if (groups.length) setTab(groups[0].id);
  }, [groups]);

  const columns = [
    ...baseColumns,
    ...networks.map((network) => ({
      field: 'address',
      header: (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar src={network.icon} />
        </Box>
      ),
      align: 'center' as const,
      renderCell: (address: string) => (
        <Link
          color="inherit"
          variant="subtitle2"
          underline="none"
          target="_blank"
          rel="noopener noreferrer"
          href={`${network.explorer}/address/${address}`}
        >
          <Balance address={address} network={network} />
        </Link>
      ),
    })),
    {
      field: 'id',
      header: '',
      align: 'right' as const,
      renderCell: () => (
        <MoreActionMenu>
          <MenuItem>
            <DeleteIcon color="error" sx={{ mr: 2 }} />
            <Box>Delete</Box>
          </MenuItem>
        </MoreActionMenu>
      ),
    },
  ];
  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Wallets
          </Typography>
          <Stack spacing={2} direction="row">
            <Button
              variant="contained"
              onClick={async () => await createWalletGroupDialog.show()}
            >
              Create Group
            </Button>
            <Button
              variant="contained"
              onClick={async () => await importWalletsDialog.show()}
            >
              Import
            </Button>
          </Stack>
        </Stack>

        <Card>
          <Box p={2}>
            <Stack direction="row" justifyContent="space-between">
              <Tabs value={tab} onChange={(_, val) => setTab(val)}>
                {groups.map((group) => (
                  <Tab key={group.id} label={group.name} value={group.id}></Tab>
                ))}
              </Tabs>
              <MoreActionMenu>
                <MenuItem>
                  <DeleteIcon color="error" sx={{ mr: 2 }} />
                  <Box>Delete</Box>
                </MenuItem>
              </MoreActionMenu>
            </Stack>
            <Box pt={2}>
              <GridTable
                keyField="id"
                columns={columns}
                rows={wallets.filter((it) => it.groupId === tab)}
              />
            </Box>
          </Box>
        </Card>
      </Container>
      {importWalletsDialog.open && (
        <ImportWalletsDialog
          fullWidth
          maxWidth="lg"
          {...importWalletsDialog.props}
        />
      )}
      {createWalletGroupDialog.open && (
        <CreateWalletGroupDialog
          fullWidth
          maxWidth="sm"
          {...createWalletGroupDialog.props}
        />
      )}
    </>
  );
};

export default Wallets;
