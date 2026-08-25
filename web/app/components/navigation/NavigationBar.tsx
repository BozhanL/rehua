import dayjs from '../../utils/dayjs';
import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Logo from '../common/Logo';
import { UploadManualButton, ShowManualButton } from './ManualButtons';
import type { JSX } from 'react';

interface NavigationBarProps {
  firstName: string;
  lastName: string;
  group: 'admin' | 'nurse'; // different navbar will be rendered based on user group
}

// React component that renders the navbar for the whole program
function NavigationBar({
  firstName,
  lastName,
  group,
}: Readonly<NavigationBarProps>): JSX.Element {
  const todaysDate = dayjs().tz().format('DD/MM/YYYY');

  return (
    <nav
      className="
        flex min-h-22.5 w-full items-center justify-between gap-6
        overflow-x-auto bg-rehua-white px-6 py-4 whitespace-nowrap
      "
    >
      {/* left side: logo + user information */}
      <div className="flex shrink-0 items-center gap-10">
        {/* logo */}
        <div className="shrink-0">
          <Logo width={200} />
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
      </div>
      {/* right side: navigation actions */}
      <div className="flex shrink-0 items-center gap-6">
        {/* admin only actions */}
        {group === 'admin' && (
          <>
            {/* TODO: backend to implement view logs button and use this snippet within <ViewLogsButton />  */}
            <ContentButton
              text1="View"
              text2="Logs"
              iconProps={{ name: 'clipboard' }}
              backgroundColor="bg-rehua-navy"
              iconPosition="left"
              verticalPadding={0.2}
              horizontalPadding={0.5}
              lineHeight={1.1}
              textIconGap={0.4}
              className="text-base"
            />
            <UploadManualButton />
          </>
        )}
        {/* available to all users */}
        <ShowManualButton />
        {/* TODO: backend to implement logout button and use this snippet within <LogoutButton />  */}
        <ContentButton
          text1="Logout"
          iconProps={{ name: 'access', flip: 'horizontal' }}
          backgroundColor="bg-rehua-red"
          iconPosition="left"
          verticalPadding={0.3}
          horizontalPadding={0.4}
          lineHeight={1.1}
          textIconGap={0.3}
          className="text-lg"
        />
      </div>
    </nav>
  );
}

export default NavigationBar;
