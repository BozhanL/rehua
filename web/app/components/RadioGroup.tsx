import type { CSSProperties, JSX } from 'react';

// interface for individual radio button
interface RadioButton<T extends string = string> {
  buttonOption: T; // value of radio button option
  buttonLabel: string; // label to accompany radio button
}

// interface for a group of radio buttons
interface RadioGroupProps<T extends string = string> {
  radioGroupName: string; // name attribute which groups radio buttons together
  options: RadioButton<T>[]; // array of radio button options
  selectedButton: T; // currently selected button
  onChange: (selectedButton: T) => void; // callback function to handle selection change
  size?: number; // size of radio button in pixels, fallback to 20px
  buttonColor?: string; // color of radio buttons, fallback to 'accent-rehua-navy'
  buttonLabelColor?: string; // color of button labels, fallback to 'text-rehua-navy'
  buttonLabelFontSize?: number; // font size of button labels in pixels, fallback to 50% of button size
  buttonLabelFontWeight?: string; // font weight of button labels, fallback to 'font-bold'
  buttonLabelPosition?: 'top' | 'bottom' | 'left' | 'right'; // fallback to 'bottom'
  direction?: 'horizontal' | 'vertical'; // layout direction of radio buttons, fallback to 'horizontal'
  gap?: number; // gap between radio buttons in pixels, fallback to 10px
  radioGroupStyle?: CSSProperties; // additional styles for the radio group container
  className?: string; // optional class name for the radio group container
}

// React component for rendering a styled group of radio buttons
function RadioGroup<T extends string = string>({
  radioGroupName,
  options,
  selectedButton,
  onChange,
  size = 20,
  buttonColor = 'accent-rehua-navy',
  buttonLabelColor = 'text-rehua-navy',
  buttonLabelFontSize = Math.round(size * 0.5),
  buttonLabelFontWeight = 'font-bold',
  buttonLabelPosition = 'bottom',
  direction = 'horizontal',
  gap = 10,
  radioGroupStyle,
  className,
}: Readonly<RadioGroupProps<T>>): JSX.Element {
  // converts buttonLabelPosition prop to corresponding CSS flexDirection value for layout
  const flexDirection = {
    top: 'column-reverse',
    bottom: 'column',
    left: 'row-reverse',
    right: 'row',
  }[buttonLabelPosition] as CSSProperties['flexDirection'];

  return (
    // outer div serves as radio button group container, applying flex layout and gap between buttons
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'horizontal' ? 'row' : 'column',
        gap,
        ...radioGroupStyle,
      }}
    >
      {/* maps over options array to render each radio button and its label */}
      {options.map((option) => {
        return (
          // label element wraps radio input and its label, allows label of button to be clickable
          <label
            key={option.buttonOption}
            style={{
              display: 'flex',
              flexDirection,
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            {/* radio input element */}
            <input
              type="radio"
              name={radioGroupName}
              value={option.buttonOption}
              checked={selectedButton === option.buttonOption}
              onChange={() => {
                onChange(option.buttonOption);
              }}
              style={{
                width: size,
                height: size,
                margin: 0,
              }}
              className={buttonColor}
            />
            {/* label for the radio button */}
            <span
              style={{ fontSize: buttonLabelFontSize }}
              className={`
                ${buttonLabelColor}
                ${buttonLabelFontWeight}
              `}
            >
              {option.buttonLabel}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default RadioGroup;
