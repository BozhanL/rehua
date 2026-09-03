import type { tags } from 'typia';

export type CreateFileDocumentDto = {
  patientId: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  file: File;
};
