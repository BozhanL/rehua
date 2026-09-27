export class CreatePatientDto {
  constructor(
    public firstName: string,
    public lastName: string,
    public dateOfBirth: string,
    public address: string,
    public nhi: string,
    public dateAdmitted: string,
    public gpNameAndMedicalCentre: string,
    public nurse: string,
    public roomNumber: string,
    public status:
      | 'disabled'
      | 'active'
      | 'longTerm'
      | 'palliative'
      | 'shortTerm'
      | 'daycare'
      | 'discharged'
      | 'deceased'
      | 'upload',
    public email: string,
    public homePhoneNumber: string,
    public gender: string,
    public primaryLanguage: string,
    public maritalStatus: string,
    public ethnicity: string,
    public allergies: string,

    //Not required
    public profilePicture?: File,
    public funding?: string, //Admin only
    public timeOfDeath?: string, //Admin only
  ) {}
}
