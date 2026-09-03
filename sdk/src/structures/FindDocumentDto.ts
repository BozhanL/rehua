import type { Recordstringunknown } from './Recordstringunknown';
import type { Template } from './Template';
import type { tags } from 'typia';

export type FindDocumentDto = {
  patientId: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  template?: undefined | Template;
  data?: undefined | Recordstringunknown;
};
