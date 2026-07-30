'use client';
import { useDropdown } from '../hooks/useDropdown';
import Icon from './Icon';
import React, { type JSX } from 'react';

interface DropdownProps<T extends string = string> {
  options: T[]; // list of options to select
  selectedValues: T[]; // Either one or multiple element array depending on multiple flag
  onChange: (newValues: T[]) => void; // Callback function to handle new list of selected values
  multiple?: boolean;
  search?: boolean; // Render a search bar
  defaultText?: string; // Default text in the expand dropdown button
  width?: number; // Width in pixels
  lengthOfDropdown?: number; // argument for maxHeight style for dropdown
  selectedColor?: string; // Tailwind CSS string for the colour of the selected option, applies to checkbox tick colour too
  textAlign?: 'left' | 'right' | 'center'; // fallback to 'left'
  style?: React.CSSProperties;
}
function DropdownBar<T extends string = string>({
  options,
  selectedValues,
  multiple = false,
  defaultText = 'Select',
  search = false,
  onChange,
  width = 124,
  lengthOfDropdown,
  selectedColor = 'bg-rehua-blue',
  textAlign = 'left',
  style,
}: Readonly<DropdownProps<T>>): JSX.Element {
  // Calls custom useDropdown hook to handle state and logic
  const {
    isOpen,
    query,
    setQuery,
    activeIndex,
    listBoxRef,
    buttonRefs,
    wrapperRef,
    handleKeyPress,
    handleOptionClick,
    toggleOpen,
    filteredOptions,
  } = useDropdown({
    options,
    selectedValues,
    onChange,
    multiple,
    search,
  });

  // Render the dropdown
  return (
    <div className="relative inline-block" style={style} ref={wrapperRef}>
      <button
        className={`
          flex items-center justify-between gap-2 rounded-sm border
          border-rehua-gray p-1
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dropdown-listbox"
        type="button"
        style={{ width }}
        onClick={toggleOpen}
      >
        {/* Display the selected values or default text on dropdown bar */}
        <span className="block min-w-0 truncate">
          {!selectedValues.length ? defaultText : selectedValues.join(', ')}
        </span>
        <Icon name="simple-arrow" rotation={90} width={10} />
      </button>

      {/* Render options in dropdown bar  (list of buttons) */}
      {isOpen && (
        <div
          tabIndex={0}
          ref={listBoxRef}
          id="dropdown-listbox"
          role="listbox"
          aria-multiselectable={multiple}
          onKeyDown={(e) => {
            handleKeyPress(e);
          }}
          className="
            absolute top-full left-0 z-10 overflow-x-hidden overflow-y-auto
            bg-white shadow-md outline-none
          "
          style={{
            maxHeight: lengthOfDropdown,
          }}
        >
          {/* Render search box if specified */}
          {search && (
            <input
              autoFocus // Auto focus search bar when dropdown opens
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
          {/* Render buttons (dropdown options) */}
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1 text-gray-400">No results</div>
          ) : (
            // Render each option as a button
            filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option);
              return (
                <button
                  key={option}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  className={`
                    flex w-full items-center gap-2 outline-none
                    ${isSelected && !multiple ? selectedColor : ''}
                    ${(multiple || !isSelected) && activeIndex === index ? 'bg-rehua-light-gray' : ''}
                  `}
                  // Set logical reference to each new button for keyboard interaction
                  ref={(e) => {
                    buttonRefs.current[index] = e;
                  }}
                  style={{
                    width: width,
                    textAlign: textAlign,
                  }}
                  onClick={() => {
                    handleOptionClick(option);
                  }}
                >
                  {/* Render checkboxes to denote selection (only for multiple dropdowns) */}
                  {multiple && (
                    <span
                      className={`
                        flex size-4 shrink-0 items-center justify-center
                        rounded-sm border border-rehua-gray
                        ${
                          isSelected
                            ? `
                              ${selectedColor}
                              border-transparent
                            `
                            : 'bg-white'
                        }
                      `}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 16 16"
                          width="10"
                          height="10"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8l3.5 3.5L13 5" />
                        </svg>
                      )}
                    </span>
                  )}
                  {/* Render option text inside button, with padding if single input*/}
                  <span
                    className={`
                      truncate
                      ${!multiple ? 'pl-1' : ''}
                    `}
                  >
                    {option}
                  </span>
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
