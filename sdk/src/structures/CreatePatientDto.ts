export type CreatePatientDto = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  address: string;
  nhi: string;
  dateAdmitted: string;
  gpNameAndMedicalCentre: string;
  nurse: string;
  roomNumber: string;
  status:
    | 'active'
    | 'disabled'
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
  profilePicture?: undefined | File;
  funding?: undefined | string;
  timeOfDeath?: undefined | string;
};
