'use client';
import { buildAddPatientRows, type NewPatient } from './patientaddlistview';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import Surface from '@/app/components/common/Surface';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type JSX } from 'react';

// React page to display the form for adding a new patient, using ListView to render the form fields
export default function AddPatientPage(): JSX.Element {
  const router = useRouter(); // router for navigation

  // state to hold the new patient data
  const [patient, setPatient] = useState<NewPatient>({
    firstName: '',
    lastName: '',
    nhi: '',
    dateOfBirth: '',
    gpNameAndMedicalCentre: '',
    nurse: '',
    roomNumber: '',
    status: 'longTerm',
    address: '',
    funding: '',
    email: '',
    homePhoneNumber: '',
    gender: '',
    primaryLanguage: '',
    maritalStatus: '',
    ethnicity: '',
    allergies: '',
    photoUrl: null,
  });

  // function to update a specific field in the patient state
  function updateField<K extends keyof NewPatient>(
    field: K,
    value: NewPatient[K],
  ): void {
    setPatient((prev) => ({ ...prev, [field]: value }));
  }

  // memoized rows for the ListView, rebuilt only when patient state changes
  const rows = useMemo(
    () => buildAddPatientRows(patient, updateField),
    [patient],
  );

  // helper functions to handle button clicks for saving the patient and uploading a photo
  function handleSavePatient(): void {
    // TODO: backend save patient to database
    console.log(patient);
  }

  function handleUploadPhoto(): void {
    // TODO: backend connect image upload
    console.log('Upload photo clicked');
  }

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
            <Icon name="user-profile" width={35} />
            <span className="translate-y-1 text-3xl font-bold">
              Add New Patient
            </span>
          </div>
        </div>

        {/* patient photo + important patient information */}
        <div className="mx-6 overflow-x-auto">
          <div className="flex min-w-full shrink-0 items-end gap-8">
            {/* patient photo, if no url is provided just show a default gray rectangle */}
            <div
              className="
                relative aspect-3/4 w-52 shrink-0 overflow-hidden rounded-4xl
                bg-rehua-gray
              "
              style={{ boxShadow: 'inset 0 5px 8px rgb(0 0 0 / 0.2)' }}
            >
              {/* placeholder for the patient's profile photo */}
              {patient.photoUrl ? (
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
              )}
            </div>

            {/* buttons: photo upload + save new patient */}
            <div className="flex justify-center gap-6">
              <ContentButton
                text1="Upload"
                text2="Photo"
                iconProps={{ name: 'camera', width: 0.8 }}
                iconPosition="right"
                horizontalPadding={0.5}
                textIconGap={0.3}
                backgroundColor="bg-rehua-jordy"
                className="text-xl"
                onClick={handleUploadPhoto}
              />

              <ContentButton
                text1="Save"
                text2="Patient"
                textAlign="left"
                lineHeight={1.1}
                iconProps={{ name: 'save', width: 0.8 }}
                iconPosition="right"
                verticalPadding={0.2}
                horizontalPadding={0.6}
                textIconGap={0.4}
                backgroundColor="bg-rehua-green"
                className="text-xl"
                onClick={handleSavePatient}
              />
            </div>
          </div>
        </div>

        {/* add patient list */}
        <div className="pt-4 pb-30">
          <ListView rows={rows} insidePadding="px-8" />
        </div>
      </Surface>
    </div>
  );
}
