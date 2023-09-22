import { InputAdornment, MenuItem, Stack, TextField } from '@mui/material';

type SwapFieldValue = {
  tokenIn: string;
  tokenOut: string;
  amount: string;
};
type SwapFieldProps = {
  value: SwapFieldValue;
  options: { value: string; label: string }[];
  onChange: (val: SwapFieldValue) => void;
};

export default function SwapField({
  value,
  options,
  onChange,
}: SwapFieldProps) {
  return (
    <Stack spacing={2} direction="row">
      <TextField
        fullWidth
        label="Amount"
        value={value.amount}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">{value.tokenIn}</InputAdornment>
          ),
        }}
        onChange={(e) => onChange({ ...value, amount: e.target.value })}
      />
      <TextField
        select
        label="Token In"
        value={value.tokenIn}
        sx={{ minWidth: 100 }}
        onChange={(e) => onChange({ ...value, tokenIn: e.target.value })}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Token Out"
        value={value.tokenOut}
        sx={{ minWidth: 100 }}
        onChange={(e) => onChange({ ...value, tokenOut: e.target.value })}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  );
}
