import type { create as createTemplateSDK } from '@rehua/sdk/functional/templates';

export enum TemplateDocumentType {
  LoneTerm = 'Lone Term',
  ShortTerm = 'Short Term',
  Palliative = 'Palliative',
  Daycare = 'Daycare',
}

export const TemplateDocumentTypeValues = Object.values(TemplateDocumentType);

TemplateDocumentTypeValues satisfies createTemplateSDK.Body['templateType'];
