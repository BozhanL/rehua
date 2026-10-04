import type { DocumentType } from '../entities/document.entity';
import type { MongoId } from '@/utils/types';

export class CreateFileDocumentDto {
  constructor(
    public patientId: MongoId,
    public tags: string[],
    public file: File,
  ) {}
}

export class CreateFormDocumentDto {
  constructor(
    public patientId: MongoId,
    public tags: string[],
    public documentType: DocumentType,
    public templateId: MongoId,
    public data: Record<string, unknown>,
  ) {}
}
