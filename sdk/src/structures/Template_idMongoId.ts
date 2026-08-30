import type { Recordstringunknown } from './Recordstringunknown';
import type { tags } from 'typia';

export type Template_idMongoId = {
  templateName: string;
  templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
  _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
};
export namespace Template_idMongoId {
  export type o1 = {
    templateName: string;
    templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
    schema: Recordstringunknown;
    uiSchema: Recordstringunknown;
    _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  };
  export type o2 = {
    templateName: string;
    templateType: ('Long Term' | 'Short Term' | 'Palliative' | 'Daycare')[];
    schema: Recordstringunknown;
    uiSchema: Recordstringunknown;
    _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  };
}
