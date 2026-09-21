'use client';

import ContentButton from './components/common/ContentButton';
import Icon from './components/common/Icon';
import AddDocumentModal from './components/modals/AddDocumentModal';
import { UploadDocumentButton } from './components/modals/UploadDocumentButton';
import { APIUrlContext } from './providers';
import {
  ShowManualButton,
  UploadManualButton,
} from '@/app/components/navigation/ManualButtons';
import { isTesting } from '@/app/utils/env';
import { getHello } from '@rehua/sdk/functional';
import { queryOptions, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useContext, useState, type JSX } from 'react';
import { functional } from 'typia';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useHelloOptions() {
  const host = useContext(APIUrlContext);

  return queryOptions({
    queryKey: ['hello', host],
    queryFn: async () =>
      getHello({
        host: host,
        simulate: isTesting,
      }),
  });
}

function Home(): JSX.Element {
  const query = useQuery(useHelloOptions());

  const [patientId, setPatientId] = useState('');
  const [openAddDocumentModal, setOpenAddDocumentModal] = useState(false);

  if (!query.isSuccess) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <h1>Hello world -- {query.data}</h1>
      <Icon name={'eye'} />
      <UploadManualButton />
      <ShowManualButton />
      <Link href="/templates/create">
        <ContentButton
          type="button"
          iconProps={{ name: 'circle-arrow' }}
          text1="Create Template"
          backgroundColor="bg-rehua-green"
        />
      </Link>

      <input
        name="patientId"
        onChange={(e) => {
          setPatientId(e.target.value);
        }}
        value={patientId}
      />
      <UploadDocumentButton patientId={patientId} />

      <ContentButton
        type="button"
        iconProps={{ name: 'circle-arrow' }}
        text1="Create Document"
        backgroundColor="bg-rehua-green"
        onClick={() => {
          setOpenAddDocumentModal(true);
        }}
      />
      <AddDocumentModal
        isOpen={openAddDocumentModal}
        onBack={() => {
          setOpenAddDocumentModal(false);
        }}
        patientId={patientId}
      />
    </>
  );
}

export default functional.assertFunction(Home);
