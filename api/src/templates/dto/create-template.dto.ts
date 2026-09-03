import type { TemplateType } from '../entities/template-type.enum';

export class CreateTemplateDto {
  constructor(
    public templateName: string,
    public templateType: TemplateType[],

    public schema: Record<string, unknown>,
    public uiSchema: Record<string, unknown>,
  ) {}
}
