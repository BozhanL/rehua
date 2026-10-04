import type { Recordstringunknown } from './Recordstringunknown';
import type { Template } from './Template';
import type { tags } from 'typia';

export type FindDocumentByPatientDto = {
  _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  patientId: string;
  tags: string[];
  creationDate: string & tags.Format<'date-time'>;
  editDate: string & tags.Format<'date-time'>;
  state: 'Current' | 'Archive';
  documentType:
    'Long Term' | 'Short Term' | 'Palliative' | 'Daycare' | 'Upload';
  path?: undefined | string;
  fileName?: undefined | string;
  data?: undefined | Recordstringunknown;
  templateId?: undefined | Template;
};
