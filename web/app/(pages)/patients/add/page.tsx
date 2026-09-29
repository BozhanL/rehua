'use client';
import PopUp from '@/app/components/common/PopUp';
import PatientFormPage from '@/app/components/patient/PatientFormPage';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import useApiUrl from '@/app/hooks/useApiUrl';
import dayjs from '@/app/utils/dayjs';
import { isTesting } from '@/app/utils/env';
import { create } from '@rehua/sdk/functional/patient';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, type JSX } from 'react';

async function createPatient({
  host,
  data,
}: {
  host: string;
  data: create.Body;
}): Promise<create.Output> {
  return create(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    data,
  );
}

// React page to display the form for adding a new patient, using PatientFormPage to render the page
export default function AddPatientPage(): JSX.Element {
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

  const router = useRouter();
  const host = useApiUrl();
  const createPatientMutation = useMutation({
    mutationFn: createPatient,
  });

  // default values for new patients
  const newPatient: PatientListInformation = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    nhi: '',
    gpNameAndMedicalCentre: '',
    nurse: '',
    roomNumber: '',
    status: 'longTerm',
    funding: '',
    email: '',
    homePhoneNumber: '',
    gender: '',
    primaryLanguage: '',
    maritalStatus: '',
    ethnicity: '',
    allergies: '',
    photoUrl: undefined,
    dateAdmitted: dayjs().tz().toISOString(), // TODO: backend take this away if desirable
    timeOfDeath: undefined,
  };

  return (
    <>
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

      <PatientFormPage
        title="Add New Patient"
        titleIcon="user-profile"
        backToPatients={true}
        patientInfo={newPatient}
        onSave={(formData) => {
          const createValues: create.Body = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            address: formData.address,
            nhi: formData.nhi,
            dateAdmitted: formData.dateAdmitted,
            gpNameAndMedicalCentre: formData.gpNameAndMedicalCentre,
            nurse: formData.nurse,
            roomNumber: formData.roomNumber,
            status: formData.status,
            email: formData.email,
            homePhoneNumber: formData.homePhoneNumber,
            gender: formData.gender,
            primaryLanguage: formData.primaryLanguage,
            maritalStatus: formData.maritalStatus,
            ethnicity: formData.ethnicity,
            allergies: formData.allergies,
            photoUrl: formData.photoUrl,
            funding: formData.funding,
            timeOfDeath: formData.timeOfDeath,
          };

          createPatientMutation.mutate(
            { host, data: createValues },
            {
              onError: () => {
                setShowSaveErrorPopup(true);
              },
              onSuccess: (newPatientData) => {
                router.push(`/patients/profile?id=${newPatientData._id}`);
              },
            },
          );
        }}
      />
    </>
  );
}
