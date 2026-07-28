import RadioWidget from './RadioWidget';
import type { ThemeProps } from '@rjsf/core';
import { generateTheme } from '@rjsf/mui';

const muiTheme: ThemeProps = generateTheme();
const theme: ThemeProps = {};

theme.widgets ??= {};
theme.widgets['RadioWidget'] = RadioWidget;

theme.templates ??= {};
theme.templates['ArrayFieldTemplate'] =
  muiTheme.templates?.['ArrayFieldTemplate'];
theme.templates['ArrayFieldItemTemplate'] =
  muiTheme.templates?.['ArrayFieldItemTemplate'];
theme.templates['ArrayFieldItemButtonTemplate'] =
  muiTheme.templates?.['ArrayFieldItemButtonTemplate'];
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
theme.templates.ButtonTemplates = muiTheme.templates?.ButtonTemplates!;

export default theme;
