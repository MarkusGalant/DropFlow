import { InputAdornment, Stack, TextField } from '@mui/material';

type SwapFieldValue = {
  gasPrice: string;
};
type TransactionFieldProps = {
  value: SwapFieldValue;
  onChange: (val: SwapFieldValue) => void;
};

export default function TransactionField({
  value,
  onChange,
}: TransactionFieldProps) {
  return (
    <Stack spacing={2} direction="row">
      <TextField
        fullWidth
        label="Gas Price"
        value={value.gasPrice}
        InputProps={{
          endAdornment: <InputAdornment position="start">WEI</InputAdornment>,
        }}
        onChange={(e) => onChange({ ...value, gasPrice: e.target.value })}
      />
    </Stack>
  );
}
