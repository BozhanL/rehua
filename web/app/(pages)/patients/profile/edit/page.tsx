'use client';
import PatientFormPage from '@/app/components/patient/PatientFormPage';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

// React page to display the form for editing an existing patient, using PatientFormPage to render the page
export default function EditPatientPage(): JSX.Element {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') ?? '';

  // TODO: backend GET patient here api request
  const patient: PatientListInformation = {
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
    photoUrl: undefined,
    dateAdmitted: '1990-10-02',
    timeOfDeath: undefined,
  };

  // TODO: backend patch patient api function

  return (
    <PatientFormPage
      title="Edit Patient Information"
      titleIcon="pencil-note"
      patientInfo={patient}
      onSave={(patient) => {
        // TODO: backend PATCH/PUT patient here
        console.log(patient, patientId);
      }}
    />
  );
}
