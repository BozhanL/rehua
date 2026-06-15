// sort-imports-ignore
import { env } from 'process'; //NOSONAR

export const isTesting = env.NODE_ENV === 'test';
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
