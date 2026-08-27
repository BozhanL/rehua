import Surface from '@/app/components/common/Surface';
import type { JSX } from 'react';

export default function TestingLayoutPage(): JSX.Element {
  return (
    <div className="flex h-dvh flex-col">
      <Surface width="100%" height="100%">
        <h1 className="p-10">Yoooooo 🥳</h1>
      </Surface>
    </div>
  );
}
