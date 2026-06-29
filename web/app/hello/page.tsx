'use client';

import { APIUrlContext } from '@/app/providers';
import { isTesting } from '@/app/utils/env';
import { create, remove, findAll } from '@rehua/sdk/functional/hello';
import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';
import Form from 'next/form';
import { useContext, type JSX } from 'react';
import typia, { functional } from 'typia';

function useHelloOptions(): ReturnType<
  typeof queryOptions<findAll.Output, Error, findAll.Output, string[]>
> {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['hello', host],
    queryFn: () =>
      findAll({
        host: host,
        simulate: isTesting,
      }),
  });
}

function Home(): JSX.Element {
  const host = useContext(APIUrlContext);
  const queryClient = useQueryClient();

  const options = useHelloOptions();
  const findAllHello = useQuery(options);

  async function createHello(formData: FormData): Promise<void> {
    await create(
      { host, simulate: isTesting },
      {
        id: typia.assert<string>(formData.get('id')),
        content: typia.assert<string>(formData.get('content')),
      },
    );

    await queryClient.invalidateQueries({
      queryKey: options.queryKey,
    });
  }
  async function deleteHello(formData: FormData): Promise<void> {
    await remove(
      { host, simulate: isTesting },
      typia.assert<string>(formData.get('id')),
    );

    await queryClient.invalidateQueries({
      queryKey: options.queryKey,
    });
  }

  if (findAllHello.isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Hello world</h1>

      <div>
        <Form action={createHello}>
          <input name="id" required />
          <input name="content" required />
          <button type="submit">Create Hello</button>
        </Form>
      </div>

      <div>
        <Form action={deleteHello}>
          <input name="id" required />
          <button type="submit">Delete Hello</button>
        </Form>
      </div>

      <div>
        {findAllHello.data?.map((d) => (
          <p key={d.id}>
            {d.id} -- {d.content}
          </p>
        ))}
      </div>
    </>
  );
}

export default functional.assertFunction(Home);
