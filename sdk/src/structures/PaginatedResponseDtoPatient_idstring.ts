import type { Patient_idstring } from './Patient_idstring';

export type PaginatedResponseDtoPatient_idstring = {
  data: Patient_idstring.o3[];
  meta: {
    totalPages: number;
  };
};
export namespace PaginatedResponseDtoPatient_idstring {
  export type o1 = {
    data: Patient_idstring.o4[];
    meta: {
      totalPages: number;
    };
  };
}
