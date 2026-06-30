import { registerAs } from '@nestjs/config';
import { tags } from 'typia';

export interface Config {
  PORT: number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<65535>;

  NODE_ENV: 'test' | 'development' | 'production';

  MONGODB_URI_FILE: string;

  https: {
    cert: string;
    key: string;
    ca: string;
  };
}

export const https = registerAs('https', () => ({
  cert: process.env['API_CERT'],
  key: process.env['API_KEY'],
  ca: process.env['API_CA'],
}));
