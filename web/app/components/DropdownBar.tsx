// input :
// list of items that you can click on
// must allow default text that is rendered if nothign is selected
import Icon from './Icon';
import { useState } from 'react';
import type { JSX } from 'react/jsx-runtime';

// properties
// must be resizeable (width on the screen)
// must allow for different options to be selected
// if different options selected, render them all with overflow hidden inside the box

interface DropdownProps<T extends string = string> {
  options: T[]; // list of options to select
  selectedValues?: T[]; // values that have been selected from dropdown
  multiple?: boolean; // flag to check whether multiple values can be selected
  defaultText?: string; // if nothing selected initially , what to display
  onChange?: (newValue: T[]) => void; // return the new list of selected items
  width?: number; // change width, default to
}

function DropdownBar<T extends string = string>({
  options,
  selectedValues,
  multiple = false,
  defaultText = 'Select',
  onChange,
  width = 32,
}: Readonly<DropdownProps<T>>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false); // if button is selected, show dropdown

  // helper function to handle
  function handleOptionClick(option: T): void {
    let newValue: T[];

    if (selectedValues === undefined) {
      return;
    }

    if (!multiple) {
      // single-select: the new selection is just this one item, nothing else
      newValue = [option];
      setIsOpen(false); // close popup after selection
    } else if (selectedValues.includes(option)) {
      // multi-select, already selected: remove it (toggle off)
      newValue = selectedValues.filter((item) => item !== option);
    } else {
      // multi-select, not selected yet: add it (toggle on)
      newValue = [...selectedValues, option];
    }
    // return the new selected values to parent component
    onChange?.(newValue);
  }
  return (
    <div className="relative inline-block">
      <button
        className="border-2 border-amber-300 "
        type="button"
        style={{ width }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {/* Display the selected values or default text on dropdown bar */}
        <span className="block overflow-hidden text-ellipsis">
          {!selectedValues?.length ? defaultText : selectedValues.join(', ')}
        </span>
        <Icon name="simple-arrow" rotation={90} width={10} />
      </button>
      {/* Render options in dropdown bar */}
      {isOpen && (
        <div className="absolute top-full left-0 z-10 bg-white shadow-md ">
          {options.map((option) => (
            <div key={option}>
              <button
                type="button"
                className="border-2 border-b-blue-900 w-full text-left"
                onClick={() => {
                  handleOptionClick(option);
                }}
              >
                {option}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DropdownBar;
