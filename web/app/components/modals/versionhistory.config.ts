import dayjs, { type Dayjs } from 'dayjs';

//TODO:
// Replace with SDK once backend implemented
export interface HistoryEntry {
  id: number;
  userId: string;
  userName: string;
  date: Dayjs;
  details: string[];
}
// replace with sdk
export interface LogEntry {
  id: number;
  userId: string;
  userName: string;
  date: Dayjs;
  details: string[];
}

// TODO:
// Remove and replace with api call at point of use once backend implemented
export const historyEntries: HistoryEntry[] = [
  {
    id: 1,
    userId: 'u_8f21c4',
    userName: 'Noah Brown',
    date: dayjs('2026-04-21T11:56:00'),
    details: [
      'Tickbox "Ibuprofen 5mg" checked',
      'Added to running notes "Patient has issues swallowing medication, needed assistance"',
    ],
  },
  {
    id: 2,
    userId: 'u_3a9d10',
    userName: 'Emma Davies',
    date: dayjs('2026-04-20T17:12:00'),
    details: [
      'Added to running notes "Patient medication to be re-checked with the GP"',
    ],
  },
  {
    id: 3,
    userId: 'u_3a9d10',
    userName: 'Emma Davies',
    date: dayjs('2026-04-18T12:01:00'),
    details: ['Tickbox "Ibuprofen 5mg" checked'],
  },
  {
    id: 4,
    userId: 'u_5c72be',
    userName: 'Sarah Miller',
    date: dayjs('2026-04-17T09:30:00'),
    details: [
      'Tickbox "Paracetamol 500mg" unchecked',
      'Added to running notes "Patient reported nausea, withheld dose pending review"',
    ],
  },
  {
    id: 5,
    userId: 'u_1b40ff',
    userName: 'William Smith',
    date: dayjs('2026-04-16T14:45:00'),
    details: [
      'Updated question 3 response from "Satisfied" to "Very Satisfied"',
    ],
  },
  {
    id: 6,
    userId: 'u_8f21c4',
    userName: 'Noah Brown',
    date: dayjs('2026-04-15T08:20:00'),
    details: [
      'Tickbox "Paracetamol 500mg" checked',
      'Signed off section 2 of the questionnaire',
    ],
  },
  {
    id: 7,
    userId: 'u_5c72be',
    userName: 'Sarah Miller',
    date: dayjs('2026-04-14T16:05:00'),
    details: [
      'Added to running notes "Family requested a copy of this document"',
    ],
  },
  {
    id: 8,
    userId: 'u_1b40ff',
    userName: 'William Smith',
    date: dayjs('2026-04-12T10:52:00'),
    details: ['Created "Client Satisfaction Questionnaire" from template'],
  },
];

// TODO:
// Remove and replace with api call at point of use once backend implemented
export const logEntries: HistoryEntry[] = [
  {
    id: 1,
    userId: 'u_8f21c4',
    userName: 'Noah Brown',
    date: dayjs('2026-04-21T11:56:00'),
    details: ['Logged in from 192.168.2.10'],
  },
  {
    id: 2,
    userId: 'u_3a9d10',
    userName: 'Emma Davies',
    date: dayjs('2026-04-20T17:12:00'),
    details: ['Logged out from 192.168.2.11'],
  },
  {
    id: 3,
    userId: 'u_3a9d10',
    userName: 'Emma Davies',
    date: dayjs('2026-04-18T12:01:00'),
    details: ['Edited patient "Tama Manaaki", document "Pain Assessment"'],
  },
  {
    id: 4,
    userId: 'u_8f21c4',
    userName: 'Noah Brown',
    date: dayjs('2026-04-17T17:01:00'),
    details: ['Logged in from 192.168.2.10'],
  },
  {
    id: 5,
    userId: 'u_5c72be',
    userName: 'Sarah Miller',
    date: dayjs('2026-04-17T09:24:00'),
    details: [
      'Updated patient "William Smith" status from "Long term" to "Discharged"',
      'Added nursing note to file',
    ],
  },
  {
    id: 6,
    userId: 'u_1b40ff',
    userName: 'William Smith',
    date: dayjs('2026-04-15T14:47:00'),
    details: ['Logged in from 192.168.2.14'],
  },
  {
    id: 7,
    userId: 'u_1b40ff',
    userName: 'William Smith',
    date: dayjs('2026-04-15T14:12:00'),
    details: ['Edited patient "Ana Ngata", document "Admission Form"'],
  },
  {
    id: 8,
    userId: 'u_5c72be',
    userName: 'Sarah Miller',
    date: dayjs('2026-04-14T08:56:00'),
    details: ['Logged out from 192.168.2.12'],
  },
  {
    id: 9,
    userId: 'u_8f21c4',
    userName: 'Noah Brown',
    date: dayjs('2026-04-13T16:30:00'),
    details: [
      'Updated funding source for patient "Tama Manaaki" from "ACC Hospital" to "CHG Hospital"',
    ],
  },
  {
    id: 10,
    userId: 'u_3a9d10',
    userName: 'Emma Davies',
    date: dayjs('2026-04-10T10:00:00'),
    details: ['Created patient record "Ana Ngata"'],
  },
];
