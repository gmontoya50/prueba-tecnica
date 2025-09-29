import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/?(*.)+(test).[tj]s'], //
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
  verbose: true,
  testTimeout: 30000, //
};

export default config;
