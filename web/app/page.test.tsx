import Page from '@/app/page';
import Providers from '@/app/providers';
import { render, screen } from '@testing-library/react';
import typia from 'typia';

describe('Page', () => {
  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
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
    typia.assert<number>(1);
  });
});
