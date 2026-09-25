'use client';
import PatientFormPage from '@/app/components/patient/PatientFormPage';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import type { JSX } from 'react';

// React page to display the form for editing an existing patient, using PatientFormPage to render the page
export default function EditPatientPage(): JSX.Element {
  // TODO: backend GET patient here
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
    photoUrl: null,
    dateAdmitted: '1990-10-02',
    timeOfDeath: null,
  };

  return (
    <PatientFormPage
      title="Edit Patient Information"
      titleIcon="pencil-note"
      patientInfo={patient}
      onSave={(patient) => {
        // TODO: backend PATCH/PUT patient here
        console.log(patient);
      }}
    />
  );
}
