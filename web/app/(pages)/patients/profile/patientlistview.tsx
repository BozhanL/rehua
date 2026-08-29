import type { ListRow } from '@/app/components/common/ListView';
import MiniLabel, {
  type MiniPresetLabel,
} from '@/app/components/common/MiniLabel';
import dayjs from '@/app/utils/dayjs';

// TODO: backend replace this info with currently logged in user's group (nurse or admin)
const group: 'nurse' | 'admin' = 'admin';

// interface to enforce and define the structure of the patient information
export interface PatientListInformation {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO string
  address: string;
  photoUrl: string | null;
  nhi: string;
  dateAdmitted: string; // ISO string
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

// TODO: backend - replace this with fetched data from the backend
export const patient: PatientListInformation = {
  firstName: 'Tama',
  lastName: 'Manaaki',
  dateOfBirth: '1990-10-02T00:00:00.000Z',
  address: '247 Whitaker Street, Some City 3320',
  photoUrl: null,
  nhi: 'ABC6789',
  dateAdmitted: '2024-01-01T00:00:00.000Z',
  gpNameAndMedicalCentre: 'Dr John Smith, Some Medical Centre',
  nurse: 'Jane Doe',
  roomNumber: '101',
  status: 'longTerm',
  timeOfDeath: null,
  funding: 'Funded',
  email: 'tama.manaaki@example.com',
  homePhoneNumber: '0211234567',
  gender: 'Male',
  primaryLanguage: 'English',
  maritalStatus: 'Single',
  ethnicity: 'Māori',
  allergies: '',
};

// defined rows for the ListView component to display patient information
export const PatientListRows: ListRow[] = [
  { heading: 'NHI', content: patient.nhi },
  {
    heading: 'Date Admitted',
    content: dayjs(patient.dateAdmitted).tz().format('DD/MM/YYYY'),
  },
  {
    heading: 'GP Name & Medical Centre',
    content: patient.gpNameAndMedicalCentre,
  },
  { heading: 'Nurse', content: patient.nurse },
  { heading: 'Room Number', content: patient.roomNumber },
  {
    heading: 'Status',
    content: <MiniLabel name={patient.status} height={34} />,
  },
  // TODO: backend remove this lint rule disabling once the backend is implemented
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  ...(group === 'admin' && patient.status === 'deceased'
    ? [
        {
          heading: 'Time of Death',
          content: patient.timeOfDeath
            ? dayjs(patient.timeOfDeath).tz().format('DD/MM/YYYY, hh:mm A')
            : '',
        },
      ]
    : []),
  { heading: 'Address', content: patient.address },
  { heading: 'Funding', content: patient.funding },
  { heading: 'Email', content: patient.email },
  { heading: 'Home Phone Number', content: patient.homePhoneNumber },
  { heading: 'Gender', content: patient.gender },
  { heading: 'Primary Language', content: patient.primaryLanguage },
  { heading: 'Marital Status', content: patient.maritalStatus },
  { heading: 'Ethnicity', content: patient.ethnicity },
  {
    heading: 'Allergies',
    content: patient.allergies || 'None',
    redRow: true,
    iconProps: { name: 'info-square' },
  },
];
