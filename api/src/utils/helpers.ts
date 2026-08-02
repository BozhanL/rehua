import type { Request } from 'express';

export function getFilesFromRequest(request: Request): Express.Multer.File[] {
  if (request.file) {
    return [request.file];
  } else if (Array.isArray(request.files)) {
    return request.files;
  } else if (request.files === undefined) {
    return [];
  } else {
    return Object.values(request.files).flat();
  }
}
