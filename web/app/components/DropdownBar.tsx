'use client';
import Icon from './Icon';
import { useState, type JSX } from 'react';

interface DropdownProps<T extends string = string> {
  options: T[]; // list of options to select
  selectedValues?: T[]; // Either one or multiple element array depending on multiple flag
  multiple?: boolean;
  search?: boolean; // Render a search bar
  defaultText?: string; // Default text in the expand dropdown button
  onChange?: (newValues: T[]) => void; // Callback function to handle new list of selected values
  width?: number; // Width in pixels
  lengthOfDropdown?: number; // argument for maxHeight style for dropdown
  selectedColor?: string; // Tailwind CSS string for the colour of the selected option
  textAlign?: 'left' | 'right' | 'center'; // determines how text is aligned, fallback to 'left'
  style?: React.CSSProperties;
}

function DropdownBar<T extends string = string>({
  options,
  selectedValues = [],
  multiple = false,
  defaultText = 'Select',
  search = false,
  onChange,
  width = 32,
  lengthOfDropdown,
  selectedColor = 'bg-rehua-blue',
  textAlign = 'left',
  style,
}: Readonly<DropdownProps<T>>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false); // dropdown open/closed
  const [query, setQuery] = useState(''); // search query

  // helper function to handle selecting options in the dropdown
  function handleOptionClick(option: T): void {
    let newValue: T[];

    // 1) Single Select
    // 2) Multi Select, option clicked was already selected
    // 3) Multi Select, option clicked not selected
    if (!multiple) {
      newValue = [option];
      setIsOpen(false); // close popup after selection
    } else if (selectedValues.includes(option)) {
      newValue = selectedValues.filter((item) => item !== option);
    } else {
      newValue = [...selectedValues, option];
    }

    onChange?.(newValue); // return new values to parent component
  }

  function toggleOpen(): void {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) setQuery(''); // reset filter when closing
  }

  const filteredOptions = search
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  return (
    <div className="relative inline-block" style={style}>
      <button
        className={`
          flex items-center justify-between gap-2 rounded-sm border
          border-rehua-gray p-1
        `}
        type="button"
        style={{ width }}
        onClick={toggleOpen}
      >
        {/* Display the selected values or default text on dropdown bar */}
        <span className="block min-w-0 truncate" style={{}}>
          {!selectedValues.length ? defaultText : selectedValues.join(', ')}
        </span>
        <Icon name="simple-arrow" rotation={90} width={10} />
      </button>

      {/* Render options in dropdown bar  (list of buttons) */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 z-10 overflow-x-hidden overflow-y-auto
            bg-white shadow-md
          "
          style={{
            maxHeight: lengthOfDropdown,
          }}
        >
          {search && (
            // add search box at the top of dropdown bar if dev specifies
            <input
              autoFocus // Auto Select search bar when dropdown opens
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              style={{
                width: width,
              }}
              placeholder="Search..."
              className="w-full p-2 outline-none"
            />
          )}
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1 text-gray-400">No results</div>
          ) : (
            // render each option as a button
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  className={`
                    w-full
                    ${isSelected ? selectedColor : ''}
                  `}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: width,
                    textAlign: textAlign,
                  }}
                  onClick={() => {
                    handleOptionClick(option);
                  }}
                >
                  {option}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default DropdownBar;
