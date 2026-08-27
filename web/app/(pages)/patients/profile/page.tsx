'use client';

import { useSearchParams } from 'next/navigation';
import type { JSX } from 'react';

// temporary page to display patient profile based on patientId from the URL
// TODO: next focus for frontend is this page
export default function PatientProfilePage(): JSX.Element {
  const searchParams = useSearchParams();
  const patientId = searchParams.get('id');

  return (
    <main>
      <h1>Patient Profile</h1>
      <h2>Patient ID: {patientId}</h2>
    </main>
  );
}
