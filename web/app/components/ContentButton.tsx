'use client';

import Icon, { type IconProps } from './Icon';
import type { ButtonHTMLAttributes, JSX } from 'react';

// type that is a subset of ButtonHTMLAttributes, omitting 'disabled' as buttons will always be enabled
type ContentButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> & {
  text1?: string; // bottom and top lines within button, up to 2 lines allowed
  text2?: string;
  // colour for icons is set via foregroundColor
  // width should be set as a scale value based on button height (e.g. 0.7 = 70% of button height)
  iconProps?: Omit<IconProps, 'className'>;
  iconPosition?: 'left' | 'right' | 'center'; // determines where icon is placed relative to text, fallback to 'center'
  textAlign?: 'left' | 'right' | 'center'; // determines how text is aligned, fallback to 'center'
  textIconGap?: number; // gap between icon and text, in proportion to button height (e.g. 0.2 = 20% of button height)
  height?: number; // height of button in pixels, fallback to 40px
  foregroundColor?: string; // Tailwind CSS class for text and icon colour
  backgroundColor?: string; // Tailwind CSS class for button background colour
  horizontalPadding?: number; // padding on left and right, in proportion to button height
  verticalPadding?: number; // padding on top and bottom, in proportion to button height
  lineHeight?: number; // line height for text, "vertical text spacing", fallback to 1 (single line spacing)
  onClick?: () => void; // callback function when button is clicked
};

function ContentButton({
  text1,
  text2,
  iconProps,
  iconPosition = 'center',
  textAlign = 'center',
  textIconGap,
  height = 40,
  foregroundColor = 'text-rehua-white',
  backgroundColor = 'bg-rehua-black',
  horizontalPadding,
  verticalPadding,
  lineHeight = 1,
  style,
  onClick,
  ...props
}: ContentButtonProps): JSX.Element {
  const borderRadius = Math.round(height * 0.35);
  // icon width acts as a scale as opposed to a fixed pixel width, so that the icon scales with button height
  const iconWidth = Math.round(height * (iconProps?.width ?? 0.7));
  const fontSize = Math.round(height * 0.45);

  const paddingX = horizontalPadding
    ? Math.round(height * horizontalPadding)
    : Math.round(height * 0.3);

  const paddingY = verticalPadding
    ? Math.round(height * verticalPadding)
    : null;

  const gap = textIconGap
    ? Math.round(height * textIconGap)
    : Math.round(height * 0.2);

  // flex direction determined based on icon position; aka layout of button content
  const direction = iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  const textAlignment = {
    left: 'text-left',
    right: 'text-right',
    center: 'text-center',
  }[textAlign];

  // boolean flags to determine whether to render text1 and text2 spans
  const showText1 = text1 !== undefined;
  const showText2 = text2 !== undefined;

  return (
    <button
      {...props}
      style={{
        ...style,
        minHeight: height,
        borderRadius: borderRadius,
        fontSize: fontSize,
        paddingInline: paddingX,
        paddingBlock: paddingY ?? undefined,
        gap,
        boxShadow: 'inset 0 4px 10px rgb(0 0 0 / 0.3)', // subtle inner shadow
      }}
      className={`
        inline-flex w-fit cursor-pointer items-center justify-center
        ${direction}
        ${backgroundColor}
        transition-all duration-100
        active:brightness-80
      `}
      onClick={onClick}
    >
      {iconProps && (
        <Icon {...iconProps} width={iconWidth} className={foregroundColor} />
      )}
      {showText1 && (
        <span
          className={`
            inline-flex flex-col
            ${textAlignment}
            ${foregroundColor}
            font-semibold
          `}
          style={{ lineHeight: lineHeight }}
        >
          <span>{text1}</span>
          {showText2 && <span>{text2}</span>}
        </span>
      )}
    </button>
  );
}

export default ContentButton;
