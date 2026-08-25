import { ConfigModule, registerAs } from '@nestjs/config';
import { mkdtempSync, accessSync, constants } from 'fs-extra';
import Joi, { type CustomHelpers, type ErrorReport } from 'joi';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { tags } from 'typia';
import typia from 'typia';

const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

// This interface defines the shape of the configuration object used in the application.
export interface Config {
  PORT: number & tags.Type<'uint32'> & tags.Minimum<0> & tags.Maximum<65535>;

  NODE_ENV: 'test' | 'development' | 'production' | 'nestia';

  MONGODB_URI_FILE?: string;

  // The path to store user uploaded files. Including patient images, manual files, and other files.
  DATA_PATH?: string;

  MAX_FILE_SIZE: number & tags.Type<'uint64'> & tags.ExclusiveMinimum<0>;

  https: {
    cert?: string;
    key?: string;
    ca?: string;
  };
}

// Bundles https related configuration into a single object for easier access and management.
const https = registerAs('https', () => ({
  cert: process.env['API_CERT'],
  key: process.env['API_KEY'],
  ca: process.env['API_CA'],
}));

// This configuration module is responsible for loading and validating the application's configuration settings.
export const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    // Determines the environment in which the application is running. It must be one of the specified values and is required for proper configuration.
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test', 'nestia')
      .required(),

    // The port on which the application will listen for incoming requests. It must be a valid port number and defaults to 3001 if not specified.
    PORT: Joi.number().port().default(3001),

    // HTTPS related configuration settings, including paths to the certificate, key, and CA files.
    API_CERT: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_KEY: requiredReadableFilePath(['test', 'development', 'nestia']),
    API_CA: requiredReadableFilePath(['test', 'development', 'nestia']),

    // The path to the file containing the MongoDB URI. This is required for connecting to the database and must be readable.
    MONGODB_URI_FILE: requiredReadableFilePath(['test', 'nestia']),

    // The path to the directory where user uploaded files will be stored. This is required and must be readable and writable.
    DATA_PATH: requiredReadableFilePath(
      ['test', 'nestia'],
      constants.W_OK | constants.R_OK,
    )
      // TODO: remove this dir after the test is done
      .default(() => mkdtempSync(path.join(tmpdir(), 'rehua-'))),

    // The maximum allowed size for uploaded files. It must be a positive integer and defaults to 100 MB if not specified.
    MAX_FILE_SIZE: Joi.number()
      .integer()
      .greater(0)
      .default(DEFAULT_MAX_FILE_SIZE),
  }),

  load: [https],
});

// Helpers for validating file paths in the configuration, ensuring they exist and have the required permissions.
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

// This function checks if a file exists and has the specified access permissions. It is used in the configuration validation to ensure that required files are accessible.
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
      : helpers.error('Unknown error in fileExistsValidator');
  }
}
