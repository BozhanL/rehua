'use client';

import type { SurfaceProps } from './Surface';
import Surface from './Surface';
import type { CSSProperties, JSX, ReactNode } from 'react';
import { useEffect } from 'react';

interface ModalProps {
  open: boolean; // whether modal is open or closed
  showBackground?: boolean; // whether modal should have a background overlay, fallback to true
  backgroundOpacity?: number; // opacity of background in %, fallback to 0.1
  backgroundStyle?: CSSProperties; // additional styles to be applied to modal background overlay
  surfaceProps?: SurfaceProps; // props to be passed to surface component
  offsetX?: number; // horizontal offset from centre in pixels, fallback to 0
  offsetY?: number; // vertical offset from centre in pixels, fallback to 0
  children?: ReactNode; // content to be displayed inside modal
}

// React component that renders styled modal with a surface and other content
function Modal({
  open,
  showBackground = true,
  backgroundOpacity = 0.1,
  surfaceProps,
  offsetX = 0,
  offsetY = 0,
  children,
  backgroundStyle,
}: Readonly<ModalProps>): JSX.Element {
  // disable page scrolling when modal is open
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // when open is false, do not render anything
  if (!open) {
    return <></>;
  }

  // otherwise, render modal
  return (
    // div acts as a background overlay, centres surface by default
    <div
      className={`
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
      `}
      style={{
        ...backgroundStyle,
        backgroundColor: showBackground
          ? `rgb(0 0 0 / ${String(backgroundOpacity)})`
          : 'transparent',
      }}
    >
      {/* surface acts as the main, white content container for modal */}
      <Surface
        {...surfaceProps}
        style={{
          ...surfaceProps?.style,
          transform: `
            ${surfaceProps?.style?.transform ?? ''}
            translate(${String(offsetX)}px, ${String(offsetY)}px)
          `,
        }}
      >
        {children}
      </Surface>
    </div>
  );
}

export default Modal;
