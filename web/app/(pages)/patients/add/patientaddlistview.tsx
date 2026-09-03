import DropdownBar from '@/app/components/common/DropdownBar';
import type { ListRow } from '@/app/components/common/ListView';
import {
  presetLabels,
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import type { ChangeEvent } from 'react';

// interface for form data used to create a new patient
export interface NewPatient {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO string
  address: string;
  photoUrl: string | null;
  nhi: string;
  // dateAdmitted: string; // ISO string, not included in the form
  gpNameAndMedicalCentre: string;
  nurse: string; // fullname of nurse
  roomNumber: string; // string in case we have room numbers like "101A" or "B12"
  status: MiniPresetLabel;
  timeOfDeath: string | null; // ISO string, required if status is "deceased", otherwise null
  funding: string;
  email: string;
  homePhoneNumber: string; // string in case we have + country codes
  gender: string;
  primaryLanguage: string;
  maritalStatus: string;
  ethnicity: string;
  allergies: string; // if empty = frontend will display "None"
}

// function to build the rows for the add patient form
export function buildAddPatientRows(
  patient: NewPatient,
  updateField: <K extends keyof NewPatient>(
    field: K,
    value: NewPatient[K],
  ) => void,
): ListRow[] {
  // define iconProps for required fields (asterisk icon in red)
  const iconProps = {
    name: 'asterisk',
    color: 'text-rehua-red',
  } as const;

  // define the list of patient statuses for the dropdown, using preset labels
  const newPatientStatuses = [
    presetLabels.longTerm,
    presetLabels.shortTerm,
    presetLabels.daycare,
    presetLabels.palliative,
  ];

  function statusToText(status: MiniPresetLabel): string {
    return presetLabels[status].text;
  }

  function textToStatus(text: string): MiniPresetLabel | undefined {
    return (
      Object.entries(presetLabels) as [MiniPresetLabel, { text: string }][]
    ).find(([, label]) => label.text === text)?.[0];
  }

  return [
    {
      heading: 'First Name',
      content: (
        <SingleLineInput
          value={patient.firstName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('firstName', event.target.value);
          }}
          placeholder="Enter first name"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Last Name',
      content: (
        <SingleLineInput
          value={patient.lastName}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('lastName', event.target.value);
          }}
          placeholder="Enter last name"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Date of Birth',
      content: (
        <SingleLineInput
          type="date"
          value={patient.dateOfBirth}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('dateOfBirth', event.target.value);
          }}
          placeholder="Enter date of birth"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Address',
      content: (
        <SingleLineInput
          value={patient.address}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('address', event.target.value);
          }}
          placeholder="Enter address"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'NHI',
      content: (
        <SingleLineInput
          value={patient.nhi}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('nhi', event.target.value);
          }}
          placeholder="Enter NHI"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'GP Name & Medical Centre',
      content: (
        <SingleLineInput
          value={patient.gpNameAndMedicalCentre}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('gpNameAndMedicalCentre', event.target.value);
          }}
          placeholder="Enter GP name and medical centre"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Nurse',
      content: (
        <DropdownBar
          options={['Nurse 1', 'Nurse 2', 'Nurse 3']} // TODO: backend replace with all nurses in the system
          selectedValues={[patient.nurse]}
          defaultText="Select designated nurse name"
          onChange={(selectedNurse) => {
            updateField('nurse', selectedNurse[0] ?? '');
          }}
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Room Number',
      content: (
        <SingleLineInput
          value={patient.roomNumber}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('roomNumber', event.target.value);
          }}
          placeholder="Enter room number"
        />
      ),
    },
    {
      heading: 'Status',
      content: (
        <DropdownBar
          options={newPatientStatuses.map((label) => label.text)}
          selectedValues={[statusToText(patient.status)]}
          defaultText="Select patient status"
          onChange={(selectedStatus) => {
            if (selectedStatus[0]) {
              const status = textToStatus(selectedStatus[0]);
              if (status) {
                updateField('status', status);
              }
            }
          }}
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Email',
      content: (
        <SingleLineInput
          value={patient.email}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('email', event.target.value);
          }}
          placeholder="Enter email address"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Home Phone Number',
      content: (
        <SingleLineInput
          value={patient.homePhoneNumber}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('homePhoneNumber', event.target.value);
          }}
          placeholder="Enter home phone number"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Gender',
      content: (
        <SingleLineInput
          value={patient.gender}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('gender', event.target.value);
          }}
          placeholder="Enter gender"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Primary Language',
      content: (
        <SingleLineInput
          value={patient.primaryLanguage}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('primaryLanguage', event.target.value);
          }}
          placeholder="Enter primary language"
        />
      ),
    },
    {
      heading: 'Marital Status',
      content: (
        <SingleLineInput
          value={patient.maritalStatus}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('maritalStatus', event.target.value);
          }}
          placeholder="Enter marital status"
        />
      ),
    },
    {
      heading: 'Ethnicity',
      content: (
        <SingleLineInput
          value={patient.ethnicity}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('ethnicity', event.target.value);
          }}
          placeholder="Enter ethnicity"
        />
      ),
      iconProps: iconProps,
    },
    {
      heading: 'Allergies',
      content: (
        <SingleLineInput
          value={patient.allergies}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField('allergies', event.target.value);
          }}
          placeholder="Enter allergies"
        />
      ),
      iconProps: iconProps,
    },
  ];
}
