import { NavLink as RouterLink } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import {
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemButtonProps,
} from '@mui/material';
import { ReactNode } from 'react';

// ----------------------------------------------------------------------

type NavItemProps = {
  path: string;
  title: ReactNode;
  icon?: ReactNode;
  info?: ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledNavItem = styled((props: ListItemButtonProps<any>) => (
  <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
  ...theme.typography.body2,
  height: 48,
  position: 'relative',
  textTransform: 'capitalize',
  color: theme.palette.text.secondary,
  borderRadius: theme.shape.borderRadius,
}));

const StyledNavItemIcon = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export default function NavItem({ title, path, icon, info }: NavItemProps) {
  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
