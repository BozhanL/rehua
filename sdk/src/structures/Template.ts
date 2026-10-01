import type { Recordstringunknown } from './Recordstringunknown';

export type Template = {
  version: number;
  templateName: string;
  templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  status: 'active' | 'archived';
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
};
