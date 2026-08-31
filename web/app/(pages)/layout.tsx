'use client';
import NavigationBar from '../components/navigation/NavigationBar';
import type { JSX, ReactNode } from 'react';

// layout for (pages) route, which ensures all pages have navigation bar at the top

// TODO: backend to implement user authentication and pass
// logged-in user's first name, last name, and group to the navigation bar
export default function PagesLayout({
  children,
}: Readonly<{ children: ReactNode }>): JSX.Element {
  return (
    <>
      <NavigationBar firstName="Jane" lastName="Smith" group="admin" />
      <main>{children}</main>
    </>
  );
}
