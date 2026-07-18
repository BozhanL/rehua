import FormTemplate from './FormTemplate';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import type { UiSchema, RJSFSchema } from '@rjsf/utils';
import { render, screen } from '@testing-library/react';
import { uniformFloat64 } from 'pure-rand/distribution/uniformFloat64';
import { xoroshiro128plus } from 'pure-rand/generator/xoroshiro128plus';

const schema: RJSFSchema = {
  title: 'A registration form',
  description: 'A simple form example.',
  type: 'object',
  required: ['firstName', 'lastName'],
  properties: {
    firstName: {
      type: 'string',
      title: 'First name',
      default: 'Chuck',
    },
    lastName: {
      type: 'string',
      title: 'Last name',
    },
    age: {
      type: 'integer',
      title: 'Age',
    },
    bio: {
      type: 'string',
      title: 'Bio',
    },
    password: {
      type: 'string',
      title: 'Password',
      minLength: 3,
    },
    telephone: {
      type: 'string',
      title: 'Telephone',
      minLength: 10,
    },
  },
};

const uiSchema: UiSchema = {
  firstName: {
    'ui:autofocus': true,
    'ui:emptyValue': '',
    'ui:placeholder':
      'ui:emptyValue causes this field to always be valid despite being required',
    'ui:autocomplete': 'family-name',
    'ui:enableMarkdownInDescription': true,
    'ui:description':
      'Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/).',
  },
  lastName: {
    'ui:autocomplete': 'given-name',
    'ui:enableMarkdownInDescription': true,
    'ui:description':
      'Make things **bold** or *italic*. Embed snippets of `code`. <small>NOTE: Unsafe HTML, not rendered</small> ',
  },
  age: {
    'ui:widget': 'updown',
    'ui:title': 'Age of person',
    'ui:description': '(earth year)',
  },
  bio: {
    'ui:widget': 'textarea',
  },
  password: {
    'ui:widget': 'password',
    'ui:help': 'Hint: Make it strong!',
  },
  telephone: {
    'ui:options': {
      inputType: 'tel',
    },
  },
};

describe('formTemplate', () => {
  beforeEach(() => {
    const rng = xoroshiro128plus(12345);
    jest.spyOn(globalThis.Math, 'random').mockReturnValue(uniformFloat64(rng));
  });

  afterEach(() => {
    jest.spyOn(globalThis.Math, 'random').mockRestore();
  });

  it('renders FormTemplate', () => {
    expect.assertions(1);

    render(
      <FormTemplate
        schema={schema}
        uiSchema={uiSchema}
        formData={''}
        onChange={jest.fn()}
      />,
    );

    const heading = screen.getByRole('heading', { name: /registration form/i });

    expect(heading).toBeInTheDocument();
  });

  it('renders FormTemplate unchanged', async () => {
    expect.assertions(1);

    const { container } = render(
      <FormTemplate
        schema={schema}
        uiSchema={uiSchema}
        formData={''}
        onChange={jest.fn()}
      />,
    );
    await screen.findByText('A registration form');

    expect(container).toMatchSnapshot();
  });
});
