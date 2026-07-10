/* eslint-disable @typescript-eslint/no-unused-vars */
import type { HTMLAttributes, JSX, ReactNode } from 'react';

// type that is a subset of HTMLAttributes, omitting consistent properties
type SurfaceProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'background' | 'boxshadow'
> & {
  height?: number; // height of surface in pixels, fallback to 100px
  width?: number; // width of surface in pixels, fallback to 100px
  opacity?: number; // opacity of surface in %, fallback to 0.95
  children?: ReactNode; // content to be displayed on the surface
};

function Surface({
  height = 100,
  width = 100,
  opacity = 0.95,
  children,
  ...props
}: SurfaceProps): JSX.Element {
  return <div>{children}</div>;
}

export default Surface;
