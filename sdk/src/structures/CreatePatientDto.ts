export type CreatePatientDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  nhi: string;
  dateAdmitted: string;
  gpNameAndMedicalCenter: string;
  nurse: string;
  roomNumber: number;
  status:
    | 'disabled'
    | 'active'
    | 'longTerm'
    | 'palliative'
    | 'shortTerm'
    | 'daycare'
    | 'discharged'
    | 'deceased'
    | 'upload';
  email: string;
  homePhoneNumber: string;
  gender: string;
  primaryLanguage: string;
  maritalStatus: string;
  ethnicity: string;
  allergies: string;
  profilePicture?: undefined | string;
  funding?: undefined | string;
  timeOfDeath?: undefined | string;
};
