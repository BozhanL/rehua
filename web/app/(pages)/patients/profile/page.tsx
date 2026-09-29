'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView, { type ListRow } from '@/app/components/common/ListView';
import Surface from '@/app/components/common/Surface';
import Tabs from '@/app/components/common/Tab';
import { PatientDocuments } from '@/app/components/observations/PatientDocumentsTab';
import { PatientObservations } from '@/app/components/observations/PatientObservationsTab';
import { getPatientListRows } from '@/app/components/patient/PatientProfileList';
import useApiUrl from '@/app/hooks/useApiUrl';
import dayjs from '@/app/utils/dayjs';
import { isTesting } from '@/app/utils/env';
import { findOne } from '@rehua/sdk/functional/patient';
import {
  queryOptions,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import Image from 'next/image';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useFindOne(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findOne.path(id), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      findOne(
        {
          host: host,
          simulate: isTesting,
          options: { signal, credentials: 'include' },
        },
        id,
      ),
  });
}

export default function PatientProfilePage(): JSX.Element {
  const router = useRouter();

  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') ?? '';
  const options = useFindOne(patientId);
  const doc = useQuery(options);
  const patient = doc.data;

  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!patient) {
    console.log(patient);
    notFound();
  }

  const patientRows: ListRow[] = getPatientListRows(patient);

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div
          className="
            mx-6 mt-6 mb-5 flex min-w-max items-center gap-6 bg-rehua-white
          "
        >
          <button
            type="button"
            onClick={() => {
              router.push('/patients');
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="circle-arrow" width={50} className="text-rehua-navy" />
          </button>
          <div className="flex gap-3">
            <Icon name="patient" width={35} />
            <span className="text-3xl font-bold">Patient Profile</span>
          </div>
        </div>

        {/* patient photo + important patient information */}
        <div className="mx-6 overflow-x-auto">
          <div className="flex min-w-full shrink-0 items-center gap-8">
            {/* patient photo, if no url is provided just show a default gray rectangle */}
            <div
              className="
                relative aspect-3/4 w-52 shrink-0 overflow-hidden rounded-4xl
                bg-rehua-gray
              "
              style={{ boxShadow: 'inset 0 5px 8px rgb(0 0 0 / 0.2)' }}
            >
              {patient.photoUrl === undefined || patient.photoUrl === '' ? (
                <div className="flex size-full items-center justify-center">
                  <Icon name="user" width={85} className="text-rehua-white" />
                </div>
              ) : (
                <Image
                  src={patient.photoUrl}
                  alt={`${patient.firstName} ${patient.lastName} profile photo`}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* patient information*/}
            <div className="flex w-150 shrink-0 flex-col justify-center gap-8">
              <div className="flex flex-col gap-4 text-xl">
                <div className="flex gap-3">
                  <span className="font-medium">
                    <b>Full Name:</b> {patient.firstName} {patient.lastName}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="font-medium">
                    <b>Date of Birth: </b>
                    {dayjs(patient.dateOfBirth).tz().format('DD/MM/YYYY')}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="font-medium">
                    <b>Address:</b> {patient.address}
                  </span>
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-6">
                <ContentButton
                  text1="Edit Info"
                  iconProps={{ name: 'pencil', width: 0.8 }}
                  iconPosition="right"
                  horizontalPadding={0.5}
                  textIconGap={0.3}
                  backgroundColor="bg-rehua-tangerine"
                  className="text-xl"
                  onClick={() => {
                    router.push(`/patients/profile/edit?id=${patientId}`);
                  }}
                />

                <ContentButton
                  text1="Emergency"
                  text2="Contacts"
                  textAlign="left"
                  lineHeight={1.2}
                  iconProps={{ name: 'access' }}
                  iconPosition="right"
                  verticalPadding={0.2}
                  horizontalPadding={0.4}
                  backgroundColor="bg-rehua-blue"
                />
              </div>
            </div>
          </div>
        </div>

        {/* patient information list */}
        <div className="pt-4">
          <ListView rows={patientRows} insidePadding="px-8" />
        </div>

        {/* tabs: patient documents + observations */}
        <div className="overflow-x-auto pt-4">
          <Tabs
            tabs={[
              {
                id: 'documents',
                label: 'Patient Documents',
                iconProps: {
                  name: 'user-folder',
                  width: 35,
                },
                content: <PatientDocuments patientId={patientId} />,
              },
              {
                id: 'observations',
                label: 'Patient Observations',
                iconProps: {
                  name: 'heart-pulse',
                  width: 35,
                },
                content: <PatientObservations />,
              },
            ]}
          />
        </div>
      </Surface>
    </div>
  );
}
