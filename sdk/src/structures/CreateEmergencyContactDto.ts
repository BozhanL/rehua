export type CreateEmergencyContactDto = {
  patientId: string;
  priority: number;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes?: undefined | string;
};
