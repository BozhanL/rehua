'use client';
import PatientFormPage from '@/app/components/patient/PatientFormPage';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import dayjs from '@/app/utils/dayjs';
import type { JSX } from 'react';

// React page to display the form for adding a new patient, using PatientFormPage to render the page
export default function AddPatientPage(): JSX.Element {
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
    photoUrl: null,
    dateAdmitted: dayjs().tz().toISOString(), // TODO: backend take this away if desirable
    timeOfDeath: null,
  };

  return (
    <PatientFormPage
      title="Add New Patient"
      titleIcon="user-profile"
      backToPatients={true}
      patientInfo={newPatient}
      onSave={(patient) => {
        // TODO: backend POST new patient here
        console.log(patient);
      }}
    />
  );
}
