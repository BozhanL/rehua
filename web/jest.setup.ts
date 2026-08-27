import { jest } from '@jest/globals';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import nextRouterMock from 'next-router-mock/navigation';

jest.mock('next/navigation', () => nextRouterMock);
