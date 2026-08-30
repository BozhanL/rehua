'use client';
import { PatientDocuments } from './documentstab';
import { PatientListRows, patient } from './patientlistview';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import Surface from '@/app/components/common/Surface';
import Tabs from '@/app/components/common/Tab';
import dayjs from '@/app/utils/dayjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { JSX } from 'react';

// import { useSearchParams } from 'next/navigation';
// TODO: backend - variables to get patientId from the URL query parameters, may be used by backend (?)
// const searchParams = useSearchParams();
// const patientId = searchParams.get('id');

// TODO frontend - handle button clicks to edit patient info and view emergency contacts

export default function PatientProfilePage(): JSX.Element {
  const router = useRouter();

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div
          className="
            flex min-w-max items-center gap-6 bg-rehua-white px-6 pt-6 pb-5
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
              {
                // TODO: backend - ignore this until backend is completed to provide a photoUrl for the patient
                patient.photoUrl ? (
                  <Image
                    src={patient.photoUrl}
                    alt={`${patient.firstName} ${patient.lastName} profile photo`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Icon name="user" width={85} className="text-rehua-white" />
                  </div>
                )
              }
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
          <ListView rows={PatientListRows} insidePadding="px-8" />
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
                content: PatientDocuments(),
              },
              {
                id: 'observations',
                label: 'Patient Observations',
                iconProps: {
                  name: 'heart-pulse',
                  width: 35,
                },
                content: <p>Observations content goes here.</p>,
              },
            ]}
          />
        </div>
      </Surface>
    </div>
  );
}
