import { forwardRef, ReactNode } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
//
import { StyledLabel } from './styles';

// ----------------------------------------------------------------------
type LabelProps = BoxProps & {
  endIcon?: ReactNode;
  children?: ReactNode;
  startIcon?: ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost' | 'soft';
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
};
// eslint-disable-next-line react/display-name
const Label = forwardRef<typeof StyledLabel, LabelProps>(
  (
    {
      children,
      color = 'default',
      variant = 'soft',
      startIcon,
      endIcon,
      sx,
      ...other
    },
    ref,
  ) => {
    const theme = useTheme();

    const iconStyle = {
      width: 16,
      height: 16,
      '& svg, img': { width: 1, height: 1, objectFit: 'cover' },
    };

    return (
      <StyledLabel
        ref={ref}
        component="span"
        variant={variant}
        color={color}
        sx={{
          ...(startIcon && { pl: 0.75 }),
          ...(endIcon && { pr: 0.75 }),
          ...sx,
        }}
        theme={theme}
        {...other}
      >
        {startIcon && <Box sx={{ mr: 0.75, ...iconStyle }}> {startIcon} </Box>}

        {children}

        {endIcon && <Box sx={{ ml: 0.75, ...iconStyle }}> {endIcon} </Box>}
      </StyledLabel>
    );
  },
);

export default Label;
