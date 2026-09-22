import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import nextRouterMock from 'next-router-mock/navigation';
import { TextDecoder, TextEncoder } from 'node:util';

jest.mock('next/navigation', () => nextRouterMock);

Object.defineProperties(globalThis, {
  TextEncoder: {
    value: TextEncoder,
    configurable: true,
  },
  TextDecoder: {
    value: TextDecoder,
    configurable: true,
  },
});
