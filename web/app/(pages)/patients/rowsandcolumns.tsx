import Icon from '@/app/components/common/Icon';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import dayjs from '@/app/utils/dayjs';
import { useRouter } from 'next/navigation';
import type { JSX, ReactNode } from 'react';

// interface for a patient
export interface Patient {
  id: string; // unique identifier for the patient
  roomNo: string;
  firstName: string;
  lastName: string;
  dob: string; // ISO string
  gender: string;
  nhi: string;
  dateAdmitted: string; // ISO string
  nurse: string;
  status: MiniPresetLabel;
  funding: string;
}

// interface for a patient row in the table
interface PatientRow extends TableRow {
  id: number; // unique identifier for the row
  content: {
    roomNo: string;
    name: string;
    dob: string;
    gender: string;
    nhi: string;
    dateAdmitted: string;
    nurse: string;
    status: ReactNode;
    funding: string;
    view: ReactNode;
  };
}

// general width for columns
const columnWidth = 200;

// column definition for the patient table
export const patientColumns: TableColumn[] = [
  {
    rowKey: 'roomNo',
    header: 'Room #',
  },
  {
    rowKey: 'name',
    header: 'Name',
    width: columnWidth,
  },
  {
    rowKey: 'dob',
    header: 'DOB',
    width: 170,
  },
  {
    rowKey: 'gender',
    header: 'Gender',
  },
  {
    rowKey: 'nhi',
    header: 'NHI',
    width: 170,
  },
  {
    rowKey: 'dateAdmitted',
    header: 'Date Admitted',
    width: columnWidth,
  },
  {
    rowKey: 'nurse',
    header: 'Nurse',
    width: columnWidth,
  },
  {
    rowKey: 'status',
    header: 'Status',
    width: columnWidth,
  },
  {
    rowKey: 'funding',
    header: 'Funding',
    width: columnWidth,
  },
  {
    rowKey: 'view',
    header: 'View',
    width: columnWidth,
  },
];

// TODO: backend implement the PatientViewButton below within the "View" column of the patient table,
// the button already routes to /patients/profile?id=<patientId> page, patientId has to be passed in
// -- for better clarity, feel free to rename this file from "rowsandcolumns.tsx" if it suits
function PatientViewButton({
  patientId,
}: Readonly<{ patientId: string }>): JSX.Element {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        router.push(`/patients/profile?id=${patientId}`);
      }}
      style={{ cursor: 'pointer' }}
    >
      <Icon
        name="access"
        width={30}
        className="translate-y-1 text-rehua-navy"
      />
    </button>
  );
}

// function to create a patient row from a patient object that will be rendered within the table
function createPatientRow(patient: Patient, rowIndex: number): PatientRow {
  return {
    id: rowIndex,
    content: {
      roomNo: patient.roomNo ? patient.roomNo : '-',
      name: `${patient.firstName} ${patient.lastName}`,
      dob: dayjs(patient.dob).tz().format('DD/MM/YYYY'),
      gender:
        patient.gender === 'Male' || patient.gender === 'Female'
          ? patient.gender.charAt(0).toUpperCase()
          : 'O', // O for Other, TODO: backend let me know if gender is a dropdown or free text, change this logic accordingly
      nhi: patient.nhi,
      dateAdmitted: dayjs(patient.dateAdmitted).tz().format('DD/MM/YYYY'),
      nurse: patient.nurse,
      status: <MiniLabel name={patient.status} />,
      funding: patient.funding,
      view: <PatientViewButton patientId={patient.id} />,
    },
  };
}

// sample patient data, what is expected from backend - TODO: backend replace this with actual data
export const patients: Patient[] = [
  {
    id: '1',
    roomNo: '101',
    firstName: 'Jane',
    lastName: 'Doe',
    dob: '1990-10-02T00:00:00.000Z',
    gender: 'Female',
    nhi: 'ABC1234',
    dateAdmitted: '1990-10-02T00:00:00.000Z',
    nurse: 'Noah Brown',
    status: 'longTerm',
    funding: 'ACC Hospital',
  },
  {
    id: '2',
    roomNo: '',
    firstName: 'John',
    lastName: 'Smith',
    dob: '1985-04-15T00:00:00.000Z',
    gender: 'Male',
    nhi: 'XYZ5678',
    dateAdmitted: '2023-06-20T00:00:00.000Z',
    nurse: 'Jane Brown',
    status: 'active',
    funding: 'Private',
  },
];

// create patient rows from the sample patient data - TODO: backend to alter this if needed
export const patientRows: PatientRow[] = patients.map((patient, rowIndex) =>
  createPatientRow(patient, rowIndex),
);
