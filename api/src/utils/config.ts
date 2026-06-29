import { tags } from 'typia';

export interface Config {
  PORT: number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<65535>;

  NODE_ENV: 'test' | 'development' | 'production';

  MONGODB_URI: string &
    tags.Format<'uri'> &
    tags.Pattern<'^mongodb(?:\\+srv)?'>;
}
