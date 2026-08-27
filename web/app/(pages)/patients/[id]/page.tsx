'use client';
import { useParams } from 'next/navigation';
import type { JSX } from 'react';

// temporary page to display patient profile based on patientId from the URL
// frontend to be made here
// in next.config.mts the "output: 'export'," line needs to be taken out so dynamic routing can be used for this page
export default function PatientProfilePage(): JSX.Element {
  const params = useParams();
  const patientId = params['id'];

  return (
    <main>
      <h1>Patient Profile</h1>
      <p>Patient ID: {patientId}</p>
    </main>
  );
}
