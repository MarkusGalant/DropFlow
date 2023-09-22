import React from 'react';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

//@mui
import Box from '@mui/material/Box';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Menu, { MenuProps } from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ----------------------------------------------------------------------

type MoreActionMenuProps = IconButtonProps &
  React.PropsWithChildren & {
    menuProps?: Omit<MenuProps, 'open'>;
  };

export default function MoreActionMenu({
  children,
  menuProps,
  ...props
}: MoreActionMenuProps) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <Box>
          <IconButton
            {...bindTrigger(popupState)}
            onClick={(e) => {
              e.preventDefault();
              bindTrigger(popupState).onClick(e);
            }}
            {...props}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            {...bindPopover(popupState)}
            onClick={(e) => {
              e.preventDefault();
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 150,
                p: 1,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
            {...menuProps}
          >
            {children}
          </Menu>
        </Box>
      )}
    </PopupState>
  );
}
