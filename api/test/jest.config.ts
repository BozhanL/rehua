import type { Config } from 'jest';
import { createDefaultEsmPreset } from 'ts-jest';

const presetConfig = createDefaultEsmPreset({
  tsconfig: 'tsconfig.test.json',

  // jest does not work when isolatedModules is enabled
  // isolatedModules is enabled in build environment
  diagnostics: { ignoreCodes: [151002] },
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
  testRegex: String.raw`.*\.e2e-spec\.ts$`,
  moduleNameMapper: {
    '^@/(.*?)(?:\\.js)?$': '<rootDir>/../src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
