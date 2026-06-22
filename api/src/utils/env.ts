import { env } from 'node:process';

export const isTesting = env['NODE_ENV'] === 'test';
export const isDevelopment = env['NODE_ENV'] === 'development';
export const isProduction = env['NODE_ENV'] === 'production';
