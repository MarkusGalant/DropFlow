import { differenceInHours, format, formatDistance } from 'date-fns';

export const formatDate = (val: string) => {
  const date = new Date(val);
  const now = new Date();

  return differenceInHours(date, now) < 12
    ? formatDistance(date, now)
    : format(new Date(val), 'yyyy MMM dd  HH:mm');
};

export const formatTx = (val: string) =>
  `${val.substr(0, 6)}...${val.substr(-4)}`;

export const formatCurrency = (val: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 6,
  });

  return formatter.format(val);
};
