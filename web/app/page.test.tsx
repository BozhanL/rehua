import Page from '@/app/page';
import Providers from '@/app/providers';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { uniformFloat64 } from 'pure-rand/distribution/uniformFloat64';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';
import { assert, TypeGuardError } from 'typia';

describe('page', () => {
  beforeEach(() => {
    const rng = xoroshiro128plus(12345);
    jest
      .spyOn(globalThis.Math, 'random')
      .mockImplementation(() => uniformFloat64(rng));
  });

  afterEach(() => {
    jest.spyOn(globalThis.Math, 'random').mockRestore();
  });

  it('renders page', () => {
    expect.assertions(1);

    render(<Page />, { wrapper: Providers });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('renders homepage unchanged', async () => {
    expect.assertions(1);

    const { container } = render(<Page />, { wrapper: Providers });
    await screen.findByText('Hello', { exact: false });

    expect(container).toMatchSnapshot();
  });
});

describe('typia', () => {
  it('should not raise an error', () => {
    expect.assertions(2);

    expect(() => assert<number>(1)).not.toThrow();
    expect(assert<number>(1)).toBe(1);
  });

  it('should raise an error', () => {
    expect.assertions(1);

    expect(() => assert<string>(1 as unknown as string)).toThrow(
      TypeGuardError,
    );
  });
});
