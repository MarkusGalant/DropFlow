/* eslint-disable @typescript-eslint/ban-ts-comment */
// @mui
import { alpha, styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export const StyledLabel = styled(Box)<{
  variant: 'filled' | 'outlined' | 'ghost' | 'soft';
  color:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error';
}>(({ theme, variant, color }) => {
  const isLight = theme.palette.mode === 'light';

  const filledVariant = variant === 'filled';

  const outlinedVariant = variant === 'outlined';

  const softVariant = variant === 'soft';

  const defaultStyle = {
    ...(color === 'default' && {
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.32)}`,
      }),
      // SOFT
      ...(softVariant && {
        color: isLight
          ? theme.palette.text.primary
          : theme.palette.common.white,
        backgroundColor: alpha(theme.palette.grey[500], 0.16),
      }),
    }),
  };

  const colorStyle = {
    ...(color !== 'default' && {
      // FILLED
      ...(filledVariant && {
        //@ts-ignore
        color: theme.palette[color].contrastText,
        //@ts-ignore
        backgroundColor: theme.palette[color].main,
      }),
      // OUTLINED
      ...(outlinedVariant && {
        backgroundColor: 'transparent',
        //@ts-ignore
        color: theme.palette[color].main,
        //@ts-ignore
        border: `1px solid ${theme.palette[color].main}`,
      }),
      // SOFT
      ...(softVariant && {
        //@ts-ignore
        color: theme.palette[color][isLight ? 'dark' : 'light'],
        //@ts-ignore
        backgroundColor: alpha(theme.palette[color].main, 0.16),
      }),
    }),
  };

  return {
    height: 24,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 6,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    textTransform: 'capitalize',
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,
    ...colorStyle,
    ...defaultStyle,
  };
});
