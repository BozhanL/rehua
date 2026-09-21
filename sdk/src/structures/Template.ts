import type { Recordstringunknown } from './Recordstringunknown';

export type Template = {
  version: number;
  templateName: string;
  templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
};
