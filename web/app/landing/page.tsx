'use client';

import type { JSX } from 'react';
import { functional } from 'typia';

function Home(): JSX.Element {
  return (
    <>
      <h2>Landing Page after login</h2>
      <p>Insert demo here</p>
    </>
  );
}

export default functional.assertFunction(Home);
