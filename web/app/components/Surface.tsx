import type { HTMLAttributes, JSX, ReactNode } from 'react';

// type that is a subset of HTMLAttributes, omitting consistent properties
type SurfaceProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'color' | 'borderRadius'
> & {
  height?: number; // height of surface in pixels, fallback to 650px
  width?: number; // width of surface in pixels, fallback to 1100px
  opacity?: number; // opacity of surface in %, fallback to 0.95
  boxShadow?: string; // box shadow for surface, fallback to 20px blur with 35% opacity black shadow
  children?: ReactNode; // content to be displayed on the surface
};

// React component that renders plain surface with white background, rounded corners, and box shadow
function Surface({
  height = 650,
  width = 1100,
  opacity = 0.95,
  boxShadow = '0 0 20px rgb(0 0 0 / 0.35)',
  children,
  style,
  ...props
}: SurfaceProps): JSX.Element {
  const borderRadius = Math.round(Math.min(height, width) * 0.06); // 6% of the smaller dimension

  return (
    <div
      {...props}
      style={{
        ...style,
        height: height,
        width: width,
        opacity: opacity,
        boxShadow: boxShadow,
        borderRadius: borderRadius,
      }}
      className={`bg-rehua-white`}
    >
      {children}
    </div>
  );
}

export default Surface;
export type { SurfaceProps };
