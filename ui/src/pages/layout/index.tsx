import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
//
// import Header from './header';
import Nav from './nav';
import Scrollbar from '../../components/Scrollbar';

// ----------------------------------------------------------------------

// const APP_BAR_MOBILE = 64;
// const APP_BAR_DESKTOP = 92;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  background: 'rgb(238, 242, 246)',
  // paddingTop: APP_BAR_MOBILE + 24,
  paddingTop: 48,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    // paddingTop: APP_BAR_DESKTOP + 24,
    paddingTop: 48,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <StyledRoot>
      {/* <Header onOpenNav={() => setOpen(true)} /> */}

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Scrollbar
          sx={{
            height: 1,
          }}
        >
          <Outlet />
        </Scrollbar>
      </Main>
    </StyledRoot>
  );
}
