'use client';
import NavigationBar from '../components/navigation/NavigationBar';
import { userInfo } from '../utils/auth';
import type { JSX, ReactNode } from 'react';

// layout for (pages) route, which ensures all pages have navigation bar at the top
// logged-in user's first name, last name, and group to the navigation bar
export default function PagesLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      <NavigationBar
        firstName={userInfo.firstName}
        lastName={userInfo.lastName}
        group={userInfo.group}
      />
      <main>{children}</main>
    </>
  );
}
