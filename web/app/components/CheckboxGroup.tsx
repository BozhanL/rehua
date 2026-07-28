import type { CSSProperties, JSX } from 'react';

// interface for a group of checkboxes
interface CheckboxGroupProps<T extends string = string> {
  options: T[]; // array of checkbox options
  selectedBoxes: T[]; // currently checked boxes
  onChange: (values: T[]) => void; // callback function to handle selection changes
  size?: number; // size of checkbox in pixels, fallback to 20px
  boxColor?: string; // color of checkboxes, fallback to 'accent-rehua-navy'
  boxLabelColor?: string; // color of checkbox labels, fallback to 'text-rehua-navy'
  boxLabelFontSize?: number; // font size of checkbox labels in pixels, fallback to 50% of button size
  boxLabelFontWeight?: string; // font weight of checkbox labels, fallback to 'font-bold'
  boxLabelPosition?: 'top' | 'bottom' | 'left' | 'right'; // fallback to 'bottom'
  direction?: 'horizontal' | 'vertical'; // layout direction of checkboxes, fallback to 'horizontal'
  gap?: number; // gap between checkboxes in pixels, fallback to 10px
  checkboxGroupStyle?: CSSProperties; // additional styles for the checkbox group container
  className?: string; // optional class name for the checkbox group container
}

// React component for rendering a styled group of checkboxes
function CheckboxGroup<T extends string = string>({
  options,
  selectedBoxes,
  onChange,
  size = 20,
  boxColor = 'accent-rehua-navy',
  boxLabelColor = 'text-rehua-navy',
  boxLabelFontSize = Math.round(size * 0.5),
  boxLabelFontWeight = 'font-bold',
  boxLabelPosition = 'bottom',
  direction = 'horizontal',
  gap = 10,
  checkboxGroupStyle,
  className,
}: Readonly<CheckboxGroupProps<T>>): JSX.Element {
  // converts boxLabelPosition prop to corresponding CSS flexDirection value for layout
  const flexDirection = {
    top: 'column-reverse',
    bottom: 'column',
    left: 'row-reverse',
    right: 'row',
  }[boxLabelPosition] as CSSProperties['flexDirection'];

  return (
    // outer div serves as checkboxes group container, applying flex layout and gap between boxes
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap,
        ...checkboxGroupStyle,
      }}
    >
      {/* maps over options array to render each checkbox and its label */}
      {options.map((option) => {
        return (
          // label element wraps checkbox input and its label, allows label of box to be clickable
          <label
            key={option}
            style={{
              display: 'flex',
              flexDirection,
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            {/* checkbox input element */}
            <input
              type="checkbox"
              value={option}
              checked={selectedBoxes.includes(option)}
              // updates selectedBoxes state when checkbox is ticked, adding or removing the option from the array
              // depending on whether the checkbox was already ticked or not
              onChange={() => {
                const newSelectedBoxes = selectedBoxes.includes(option)
                  ? selectedBoxes.filter(
                      (selectedOption) => selectedOption !== option,
                    )
                  : [...selectedBoxes, option];
                onChange(newSelectedBoxes);
              }}
              style={{
                width: size,
                height: size,
                margin: 0,
              }}
              className={boxColor}
            />
            {/* label for the checkbox */}
            <span
              style={{ fontSize: boxLabelFontSize }}
              className={`
                ${boxLabelColor}
                ${boxLabelFontWeight}
              `}
            >
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default CheckboxGroup;
