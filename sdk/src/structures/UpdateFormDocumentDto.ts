import type { Recordstringunknown } from './Recordstringunknown';
import type { tags } from 'typia';

export type UpdateFormDocumentDto = {
  patientId?: undefined | (string & tags.Pattern<'^[0-9a-fA-F]{24}$'>);
  tags?: undefined | string[];
  documentType?:
    | undefined
    | 'Long Term'
    | 'Short Term'
    | 'Palliative'
    | 'Daycare'
    | 'Upload';
  templateId?: undefined | (string & tags.Pattern<'^[0-9a-fA-F]{24}$'>);
  data?: undefined | Recordstringunknown;
};
