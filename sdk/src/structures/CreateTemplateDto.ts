import type { Recordstringunknown } from './Recordstringunknown';

export type CreateTemplateDto = {
  templateName: string;
  templateType: ('Lone Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
};
