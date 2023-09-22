import { FC } from 'react';
import { useParams } from 'react-router-dom';

//@mui
import { Link } from '@mui/material';

import { useNetworks } from '../../hooks';

import { formatTx } from '../../utils';

type TransactionProps = {
  tx: {
    chainId: number;
    hash: string;
  };
};

const Transaction: FC<TransactionProps> = ({ tx }) => {
  const { executionId } = useParams();

  if (!executionId) throw Error('Not found');

  const { data: networks } = useNetworks();

  const network = networks.find((it) => it.chainId === tx.chainId);

  return (
    <Link
      href={`${network?.explorer}/tx/${tx.hash}`}
      underline="none"
      target="_blank"
      rel="noopener noreferrer"
    >
      {formatTx(tx.hash)}
    </Link>
  );
};

export default Transaction;
