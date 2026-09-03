import type { Recordstringunknown } from './Recordstringunknown';
import type { tags } from 'typia';

export type FormDocument_idMongoId = {
  patientId: string;
  templateId: string;
  data: Recordstringunknown;
  _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
};
