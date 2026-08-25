import dayjs from '../../utils/dayjs';
import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Logo from '../common/Logo';
import { UploadManualButton, ShowManualButton } from './ManualButtons';
import type { JSX } from 'react';

interface NavigationBarProps {
  firstName: string;
  lastName: string;
  group: 'admin' | 'nurse';
}

function NavigationBar({
  firstName,
  lastName,
  group,
}: Readonly<NavigationBarProps>): JSX.Element {
  const todaysDate = dayjs().tz().format('DD/MM/YYYY');

  return (
    <nav
      className="
        flex min-h-22.5 w-full flex-wrap items-center justify-between gap-x-6
        gap-y-3 border-b bg-rehua-white px-6 py-3
      "
    >
      {/* left side: logo + user information */}
      <div className="flex min-w-0 flex-1 items-center gap-6">
        {/* Logo */}
        <div className="shrink-0">
          <Logo width={220} />
        </div>

        {/* user information */}
        <div className="flex min-w-0 flex-col justify-center gap-2">
          {/* logged-in user */}
          <div className="flex min-w-0 items-center gap-3">
            <Icon name="users" width={26} className="text-rehua-maroon" />

            <span className="truncate text-lg font-medium">
              <b>Logged in as:</b> {firstName} {lastName}
            </span>
          </div>

          {/* current date */}
          <div className="flex min-w-0 items-center gap-3">
            <Icon name="calendar" width={26} className="text-rehua-maroon" />

            <span className="truncate text-lg font-medium">
              <b>Date:</b> {todaysDate}
            </span>
          </div>
        </div>
        {/* right side: navigation actions */}
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {/* admin only actions */}
          {group === 'admin' && (
            <>
              <ContentButton
                text1="View"
                text2="Logs"
                iconProps={{ name: 'clipboard' }}
                backgroundColor="bg-rehua-navy"
                iconPosition="left"
                height={70}
                verticalPadding={0.2}
                horizontalPadding={0.5}
                lineHeight={1.1}
                textIconGap={0.4}
              />
              <UploadManualButton />
            </>
          )}

          {/* available to all users */}
          <ShowManualButton />
          <ContentButton
            text1="Logout"
            iconProps={{ name: 'access', flip: 'horizontal' }}
            backgroundColor="bg-rehua-red"
            iconPosition="left"
            height={70}
            horizontalPadding={0.4}
          />
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
