import type { Template } from '@/templates/entities/template.entity';
import type { MongoId } from '@/utils/types';

export class FindDocumentDto {
  constructor(
    public patientId: MongoId,

    public template?: Template | undefined,
    public data?: Record<string, unknown> | undefined,
  ) {}
}
