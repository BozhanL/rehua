import { ConfigModule, registerAs } from '@nestjs/config';
import { mkdtempSync, accessSync, constants } from 'fs-extra';
import Joi, { type CustomHelpers, type ErrorReport } from 'joi';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { tags } from 'typia';
import typia from 'typia';

export interface Config {
  PORT: number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<65535>;

  NODE_ENV: 'test' | 'development' | 'production' | 'nestia';

  MONGODB_URI_FILE?: string;

  // The path to store user uploaded files. Including patient images, manual files, and other files.
  DATA_PATH?: string;

  https: {
    cert?: string;
    key?: string;
    ca?: string;
  };
}

const https = registerAs('https', () => ({
  cert: process.env['API_CERT'],
  key: process.env['API_KEY'],
  ca: process.env['API_CA'],
}));

export const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'nestia')
      .required(),
    PORT: Joi.number().port().default(3001),
    API_CERT: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_KEY: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_CA: requiredReadableFilePath(['test', 'development', 'nestia']),
    MONGODB_URI_FILE: requiredReadableFilePath(['test', 'nestia']),
    DATA_PATH: requiredReadableFilePath(
      ['test', 'nestia'],
      constants.W_OK | constants.R_OK,
    )
      // TODO: remove this dir after the test is done
      .default(() => mkdtempSync(path.join(tmpdir(), 'rehua-'))),
  }),
  load: [https],
});

function requiredReadableFilePath(
  skipEnvs: Config['NODE_ENV'][],
  accessMode: number = constants.R_OK,
): Joi.StringSchema {
  return Joi.string().when('NODE_ENV', {
    is: Joi.valid(...skipEnvs),
    then: Joi.optional(),
    otherwise: Joi.required().custom(
      (value: string, helpers: CustomHelpers) =>
        fileExistsValidator(value, helpers, accessMode),

      'file permission validation',
    ),
  });
}

// eslint-disable-next-line sonarjs/function-return-type
function fileExistsValidator(
  value: string,
  helpers: CustomHelpers,
  accessMode: number,
): string | ErrorReport {
  try {
    accessSync(value, accessMode);
    return value;
  } catch (e) {
    return typia.is<Error>(e)
      ? helpers.error(e.message)
      : helpers.error(
          'Unknown error during MONGODB_URI_FILE file permission validation',
        );
  }
}
