'use client';

import Icon from './Icon';
import { icons } from './auto-generated-icons';
import type { ButtonHTMLAttributes, JSX } from 'react';

type ContentButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled'
> & {
  text1?: string;
  text2?: string;
  icon?: keyof typeof icons;
  iconWidth?: number;
  iconPosition?: 'left' | 'right' | 'center';
  textAlign?: 'left' | 'right' | 'center';
  textIconGap?: number;
  height?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  horizontalPadding?: number;
  verticalPadding?: number;
  lineHeight?: number;
  onClick?: () => void;
};

function ContentButton({
  text1,
  text2,
  icon,
  iconPosition = 'center',
  iconWidth,
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
  const buttonIconWidth = iconWidth
    ? Math.round(height * iconWidth)
    : Math.round(height * 0.7);
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

  const direction = iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  // eslint-disable-next-line no-useless-assignment
  let textAlignment = '';
  switch (textAlign) {
    case 'left':
      textAlignment = 'text-left';
      break;

    case 'right':
      textAlignment = 'text-right';
      break;

    default:
      textAlignment = 'text-center';
  }

  const showIcon = icon !== undefined;
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
        boxShadow: 'inset 0 4px 10px rgb(0 0 0 / 0.3)',
      }}
      className={`
        inline-flex
        w-fit
        items-center
        justify-center
        cursor-pointer
        ${direction}
        ${backgroundColor}
        active:brightness-80
        transition-all
        duration-100
      `}
      onClick={onClick}
    >
      {showIcon && (
        <Icon name={icon} width={buttonIconWidth} className={foregroundColor} />
      )}
      {showText1 && (
        <span
          className={`
            inline-flex
            flex-col
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
