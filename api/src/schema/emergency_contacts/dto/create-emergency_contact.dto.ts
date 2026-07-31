export class CreateEmergencyContactDto {
  constructor(
    public patientId: string,
    public priority: number,
    public firstName: string,
    public lastName: string,
    public relationship: string,
    public phoneNumber: string,
    public email: string,
    public address: string,
    public notes?: string,
  ) {}
}
