import { icons } from './auto-generated-icons';
import type { JSX, SVGProps } from 'react';

// type that is a subset of SVGProps, omitting some props to ensure consistent aspect ratio
type IconProps = Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'ref'> & {
  // name (mandatory) of the icon to render, must be a key in the icons object
  // width is optional, fallback to 24px wide
  // rotation is optional, in degrees, fallback to 0
  name: keyof typeof icons;
  width?: number;
  rotation?: number;
  flip?: 'horizontal' | 'vertical';
};

// React component that renders an SVG icon with a consistent aspect ratio
function Icon({
  name,
  width = 24,
  rotation = 0,
  flip,
  style,
  ...props
}: IconProps): JSX.Element {
  const SvgIcon = icons[name];

  const transformations = [
    rotation ? `rotate(${String(rotation)}deg)` : '',
    flip === 'horizontal' ? 'scaleX(-1)' : '',
    flip === 'vertical' ? 'scaleY(-1)' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <SvgIcon
      {...props}
      width={width}
      preserveAspectRatio="xMidYMid meet" // ensures the icon scales correctly without distortion
      style={{
        ...style,
        transform: transformations || undefined,
        transformOrigin: 'center', // rotation and flips occur around the center of the icon
        transformBox: 'fill-box', // transform origin is relative to SVG's bounding box
      }}
    />
  );
}

export default Icon;
export type { IconProps };
