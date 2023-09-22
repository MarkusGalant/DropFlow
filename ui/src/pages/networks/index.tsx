import { Fragment } from 'react';

//@mui
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardHeader,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import { useDialog, useNetworks } from '../../hooks';

import NetworkDialog from './network-dialog';

const Networks = () => {
  const { data: networks } = useNetworks();

  const networkDialog = useDialog();

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Networks
          </Typography>
        </Stack>

        <Box>
          <Grid container spacing={2}>
            {networks.map((network) => (
              <Fragment key={network.id}>
                <Grid item xs={4}>
                  <Card>
                    <CardActionArea
                      onClick={async () =>
                        await networkDialog.show({ network })
                      }
                    >
                      <CardHeader
                        avatar={<Avatar src={network.icon} />}
                        title={network.name}
                        sx={{ pb: 3 }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Box>
      </Container>
      {networkDialog.open && (
        <NetworkDialog fullWidth maxWidth="sm" {...networkDialog.props} />
      )}
    </>
  );
};

export default Networks;
