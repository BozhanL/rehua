export class NoteAuditEntry {
  constructor(
    public auditId: string,
    public formattedBy: string,
    public formattedAt: string,
    public beforeHtml: string,
    public afterHtml: string,
  ) {}
}
