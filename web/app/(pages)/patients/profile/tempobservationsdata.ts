import type { Note } from '@/app/components/observations/notes/NoteList';
import dayjs from '@/app/utils/dayjs';
import type { Observation_idstring } from '@rehua/sdk/structures/Observation_idstring';

// TODO: backend delete this file when done with integration

// TODO: backend delete this and replace with patient ID
export const patientId = '123';

// TODO: backend delete this and replace with patient's observations
export const DEMO_OBSERVATIONS: Observation_idstring[] = [
  {
    patientId: patientId,
    _id: 'OBS-001',
    type: 'OXYGEN_RATE',
    dateTime: dayjs().hour(8).minute(15).second(0).millisecond(0).toISOString(),
    measurementValue: 96,
  },
  {
    patientId: patientId,
    _id: 'OBS-011',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(23)
      .minute(59)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 100,
  },
  {
    patientId: patientId,
    _id: 'OBS-002',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(12)
      .minute(30)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 98,
  },
  {
    patientId: patientId,
    _id: 'OBS-003',
    type: 'OXYGEN_RATE',
    dateTime: dayjs()
      .hour(16)
      .minute(45)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 97,
  },
  {
    patientId: patientId,
    _id: 'OBS-004',
    type: 'HEART_RATE',
    dateTime: dayjs().hour(9).minute(0).second(0).millisecond(0).toISOString(),
    measurementValue: 72,
  },
  {
    patientId: patientId,
    _id: 'OBS-005',
    type: 'HEART_RATE',
    dateTime: dayjs()
      .hour(14)
      .minute(20)
      .second(0)
      .millisecond(0)
      .toISOString(),
    measurementValue: 80,
  },
  {
    patientId: patientId,
    _id: 'OBS-006',
    type: 'BOWEL_OUTPUT',
    dateTime: dayjs()
      .hour(10)
      .minute(15)
      .second(0)
      .millisecond(0)
      .toISOString(),
    notes: 'Normal bowel movement',
  },
  {
    patientId: patientId,
    _id: 'OBS-007',
    type: 'URINE_OUTPUT',
    dateTime: dayjs()
      .hour(13)
      .minute(40)
      .second(0)
      .millisecond(0)
      .toISOString(),
    notes: 'Normal',
  },
];

// TODO: backend delete this and replace with patient's running notes
export const INITIAL_NOTES: Note[] = [
  {
    noteId: 'note-1',
    authorName: 'Jane Smith',
    createdAt: dayjs()
      .hour(8)
      .minute(15)
      .second(0)
      .millisecond(0)
      .toISOString(),
    plainText: 'This is a test note.\n\n\nIt has multiple lines.',
    html: '<p>This is a test note.</p><p>&nbsp;</p><p>&nbsp;</p><p>It has multiple lines.</p>',
  },
  {
    noteId: 'note-2',
    authorName: 'Jane Smith',
    createdAt: dayjs()
      .hour(12)
      .minute(30)
      .second(0)
      .millisecond(0)
      .toISOString(),
    plainText:
      'These notes are not changable.\nNurse running notes are preserved.',
    html: '<p>These notes are not changable.</p><p>Nurse running notes are preserved.</p>',
  },
];
