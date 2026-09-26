import type { User_idstring } from './User_idstring';

export type PaginatedResponseDtoUser_idstring = {
  data: User_idstring.o3[];
  meta: {
    totalPages: number;
  };
};
