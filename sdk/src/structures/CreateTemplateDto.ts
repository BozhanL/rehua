import type { Recordstringunknown } from './Recordstringunknown';

export type CreateTemplateDto = {
  templateName: string;
  templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  status: 'active' | 'archived';
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
};
