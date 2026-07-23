import type { Recordstringunknown } from './Recordstringunknown';
import type { tags } from 'typia';

export type Template_idMongoId = {
  schema: Recordstringunknown;
  uiSchema: Recordstringunknown;
  _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
};
export namespace Template_idMongoId {
  export type o1 = {
    schema: Recordstringunknown;
    uiSchema: Recordstringunknown;
    _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  };
  export type o2 = {
    schema: Recordstringunknown;
    uiSchema: Recordstringunknown;
    _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  };
  export type o3 = {
    schema: Recordstringunknown;
    uiSchema: Recordstringunknown;
    _id: string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
  };
}
