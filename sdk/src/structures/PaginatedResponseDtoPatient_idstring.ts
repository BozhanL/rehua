import type { Patient_idstring } from './Patient_idstring';

export type PaginatedResponseDtoPatient_idstring = {
  data: Patient_idstring.o3[];
  meta: {
    totalPages: number;
  };
};
