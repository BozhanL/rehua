'use client';

import NavigationBar from '@/app/components/navigation/NavigationBar';
import type { JSX } from 'react';

export default function NavigationTestPage(): JSX.Element {
  return <NavigationBar firstName="Jane" lastName="Smith" group="admin" />;
}
