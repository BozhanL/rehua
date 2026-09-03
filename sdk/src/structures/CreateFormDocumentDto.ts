import type { Recordstringunknown } from './Recordstringunknown';
import type { tags } from 'typia';

export type CreateFormDocumentDto = {
  patientId: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  templateId: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  data: Recordstringunknown;
};
