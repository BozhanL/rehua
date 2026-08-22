import Icon from '@/app/components/common/Icon';
import MiniLabel from '@/app/components/common/MiniLabel';
import type { TableColumn, TableRow } from '@/app/components/common/Table';
import type { ReactNode } from 'react';

interface ExampleRow extends TableRow {
  id: number;
  content: {
    roomNo: ReactNode;
    name: ReactNode;
    dob: ReactNode;
    gender: ReactNode;
    nhi: ReactNode;
    dateAdmitted: ReactNode;
    nurse: ReactNode;
    status: ReactNode;
    funding: ReactNode;
    view: ReactNode;
  };
}

export const rows: ExampleRow[] = [
  {
    id: 1,
    content: {
      roomNo: '101',
      name: 'Jane Doe',
      dob: '02/10/1990',
      gender: 'M',
      nhi: 'ABC1234',
      dateAdmitted: '15/06/2023',
      nurse: 'Noah Brown',
      status: <MiniLabel name="longTerm" />,
      funding: 'ACC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Jane clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 2,
    content: {
      roomNo: '102',
      name: 'Michael Smith',
      dob: '14/07/1985',
      gender: 'M',
      nhi: 'DEF5678',
      dateAdmitted: '21/03/2024',
      nurse: 'Olivia Wilson',
      status: <MiniLabel name="active" />,
      funding: 'CHC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Michael clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 3,
    content: {
      roomNo: '103',
      name: 'Sarah Williams',
      dob: '28/11/1978',
      gender: 'F',
      nhi: 'GHI9012',
      dateAdmitted: '09/01/2025',
      nurse: 'Liam Taylor',
      status: <MiniLabel name="shortTerm" />,
      funding: 'Funded',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Sarah clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 4,
    content: {
      roomNo: '104',
      name: 'Robert Johnson',
      dob: '05/03/1969',
      gender: 'M',
      nhi: 'JKL3456',
      dateAdmitted: '17/08/2022',
      nurse: 'Emma Davis',
      status: <MiniLabel name="disabled" />,
      funding: 'ACC',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Robert clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 5,
    content: {
      roomNo: '105',
      name: 'Emily Thompson',
      dob: '19/05/1992',
      gender: 'F',
      nhi: 'MNO7890',
      dateAdmitted: '12/02/2026',
      nurse: 'Noah Brown',
      status: <MiniLabel name="daycare" />,
      funding: 'YPD',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Emily clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 6,
    content: {
      roomNo: '106',
      name: 'William Anderson',
      dob: '11/09/1956',
      gender: 'M',
      nhi: 'PQR2345',
      dateAdmitted: '03/11/2021',
      nurse: 'Sophie Martin',
      status: <MiniLabel name="longTerm" />,
      funding: '',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('William clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 7,
    content: {
      roomNo: '107',
      name: 'Sophia Martinez',
      dob: '23/01/1988',
      gender: 'F',
      nhi: 'STU6789',
      dateAdmitted: '25/05/2024',
      nurse: 'Oliver Wilson',
      status: <MiniLabel name="active" />,
      funding: 'CHC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Sophia clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 8,
    content: {
      roomNo: '108',
      name: 'James Taylor',
      dob: '07/12/1948',
      gender: 'M',
      nhi: 'VWX0123',
      dateAdmitted: '14/04/2020',
      nurse: 'Charlotte Moore',
      status: <MiniLabel name="discharged" />,
      funding: 'ACC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('James clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 9,
    content: {
      roomNo: '109',
      name: 'Olivia Harris',
      dob: '16/06/1995',
      gender: 'F',
      nhi: 'YZA4567',
      dateAdmitted: '08/09/2025',
      nurse: 'Noah Brown',
      status: <MiniLabel name="shortTerm" />,
      funding: 'Funded',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Olivia clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 10,
    content: {
      roomNo: '110',
      name: 'Daniel Clark',
      dob: '30/04/1972',
      gender: 'M',
      nhi: 'BCD8901',
      dateAdmitted: '19/07/2023',
      nurse: 'Amelia Taylor',
      status: <MiniLabel name="deceased" />,
      funding: '',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Daniel clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 11,
    content: {
      roomNo: '111',
      name: 'Charlotte Lewis',
      dob: '09/02/1981',
      gender: 'F',
      nhi: 'EFG2345',
      dateAdmitted: '11/10/2024',
      nurse: 'Liam Taylor',
      status: <MiniLabel name="active" />,
      funding: 'ACC',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Charlotte clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 12,
    content: {
      roomNo: '112',
      name: 'George Walker',
      dob: '17/08/1963',
      gender: 'M',
      nhi: 'HIJ6789',
      dateAdmitted: '06/06/2022',
      nurse: 'Emma Davis',
      status: <MiniLabel name="longTerm" />,
      funding: 'YPD',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('George clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 13,
    content: {
      roomNo: '113',
      name: 'Amelia Hall',
      dob: '25/10/1998',
      gender: 'F',
      nhi: 'KLM0123',
      dateAdmitted: '22/01/2026',
      nurse: 'Noah Brown',
      status: <MiniLabel name="daycare" />,
      funding: 'Funded',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Amelia clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 14,
    content: {
      roomNo: '114',
      name: 'Thomas Allen',
      dob: '03/05/1959',
      gender: 'M',
      nhi: 'NOP4567',
      dateAdmitted: '28/02/2023',
      nurse: 'Sophie Martin',
      status: <MiniLabel name="disabled" />,
      funding: 'CHC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Thomas clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 15,
    content: {
      roomNo: '115',
      name: 'Grace Young',
      dob: '12/12/1987',
      gender: 'F',
      nhi: 'QRS8901',
      dateAdmitted: '16/09/2025',
      nurse: 'Oliver Wilson',
      status: <MiniLabel name="active" />,
      funding: 'ACC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Grace clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 16,
    content: {
      roomNo: '116',
      name: 'Henry King',
      dob: '21/06/1945',
      gender: 'M',
      nhi: 'TUV2345',
      dateAdmitted: '07/03/2021',
      nurse: 'Charlotte Moore',
      status: <MiniLabel name="longTerm" />,
      funding: 'ACC',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Henry clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 17,
    content: {
      roomNo: '117',
      name: 'Ella Wright',
      dob: '08/04/1993',
      gender: 'F',
      nhi: 'WXY6789',
      dateAdmitted: '13/05/2026',
      nurse: 'Amelia Taylor',
      status: <MiniLabel name="shortTerm" />,
      funding: 'YPD',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Ella clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 18,
    content: {
      roomNo: '118',
      name: 'Samuel Green',
      dob: '15/01/1975',
      gender: 'M',
      nhi: 'ZAB0123',
      dateAdmitted: '20/11/2024',
      nurse: 'Liam Taylor',
      status: <MiniLabel name="discharged" />,
      funding: '',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Samuel clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 19,
    content: {
      roomNo: '119',
      name: 'Lucy Baker',
      dob: '27/09/2000',
      gender: 'F',
      nhi: 'CDE4567',
      dateAdmitted: '04/08/2026',
      nurse: 'Emma Davis',
      status: <MiniLabel name="active" />,
      funding: 'Funded',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Lucy clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 20,
    content: {
      roomNo: '120',
      name: 'David Adams',
      dob: '06/11/1967',
      gender: 'M',
      nhi: 'FGH8901',
      dateAdmitted: '18/12/2022',
      nurse: 'Noah Brown',
      status: <MiniLabel name="deceased" />,
      funding: 'CHC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('David clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 21,
    content: {
      roomNo: '121',
      name: 'Isabella Nelson',
      dob: '18/03/1989',
      gender: 'F',
      nhi: 'IJK2345',
      dateAdmitted: '27/06/2025',
      nurse: 'Sophie Martin',
      status: <MiniLabel name="daycare" />,
      funding: 'ACC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Isabella clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 22,
    content: {
      roomNo: '122',
      name: 'Jack Mitchell',
      dob: '22/07/1952',
      gender: 'M',
      nhi: 'KLM6789',
      dateAdmitted: '10/04/2020',
      nurse: 'Oliver Wilson',
      status: <MiniLabel name="disabled" />,
      funding: 'Funded',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Jack clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 23,
    content: {
      roomNo: '123',
      name: 'Mia Carter',
      dob: '31/01/1996',
      gender: 'F',
      nhi: 'NOP0123',
      dateAdmitted: '02/02/2026',
      nurse: 'Charlotte Moore',
      status: <MiniLabel name="active" />,
      funding: 'YPD',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Mia clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 24,
    content: {
      roomNo: '124',
      name: 'Edward Roberts',
      dob: '10/10/1940',
      gender: 'M',
      nhi: 'QRS4567',
      dateAdmitted: '23/05/2019',
      nurse: 'Amelia Taylor',
      status: <MiniLabel name="longTerm" />,
      funding: 'CHC Hospital',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Edward clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
  {
    id: 25,
    content: {
      roomNo: '125',
      name: 'Ava Collins',
      dob: '04/06/1991',
      gender: 'F',
      nhi: 'TUV8901',
      dateAdmitted: '14/07/2026',
      nurse: 'Emma Davis',
      status: <MiniLabel name="upload" />,
      funding: '',
      view: (
        <button
          type="button"
          onClick={() => {
            console.log('Ava clicked');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="access" className="text-rehua-navy" />
        </button>
      ),
    },
  },
];

const columnWidth = 200;

export const columns: TableColumn[] = [
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
