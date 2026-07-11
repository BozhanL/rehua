import type { HTMLAttributes, JSX } from 'react';

// predefined colors for all mini labels
const colors = {
  green: {
    textColor: 'text-rehua-mini-opaque-green',
    backgroundColor: 'bg-rehua-mini-translucent-green',
  },
  pink: {
    textColor: 'text-rehua-mini-opaque-pink',
    backgroundColor: 'bg-rehua-mini-translucent-pink',
  },
  navy: {
    textColor: 'text-rehua-mini-opaque-navy',
    backgroundColor: 'bg-rehua-mini-translucent-navy',
  },
  orange: {
    textColor: 'text-rehua-mini-opaque-orange',
    backgroundColor: 'bg-rehua-mini-translucent-orange',
  },
  discharged: {
    textColor: 'text-rehua-mini-opaque-discharged',
    backgroundColor: 'bg-rehua-mini-translucent-discharged',
  },
  deceased: {
    textColor: 'text-rehua-mini-opaque-deceased',
    backgroundColor: 'bg-rehua-mini-translucent-deceased',
  },
  upload: {
    textColor: 'text-rehua-mini-opaque-upload',
    backgroundColor: 'bg-rehua-mini-translucent-upload',
  },
  red: {
    textColor: 'text-rehua-mini-opaque-red',
    backgroundColor: 'bg-rehua-mini-translucent-red',
  },
};

// all preset labels that can be rendered in the component
const presetLabels = {
  active: {
    text: 'Active',
    color: colors.green,
  },
  disabled: {
    text: 'Disabled',
    color: colors.red,
  },
  longTerm: {
    text: 'Long Term',
    color: colors.green,
  },
  palliative: {
    text: 'Palliative',
    color: colors.pink,
  },
  shortTerm: {
    text: 'Short Term',
    color: colors.navy,
  },
  daycare: {
    text: 'Daycare',
    color: colors.orange,
  },
  discharged: {
    text: 'Discharged',
    color: colors.discharged,
  },
  deceased: {
    text: 'Deceased',
    color: colors.deceased,
  },
  upload: {
    text: 'Upload',
    color: colors.upload,
  },
} as const;

// type that is a subset of HTMLAttributes, omitting width to ensure consistent aspect ratio
type MiniLabelProps = Omit<HTMLAttributes<HTMLDivElement>, 'width'> & {
  name: keyof typeof presetLabels;
  height?: number;
};

// React component that renders a mini label with a consistent aspect ratio
function MiniLabel({
  name,
  height = 30,
  style,
  ...props
}: MiniLabelProps): JSX.Element {
  const label = presetLabels[name];

  const width = Math.round(height * 3.85); // fixed proportion of height for width
  const borderRadius = Math.round(height * 0.35); // fixed proportion of height for radius
  const fontSize = Math.round(height * 0.53); // text scales with height
  const paddingX = Math.round(height * 0.6); // horizontal padding scales with height

  return (
    <span
      {...props}
      style={{
        ...style,
        width: width,
        height: height,
        borderRadius: borderRadius,
        fontSize: fontSize,
        paddingInline: paddingX,
      }}
      // Tailwind classes for consistent styling and text overflow handling
      className={`
        inline-flex 
        items-center
        justify-center
        whitespace-nowrap
        overflow-hidden
        text-ellipsis
        ${label.color.textColor}
        ${label.color.backgroundColor}
        font-bold
      `}
    >
      {label.text}
    </span>
  );
}

export default MiniLabel;
export type MiniLabelName = keyof typeof presetLabels; // just export the labels
