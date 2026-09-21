'use client';
import NavigationBar from '../components/navigation/NavigationBar';
import { sessionStorageGetUserInfo } from '../utils/auth';
import type { JSX, ReactNode } from 'react';

// layout for (pages) route, which ensures all pages have navigation bar at the top
// logged-in user's first name, last name, and group to the navigation bar
export default function PagesLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      <NavigationBar
        firstName={sessionStorageGetUserInfo().firstName}
        lastName={sessionStorageGetUserInfo().lastName}
        group={sessionStorageGetUserInfo().group}
      />
      <main>{children}</main>
    </>
  );
}
