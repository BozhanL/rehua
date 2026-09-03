import type { MongoId } from '@/utils/types';

export class CreateFileDocumentDto {
  constructor(
    public patientId: MongoId,
    public file: File,
  ) {}
}

export class CreateFormDocumentDto {
  constructor(
    public patientId: MongoId,
    public templateId: MongoId,
    public data: Record<string, unknown>,
  ) {}
}
