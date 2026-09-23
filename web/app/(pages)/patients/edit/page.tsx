'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import ListView from '@/app/components/common/ListView';
import PopUp from '@/app/components/common/PopUp';
import Surface from '@/app/components/common/Surface';
import {
  buildPatientFormRows,
  group,
} from '@/app/components/patient/PatientForm';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

// TODO: backend connect image upload
function handleUploadPhoto(): void {
  console.log('Upload photo clicked');
}

// React page to display the form for editing an existing patient, using ListView to render the form fields
export default function EditPatientPage(): JSX.Element {
  const router = useRouter(); // router for navigation

  // state to hold the new patient data
  const [patient, setPatient] = useState<PatientListInformation>({
    firstName: 'Tama',
    lastName: 'Manaaki',
    dateOfBirth: '1990-10-02',
    address: '247 Whitaker Street, Some City 3320',
    nhi: 'ABC6789',
    gpNameAndMedicalCentre: 'Dr John Smith, Some Medical Centre',
    nurse: 'Nurse 1',
    roomNumber: '101',
    status: 'longTerm',
    funding: 'Funded',
    email: 'tama.manaaki@example.com',
    homePhoneNumber: '0211234567',
    gender: 'Male',
    primaryLanguage: 'English',
    maritalStatus: 'Single',
    ethnicity: 'Māori',
    allergies: '',
    photoUrl: null,
    dateAdmitted: '1990-10-02',
    timeOfDeath: null,
  });

  // state to control the visibility of the validation popup
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  // rows for the ListView component
  const rows = buildPatientFormRows(patient, updateField);

  // function to update a specific field in the patient state
  function updateField<K extends keyof PatientListInformation>(
    field: K,
    value: PatientListInformation[K],
  ): void {
    setPatient((prev) => ({ ...prev, [field]: value }));
  }

  // helper functions to handle button clicks for saving the patient and uploading a photo
  function handleSavePatient(): void {
    const mandatoryFields = [
      patient.firstName,
      patient.lastName,
      patient.dateOfBirth,
      patient.address,
      patient.nhi,
      patient.gpNameAndMedicalCentre,
      patient.nurse,
      patient.status,
      patient.email,
      patient.homePhoneNumber,
      patient.gender,
      patient.ethnicity,
      patient.allergies,
    ];

    const hasMissingFields = mandatoryFields.some((field) => !field.trim());

    if (hasMissingFields) {
      setShowValidationPopup(true);
      return;
    }

    // additional validation for deceased patients when admin is editting the form
    if (
      group === 'admin' &&
      patient.status === 'deceased' &&
      !patient.timeOfDeath
    ) {
      setShowValidationPopup(true);
      return;
    }

    // TODO: backend - POST patient to backend here
    // patientDobIso = dayjs(patient.dateOfBirth).toISOString();
    console.log(patient);
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
              router.back(); // navigate back to previous page
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="circle-arrow" width={50} className="text-rehua-navy" />
          </button>

          <div className="flex gap-3">
            <Icon name="pencil-note" width={40} />
            <span className="translate-y-1 text-3xl font-bold">
              Edit Patient Information
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

        {/* edit patient list */}
        <div className="pt-4 pb-30">
          <ListView rows={rows} insidePadding="px-8" />
        </div>

        {/* mandatory fields validation popup */}
        <PopUp
          text1={'Please ensure all the mandatory\nfields have been filled in.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowValidationPopup(false);
            },
          }}
          modalProps={{
            open: showValidationPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />
      </Surface>
    </div>
  );
}
