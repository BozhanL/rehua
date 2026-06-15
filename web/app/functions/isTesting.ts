import { env } from 'process';

export default function isTesting(): boolean {
  return env.NODE_ENV === 'test';
}
