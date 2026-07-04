import Image, { type ImageProps } from 'next/image';
import type { JSX } from 'react';

// logo dimensions
const LOGO_WIDTH = 1098;
const LOGO_HEIGHT = 464;

// type that is a subset of ImageProps, omitting some props to ensure consistent aspect ratio
type LogoProps = Omit<
  ImageProps,
  'src' | 'alt' | 'width' | 'height' | 'fill'
> & {
  // width is optional, will fallback to 320px wide
  // alt is optional, will fallback to "temporary logo"
  width?: number;
  alt?: string;
};

// React component that renders the logo image with a consistent aspect ratio
function Logo({
  alt = 'temporary logo',
  sizes,
  style,
  width = 320,
  ...props
}: LogoProps): JSX.Element {
  // calculates the height based on logo image dimensions to prevent distortion
  const height = Math.round((width * LOGO_HEIGHT) / LOGO_WIDTH);

  return (
    <Image
      {...props}
      alt={alt}
      height={height}
      sizes={sizes ?? `${String(width)}px`} // linting rule + if size is null or undefined, fallback to width in pixels
      src="/temporary-logo.jpg"
      style={{
        ...style,
        height: 'auto', // keeps browser from forcing a distorted height
        width,
      }}
      width={width}
    />
  );
}

export default Logo;
