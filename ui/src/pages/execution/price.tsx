import { FC } from 'react';
import { formatEther, formatUnits, parseUnits } from 'ethers';

//@mui
import { Box, Tooltip } from '@mui/material';

import { usePrices } from '../../hooks';
import { formatCurrency } from '../../utils';

type PriceProps = {
  tx: {
    gasUsed: string;
    gasPrice: string;
  };
};

const Price: FC<PriceProps> = ({ tx }) => {
  const { data: price } = usePrices();

  if (!price?.ETH) return <></>;

  const gasUsed = parseFloat(formatEther(tx.gasUsed));
  const gasUsedPrice = gasUsed * price.ETH;
  const gasPrice = formatUnits(parseUnits(tx.gasPrice, 'wei'), 'gwei');

  return (
    <Tooltip title={`Gas Price: ${gasPrice} GWEI`}>
      <Box>{formatCurrency(gasUsedPrice)}</Box>
    </Tooltip>
  );
};

export default Price;
