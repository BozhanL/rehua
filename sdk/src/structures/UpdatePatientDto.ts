export type UpdatePatientDto = {
  firstName?: undefined | string;
  lastName?: undefined | string;
  dateOfBirth?: undefined | string;
  address?: undefined | string;
  nhi?: undefined | string;
  dateAdmitted?: undefined | string;
  gpNameAndMedicalCenter?: undefined | string;
  nurse?: undefined | string;
  roomNumber?: undefined | number;
  status?:
    | undefined
    | 'disabled'
    | 'active'
    | 'longTerm'
    | 'palliative'
    | 'shortTerm'
    | 'daycare'
    | 'discharged'
    | 'deceased'
    | 'upload';
  email?: undefined | string;
  homePhoneNumber?: undefined | string;
  gender?: undefined | string;
  primaryLanguage?: undefined | string;
  maritalStatus?: undefined | string;
  ethnicity?: undefined | string;
  allergies?: undefined | string;
  profilePicture?: undefined | File;
  funding?: undefined | string;
  timeOfDeath?: undefined | string;
};
