import { APIUrlContext } from '@/app/providers';
import { useContext } from 'react';

export default function useApiUrl(): string {
  return useContext(APIUrlContext);
}
