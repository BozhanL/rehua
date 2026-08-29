'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import Surface from '@/app/components/common/Surface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

// TODO backend to replace this with fetched data
const user = {
  fullName: 'Tama Manaaki',
  dateOfBirth: '02/10/1990',
  address: '247 Whitaker Street, Some City 3320',
  photoUrl: null, // should be string | null, path to the photo if available, otherwise null
};

// TODO frontend - handle button clicks to edit patient info and view emergency contacts

export default function PatientProfilePage(): JSX.Element {
  // TODO: backend - variables to get patientId from the URL query parameters, may be used by backend (?)
  // const searchParams = useSearchParams();
  // const patientId = searchParams.get('id');

  const router = useRouter();

  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        {/* page back button and title */}
        <div
          className="
            sticky top-0 z-20 flex min-w-max items-center gap-6 bg-rehua-white
            px-6 pt-6 pb-5
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
          <div className="flex w-max min-w-full shrink-0 items-center gap-8">
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
                user.photoUrl ? (
                  <Image
                    src={user.photoUrl}
                    alt={`${user.fullName} profile photo`}
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
                    <b>Full Name:</b> {user.fullName}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="font-medium">
                    <b>Date of Birth:</b> {user.dateOfBirth}
                  </span>
                </div>

                <div className="flex gap-3">
                  <span className="font-medium">
                    <b>Address:</b> {user.address}
                  </span>
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-4">
                <ContentButton
                  text1="Edit Info"
                  iconProps={{ name: 'pencil' }}
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
      </Surface>
    </div>
  );
}
