import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',
});

const config: Config = {
  ...presetConfig,

  reporters: [
    'default',
    [
      'jest-junit',
      { outputDirectory: './test/coverage', outputName: 'junit.xml' },
    ],
  ],

  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  moduleNameMapper: {
    '^@/(.*?)(?:\\.js)?$': '<rootDir>/../src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
