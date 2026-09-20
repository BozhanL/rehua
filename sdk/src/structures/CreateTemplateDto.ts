import type { Recordstringunknown } from './Recordstringunknown';

export type CreateTemplateDto = {
  templateName: string;
  templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
};
