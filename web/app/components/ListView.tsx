import Icon from './Icon';
import MiniLabel, { type MiniLabelProps } from './MiniLabel';
import type { JSX } from 'react/jsx-runtime';

// generic personal details shared by every summary type
interface PersonalDetails {
  status: MiniLabelProps['name']; // supply name of status label type
  name: string;
  address: string;
  email: string;
  phone: string;
}

// specify which kind of data  either patient or user, both is a superset of base type Personal Details

export interface PatientSummary extends PersonalDetails {
  kind: 'patient';
  nhi: string;
  dob: string;
  admissionDate: string;
  gpName: string;
  funding: string;
  allergies?: string[];
}

export interface UserSummary extends PersonalDetails {
  kind: 'user';
  username: string;
  group: string;
}
type SummaryData = PatientSummary | UserSummary;

// Component props - either Patient or User data - and max width of component
interface ListProps {
  data: SummaryData;
  // max width style string
  maxWidth?: string; // e.g 400px 100% 28rem
}

// type for rowdata
interface RowData {
  heading: string;
  content: JSX.Element | string;
  highlighted?: boolean; // renders heading + content as bold red text with a warning icon
}

const HEADINGS: Record<string, string> = {
  status: 'Status',
  name: 'Name',
  address: 'Address',
  email: 'Email',
  phone: 'Phone',
  nhi: 'NHI',
  dob: 'DOB',
  admissionDate: 'Admission Date',
  gpName: 'GP Name',
  funding: 'Funding',
  allergies: 'Allergies',
  username: 'Username',
  group: 'Group',
};

// fields that need customised rendering rather than being dropped in as plain text
function buildRow(key: string, data: SummaryData): RowData | null {
  const heading = HEADINGS[key] ?? key; // find the string value for the heading

  //special cases
  // use Label for status key
  if (key === 'status') {
    return { heading, content: <MiniLabel name={data.status} /> };
  }
  //
  if (key === 'allergies') {
    const allergies = data.kind === 'patient' ? data.allergies : undefined; // if kind is patient - set allergies , otherwise kind is user - set undefined
    if (!allergies || allergies.length === 0) return null;
    return { heading, content: allergies.join(', '), highlighted: true };
  }

  const value = data[key as keyof SummaryData];

  return { heading, content: value };
}

function ListView({
  data,
  maxWidth = '28rem',
}: Readonly<ListProps>): JSX.Element {
  // rows shared by every summary type, regardless of kind
  // row order follows the order fields were supplied on 'data', so the
  // person constructing the object controls the render order
  const rows: RowData[] = (Object.keys(data) as (keyof SummaryData)[])
    .filter((key): key is Exclude<keyof SummaryData, 'kind'> => key !== 'kind')
    .map((key) => buildRow(key, data))
    .filter((row): row is RowData => row !== null);

  // render all the rows as list items
  return (
    <ul className="overflow-hidden" style={{ maxWidth }}>
      {rows.map((row, index) => (
        <li
          key={row.heading}
          className={`flex gap-x-1 px-4 py-2 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <span
            className={`flex items-center gap-x-1 font-bold ${
              row.highlighted ? 'text-red-600' : 'text-black'
            }`}
          >
            {row.highlighted && <Icon name="alert" className="text-red-600" />}
            {row.heading}:
          </span>
          <span
            className={
              row.highlighted
                ? 'font-bold text-red-600'
                : 'font-normal text-black'
            }
          >
            {row.content}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default ListView;
