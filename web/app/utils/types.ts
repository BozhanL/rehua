import type { create as createTemplateSDK } from '@rehua/sdk/functional/templates';

export enum TemplateDocumentType {
  LongTerm = 'Long Term',
  ShortTerm = 'Short Term',
  Palliative = 'Palliative',
  Daycare = 'Daycare',
}

export type TemplateStatus = 'active' | 'archived';
export const templateStatuses: TemplateStatus[] = ['active', 'archived'];
export const templateStatusLabels: Record<TemplateStatus, string> = {
  active: 'Active',
  archived: 'Archived',
};

export const TemplateDocumentTypeValues = Object.values(TemplateDocumentType);

TemplateDocumentTypeValues satisfies createTemplateSDK.Body['templateType'];

export type UserGroup = 'admin' | 'nurse';
export const userGroupLabels: Record<UserGroup, string> = {
  admin: 'Admin',
  nurse: 'Nurse',
};
