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

// TODO:
// Remove and replace with api call at point of use once backend implemented
const historyEntries: HistoryEntry[] = [
  {
    id: 1,
    userId: 'u_8f21c4',
    userName: 'Amelia Ross',
    date: dayjs('2026-08-27T16:42:00'),
    details: [
      'Updated the pricing table in section 4, revised Tier 2 rate from $180 to $195.',
      'Added a footnote clarifying that rates exclude GST.',
    ],
  },
  {
    id: 2,
    userId: 'u_3a9d10',
    userName: 'Daniel Okafor',
    date: dayjs('2026-08-27T11:05:00'),
    details: ['Resolved 3 open comments on the liability clause.'],
  },
  {
    id: 3,
    userId: 'u_8f21c4',
    userName: 'Amelia Ross',
    date: dayjs('2026-08-26T09:18:00'),
    details: ['Added appendix B with vendor compliance certificates.'],
  },
  {
    id: 4,
    userId: 'u_5c72be',
    userName: 'Priya Nair',
    date: dayjs('2026-08-25T15:33:00'),
    details: [
      'Accepted all tracked changes from the legal review.',
      'Removed 2 resolved comment threads from section 6.',
    ],
  },
  {
    id: 5,
    userId: 'u_3a9d10',
    userName: 'Daniel Okafor',
    date: dayjs('2026-08-25T10:47:00'),
    details: ['Reworded the termination notice period from 30 to 60 days.'],
  },
  {
    id: 6,
    userId: 'u_1b40ff',
    userName: 'Marcus Lee',
    date: dayjs('2026-08-24T14:12:00'),
    details: ['Replaced the outdated company logo on the cover page.'],
  },
  {
    id: 7,
    userId: 'u_5c72be',
    userName: 'Priya Nair',
    date: dayjs('2026-08-22T17:56:00'),
    details: ['Deleted the deprecated “Legacy Support” subsection.'],
  },
  {
    id: 8,
    userId: 'u_1b40ff',
    userName: 'Marcus Lee',
    date: dayjs('2026-08-21T08:29:00'),
    details: [
      'Shared the document with the finance team (view-only).',
      'Set the link to expire on 30 Sep 2026.',
    ],
  },
  {
    id: 9,
    userId: 'u_8f21c4',
    userName: 'Amelia Ross',
    date: dayjs('2026-08-20T13:04:00'),
    details: ['Restored version from 18 Aug after an accidental overwrite.'],
  },
  {
    id: 10,
    userId: 'u_8f21c4',
    userName: 'Amelia Ross',
    date: dayjs('2026-08-18T10:00:00'),
    details: ['Created the document from the “Service Agreement” template.'],
  },
];

export default historyEntries;
