'use client';
import PopUp from '@/app/components/common/PopUp';
import PatientFormPage from '@/app/components/patient/PatientFormPage';
import useApiUrl from '@/app/hooks/useApiUrl';
import { isTesting } from '@/app/utils/env';
import { findOne, update } from '@rehua/sdk/functional/patient';
import {
  queryOptions,
  useMutation,
  useQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useState, type JSX } from 'react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useFindOne(id: string) {
  const host = useApiUrl();

  return queryOptions({
    queryKey: [findOne.path(id), host],
    queryFn: async ({ signal }: QueryFunctionContext) =>
      findOne(
        {
          host: host,
          simulate: isTesting,
          options: { signal, credentials: 'include' },
        },
        id,
      ),
  });
}

async function updatePatient({
  host,
  patientId,
  updatedValues,
}: {
  host: string;
  patientId: string;
  updatedValues: update.Body;
}): Promise<update.Output> {
  return update(
    { host, simulate: isTesting, options: { credentials: 'include' } },
    patientId,
    updatedValues,
  );
}

// React page to display the form for editing an existing patient, using PatientFormPage to render the page
export default function EditPatientPage(): JSX.Element {
  const [showSaveErrorPopup, setShowSaveErrorPopup] = useState(false);

  const searchParams = useSearchParams();
  const patientId = searchParams.get('id') ?? '';
  const options = useFindOne(patientId);
  const doc = useQuery(options);
  const patient = doc.data;

  const router = useRouter();
  const host = useApiUrl();
  const updatePatientMutation = useMutation({
    mutationFn: updatePatient,
  });

  if (doc.isError) {
    throw doc.error;
  } else if (!doc.isSuccess) {
    return <h1>Loading...</h1>;
  } else if (!patient) {
    console.log(patient);
    notFound();
  }

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
        title="Edit Patient Information"
        titleIcon="pencil-note"
        patientInfo={patient}
        onSave={(formData) => {
          const updatedValues: update.Body = {
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
            profilePicture: formData.profilePicture,
            funding: formData.funding,
            timeOfDeath: formData.timeOfDeath,
          };

          console.log(patient, patientId);
          updatePatientMutation.mutate(
            { host, patientId, updatedValues },
            {
              onError: () => {
                setShowSaveErrorPopup(true);
              },
              onSuccess: () => {
                router.push(`/patients/profile?id=${patientId}`);
              },
            },
          );
        }}
      />
    </>
  );
}
