import DropdownBar from '@/app/components/common/DropdownBar';
import type { ListRow } from '@/app/components/common/ListView';
import {
  presetLabels,
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import SingleLineInput from '@/app/components/common/SingleLineInput';
import type { PatientListInformation } from '@/app/components/patient/PatientProfileList';
import dayjs from '@/app/utils/dayjs';
import type { ChangeEvent } from 'react';

// TODO: backend - replace this with currently logged in user's group
export const group: 'nurse' | 'admin' = 'admin';

// TODO: backend - fetch all nurses in the system
function getNurses(): string[] {
  return ['Nurse 1', 'Nurse 2', 'Nurse 3'];
}

// helper functions to convert between status and text for the dropdown
function statusToText(status: MiniPresetLabel): string {
  return presetLabels[status].text;
}

function textToStatus(text: string): MiniPresetLabel | undefined {
  const keys = Object.keys(presetLabels) as MiniPresetLabel[];
  return keys.find((key) => presetLabels[key].text === text);
}

// define the list of patient statuses for the dropdown, using preset labels
export const patientStatuses = [
  presetLabels.longTerm,
  presetLabels.shortTerm,
  presetLabels.daycare,
  presetLabels.palliative,
  // TODO: delete this line when backend is implemented
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  ...(group === 'admin' ? [presetLabels.deceased] : []),
];

// function to build the rows for the patient form
export function buildPatientFormRows(
  patient: PatientListInformation,
  updateField: <K extends keyof PatientListInformation>(
    field: K,
    value: PatientListInformation[K],
  ) => void,
): ListRow[] {
  // define iconProps for required fields (asterisk icon in red)
  const iconProps = {
    name: 'asterisk',
    width: 10,
    className: 'text-rehua-ruby',
  } as const;

  // font size of all input fields
  const inputFontSize = 22;

  return [
    {
      heading: 'First Name',
      content: (
        <SingleLineInput
          value={patient.firstName}
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ width: 500, fontSize: inputFontSize }}
          value={
            patient.dateOfBirth
              ? dayjs(patient.dateOfBirth).format('YYYY-MM-DD')
              : ''
          }
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            updateField(
              'dateOfBirth',
              event.target.value ? dayjs(event.target.value).toISOString() : '',
            );
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          options={getNurses()}
          selectedValues={[patient.nurse ? patient.nurse : 'Nurse 1']}
          // TODO: backend uncomment the line below when finished, delete line above, dont need the fake 'Nurse 1' fallback
          // selectedValues={[patient.nurse]}
          search={true}
          size={19}
          width={550}
          lengthOfDropdown={350}
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
          style={{ fontSize: inputFontSize }}
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
          options={patientStatuses.map((label) => label.text)}
          selectedValues={[statusToText(patient.status)]}
          size={19}
          width={550}
          defaultText="Select patient status"
          onChange={(selectedStatus) => {
            if (selectedStatus[0]) {
              const status = textToStatus(selectedStatus[0]);
              if (status) {
                updateField('status', status);
                // TODO: backend, just a note, time of death should be cleared when status is changed from deceased
                if (status !== 'deceased') {
                  updateField('timeOfDeath', null);
                }
              }
            }
          }}
        />
      ),
      iconProps: iconProps,
    },
    ...(group === 'admin' && patient.status === 'deceased'
      ? [
          {
            heading: 'Time of Death',
            content: (
              <SingleLineInput
                type="datetime-local"
                style={{ width: 500, fontSize: inputFontSize }}
                value={
                  patient.timeOfDeath
                    ? dayjs(patient.timeOfDeath).format('YYYY-MM-DDTHH:mm')
                    : ''
                }
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  updateField(
                    'timeOfDeath',
                    event.target.value
                      ? dayjs(event.target.value).toISOString()
                      : null,
                  );
                }}
                placeholder="Enter time of death"
              />
            ),
            iconProps: iconProps,
          },
        ]
      : []),
    ...(group === 'admin'
      ? [
          {
            heading: 'Funding',
            content: (
              <SingleLineInput
                value={patient.funding}
                style={{ fontSize: inputFontSize }}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  updateField('funding', event.target.value);
                }}
                placeholder="Enter funding"
              />
            ),
            iconProps: iconProps,
          },
        ]
      : []),
    {
      heading: 'Email',
      content: (
        <SingleLineInput
          value={patient.email}
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
          style={{ fontSize: inputFontSize }}
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
