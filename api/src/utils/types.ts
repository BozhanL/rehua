import type { tags } from 'typia';

export type MongoId = string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;
