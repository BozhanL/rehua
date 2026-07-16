import Page from '@/app/hello/page';
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
    await screen.findByText('Create Hello');

    expect(container).toMatchSnapshot();
  });
});
