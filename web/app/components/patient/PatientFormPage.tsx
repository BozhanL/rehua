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

// interface to define the props for the PatientFormPage component
interface PatientFormPageProps {
  title: string;
  titleIcon: 'user-profile' | 'pencil-note';
  backToPatients?: boolean; // if true, the back button will navigate to the patients dashboard
  patientInfo: PatientListInformation;
  onSave: (patient: PatientListInformation) => void;
}

// React page to display the form for adding/editting a new patient, using ListView to render the form fields
export default function PatientFormPage({
  title,
  titleIcon,
  backToPatients = false,
  patientInfo,
  onSave,
}: Readonly<PatientFormPageProps>): JSX.Element {
  const router = useRouter(); // router for navigation

  // state to hold the new patient data + the visibility of the validation and leave page popups
  const [patient, setPatient] = useState(patientInfo);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showLeavePagePopup, setShowLeavePagePopup] = useState(false);
  const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

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
    // TODO: backend be aware of user group being used here (temporary solution until backend is implemented)
    if (
      group === 'admin' &&
      patient.status === 'deceased' &&
      !patient.timeOfDeath
    ) {
      setShowValidationPopup(true);
      return;
    }

    // TODO: backend implement logic where if an error comes back it is handled here
    // setShowSaveErrorPopup(true) should be called if the save fails
    // call the onSave prop function to save the patient data and show the success popup
    onSave(patient);
    setShowSaveSuccessPopup(true);
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
              setShowLeavePagePopup(true);
            }}
            style={{ cursor: 'pointer' }}
          >
            <Icon name="circle-arrow" width={50} className="text-rehua-navy" />
          </button>

          <div className="flex gap-3">
            <Icon
              name={titleIcon}
              width={titleIcon === 'pencil-note' ? 40 : 35}
            />
            <span className="translate-y-1 text-3xl font-bold">{title}</span>
          </div>
        </div>

        {/* patient photo */}
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

        {/* patient form */}
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

        {/* go back confirmation popup */}
        <PopUp
          isAlertPopup={true}
          text1={'Are you sure you\nwant to leave this page?'}
          text2={<u>UNSAVED CHANGES WILL BE LOST</u>}
          text2ClassName={'text-rehua-ruby'}
          button1Props={{
            text1: 'STAY',
            iconProps: { name: 'circle-arrow', rotation: -90 },
            backgroundColor: 'bg-rehua-green',
            horizontalPadding: 0.5,
            onClick: () => {
              setShowLeavePagePopup(false);
            },
          }}
          button2Props={{
            text1: 'LEAVE',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-red',
            horizontalPadding: 0.4,
            onClick: () => {
              setShowLeavePagePopup(false);
              // navigate back to the patients dashboard or previous page
              if (backToPatients) {
                router.push('/patients');
              } else {
                router.back();
              }
            },
          }}
          defaultButtonHeight={65}
          modalProps={{ open: showLeavePagePopup }}
        />

        {/* popup for successful save */}
        <PopUp
          text1={'Patient information saved successfully.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowSaveSuccessPopup(false);
            },
          }}
          modalProps={{
            open: showSaveSuccessPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />

        {/* popup for unsuccessful save */}
        <PopUp
          isAlertPopup={true}
          text1={'Failed to save patient information.\nPlease try again.'}
          button1Props={{
            text1: 'OK',
            iconProps: { name: 'circle-arrow' },
            backgroundColor: 'bg-rehua-green',
            onClick: () => {
              setShowSaveErrorPopup(false);
            },
          }}
          modalProps={{
            open: showSaveErrorPopup,
            surfaceProps: { style: { height: 550 } },
          }}
        />
      </Surface>
    </div>
  );
}
