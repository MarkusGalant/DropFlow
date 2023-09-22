import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Box, Drawer, List, Link, Typography, Stack } from '@mui/material';

import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import PublicIcon from '@mui/icons-material/Public';

import Scrollbar from '../../../components/Scrollbar';
import Logo from '../../../components/Logo';

import NavItem from './item';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

// ----------------------------------------------------------------------

type NavProps = {
  openNav: boolean;
  onCloseNav: () => void;
};

export default function Nav({ openNav, onCloseNav }: NavProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ p: 3, pb: 5 }}>
        <Link href="/workflows" underline="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box>
              <Logo />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                Drop Flow
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Developed by Mark Galant
              </Typography>
            </Box>
          </Stack>
        </Link>
      </Box>
      <Box>
        <List disablePadding sx={{ p: 1 }}>
          <NavItem
            path="workflows"
            title="Workflows"
            icon={<AccountTreeIcon />}
          />
          <NavItem
            path="executions"
            title="Executions"
            icon={<ManageHistoryIcon />}
          />
          <NavItem
            path="wallets"
            title="Wallets"
            icon={<AccountBalanceWalletIcon />}
          />

          <NavItem path="networks" title="Networks" icon={<PublicIcon />} />
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: NAV_WIDTH,
      }}
    >
      <Drawer
        open
        variant="permanent"
        PaperProps={{
          sx: {
            width: NAV_WIDTH,
            minWidth: NAV_WIDTH,
            bgcolor: 'background.default',
            borderRightStyle: 'dashed',
          },
        }}
      >
        {renderContent}
      </Drawer>
    </Box>
  );
}
