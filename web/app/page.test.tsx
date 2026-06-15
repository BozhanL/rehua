import Page from '@/app/page';
import Providers from '@/app/providers';
import { render, screen } from '@testing-library/react';
import { assert, TypeGuardError } from 'typia';

describe('Page', () => {
  beforeEach(() => {
    jest.spyOn(globalThis.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(globalThis.Math, 'random').mockRestore();
  });

  it('renders page', () => {
    render(<Page />, { wrapper: Providers });

    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toBeInTheDocument();
  });

  it('renders homepage unchanged', () => {
    const { container } = render(<Page />, { wrapper: Providers });
    expect(container).toMatchSnapshot();
  });
});

describe('typia', () => {
  it('should not raise an error', () => {
    expect(() => assert<number>(1)).not.toThrow();
    expect(assert<number>(1)).toBe(1);
  });

  it('should not raise an error', () => {
    expect(() => assert<string>(1 as unknown as string)).toThrow(
      TypeGuardError,
    );
  });
});
