export class CreateTemplateDto {
  constructor(
    public schema: Record<string, unknown>,
    public uiSchema: Record<string, unknown>,
  ) {}
}
