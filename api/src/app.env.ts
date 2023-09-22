/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { config } from 'dotenv';

config({ path: '.env.local' });
config();

const configuration = {
  DATABASE_URL: process.env.DATABASE_URL!,
};

export type EnvironmentVariables = typeof configuration;

export default configuration;
