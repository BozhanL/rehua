import type { create as createTemplateSDK } from '@rehua/sdk/functional/templates';

export enum TemplateDocumentType {
  LongTerm = 'Long Term',
  ShortTerm = 'Short Term',
  Palliative = 'Palliative',
  Daycare = 'Daycare',
}

export const TemplateDocumentTypeValues = Object.values(TemplateDocumentType);

TemplateDocumentTypeValues satisfies createTemplateSDK.Body['templateType'];

export type UserGroup = 'admin' | 'nurse';
export const userGroupLabels: Record<UserGroup, string> = {
  admin: 'Admin',
  nurse: 'Nurse',
};
