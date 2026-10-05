import type { DocumentState, DocumentType } from '../entities/document.entity';
import type { Template } from '@/templates/entities/template.entity';
import type { MongoId } from '@/utils/types';

export class FindDocumentDto {
  constructor(
    public patientId: MongoId,

    public tags: string[],
    public template?: Template | undefined,
    public data?: Record<string, unknown> | undefined,
  ) {}
}

export class FindDocumentByPatientDto {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public _id: MongoId,
    public patientId: string,
    public tags: string[],
    public creationDate: Date,
    public editDate: Date,
    public state: DocumentState,
    public documentType: DocumentType,

    // File document
    public path?: string | undefined,
    public fileName?: string | undefined,

    // Form document
    public data?: Record<string, unknown> | undefined,
    public templateId?: Template | undefined,
  ) {}
}
