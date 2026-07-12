'use client';

import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import { create, remove, findAll } from '@rehua/sdk/functional/hello';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import Form from 'next/form';
import { useContext, type JSX } from 'react';
import typia, { functional } from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useHelloOptions() {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['hello', host],
    queryFn: async () =>
      findAll({
        host: host,
        simulate: isTesting,
      }),
  });
}

async function createHello({
  host,
  formData,
}: {
  host: string;
  formData: FormData;
}): Promise<create.Output> {
  return create(
    { host, simulate: isTesting },
    {
      id: typia.assert<string>(formData.get('id')),
      content: typia.assert<string>(formData.get('content')),
    },
  );
}

async function deleteHello({
  host,
  formData,
}: {
  host: string;
  formData: FormData;
}): Promise<remove.Output> {
  return remove(
    { host, simulate: isTesting },
    typia.assert<string>(formData.get('id')),
  );
}

function Home(): JSX.Element {
  const host = useContext(APIUrlContext);
  const queryClient = useQueryClient();

  const options = useHelloOptions();
  const findAllHello = useQuery(options);

  const createHelloMutation = useMutation({
    mutationFn: createHello,
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: options.queryKey,
      }),
  });

  const deleteHelloMutation = useMutation({
    mutationFn: deleteHello,
    onSuccess: async () =>
      queryClient.invalidateQueries({
        queryKey: options.queryKey,
      }),
  });

  if (!findAllHello.isSuccess) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Hello world</h1>

      <div>
        <Form
          action={(formData: FormData) => {
            createHelloMutation.mutate({ host, formData });
          }}
        >
          <input name="id" required />
          <input name="content" required />
          <button type="submit">Create Hello</button>
        </Form>
      </div>

      <div>
        <Form
          action={(formData: FormData) => {
            deleteHelloMutation.mutate({ host, formData });
          }}
        >
          <input name="id" required />
          <button type="submit">Delete Hello</button>
        </Form>
      </div>

      <div>
        {findAllHello.data.map((d) => (
          <p key={d.id}>
            {d.id} -- {d.content}
          </p>
        ))}
      </div>
    </>
  );
}

export default functional.assertFunction(Home);
