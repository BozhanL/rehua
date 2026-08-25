export class CreatePatientDto {
  constructor(
    public firstName: string,
    public lastName: string,
    public dob: string,
    public address: string,
    public nhi: number,
    public dateAdmitted: string,
    public gpNameAndMedicalCenter: string,
    public nurse: string,
    public roomNumber: number,
    public status: string,
    public email: string,
    public homePhoneNumber: string,
    public gender: string,
    public primaryLanguage: string,
    public maritalStatus: string,
    public ethnicity: string,
    public allergies: string,

    //Not required
    public pfp?: string,
    public funding?: string, //Admin only
    public tod?: string, //Admin only
    public id?: string, //for returns
  ) {}
}
