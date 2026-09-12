import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { findOne as findOneTemplate } from '@rehua/sdk/functional/templates';
import { queryOptions, type QueryFunctionContext } from '@tanstack/react-query';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function useFindOneTemplateOptions(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findOneTemplate.path(id), host, id],
    queryFn: async ({ signal }: QueryFunctionContext) => {
      return findOneTemplate(
        {
          host: host,
          simulate: isTesting,
          options: { signal },
        },
        id,
      );
    },
  });
}
