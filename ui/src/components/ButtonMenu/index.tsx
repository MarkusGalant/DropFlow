import React, { ReactNode } from 'react';

import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

//@mui
import Box from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// ----------------------------------------------------------------------

type ButtonMenuProps = ButtonProps &
  React.PropsWithChildren & {
    menu?: ReactNode | undefined;
    menuProps?: Omit<MenuProps, 'open'>;
  };

export default function ButtonMenu({
  menu,
  menuProps,
  ...props
}: ButtonMenuProps) {
  return (
    <PopupState variant="popover">
      {(popupState) => (
        <Box>
          <Button
            endIcon={<KeyboardArrowDownIcon />}
            {...bindTrigger(popupState)}
            {...props}
          />
          <Menu
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            {...menuProps}
          >
            {menu}
          </Menu>
        </Box>
      )}
    </PopupState>
  );
}
