'use client';
import Icon from './Icon';
import React, { useState, useRef, type JSX, useEffect } from 'react';

interface DropdownProps<T extends string = string> {
  options: T[]; // list of options to select
  selectedValues: T[]; // Either one or multiple element array depending on multiple flag
  onChange: (newValues: T[]) => void; // Callback function to handle new list of selected values
  multiple?: boolean;
  search?: boolean; // Render a search bar
  defaultText?: string; // Default text in the expand dropdown button
  width?: number; // Width in pixels
  lengthOfDropdown?: number; // argument for maxHeight style for dropdown
  selectedColor?: string; // Tailwind CSS string for the colour of the selected option
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
  const [isOpen, setIsOpen] = useState(false); // dropdown open/closed
  const [query, setQuery] = useState(''); // search query
  const [activeIndex, setActiveIndex] = useState(-1);
  const listBoxRef = useRef<HTMLDivElement>(null); // reference to dropdown box - to enable keyboard interaction (esc,up,down)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]); // reference to an array of buttons (dropdown items)
  const wrapperRef = useRef<HTMLDivElement>(null); // reference to the whole dropdown

  // focus the inner dropdown box to handle keyboard interaction
  useEffect(() => {
    if (isOpen && !search) {
      listBoxRef.current?.focus();
    }
  }, [isOpen, search]);

  // Close dropdown when click or touch outside of the wider dropdown wrapper
  useEffect(() => {
    if (!isOpen) return;
    // While dropdown is open check each click for any outside of the dropdown wrapper
    function handleOutsideInteraction(e: PointerEvent): void {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
        setQuery('');
      }
    }
    document.addEventListener('pointerdown', handleOutsideInteraction);
    return (): void => {
      document.removeEventListener('pointerdown', handleOutsideInteraction);
    };
  }, [isOpen]);

  // Helper functions to handle arrow key presses
  function handleUpArrow(length: number): void {
    const newIndex = (activeIndex + length - 1) % length; // length is added to handle negative numbers because in js (-1 % 5 = -1 ) not 4
    setActiveIndex(newIndex);
    const button = buttonRefs.current[newIndex];
    if (button !== undefined) {
      button?.scrollIntoView({ block: 'nearest' });
    }
  }
  function handleDownArrow(length: number): void {
    const newIndex = (activeIndex + 1) % length;
    setActiveIndex(newIndex);
    const button = buttonRefs.current[newIndex];
    if (button !== undefined) {
      button?.scrollIntoView({ block: 'nearest' });
    }
  }

  function handleKeyPress(e: React.KeyboardEvent): void {
    const length = filteredOptions.length;
    if (length === 0) return;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleUpArrow(length);
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleDownArrow(length);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[activeIndex] !== undefined && activeIndex !== -1) {
          handleOptionClick(filteredOptions[activeIndex]);
          break;
        }
        return;
      default:
        return;
    }
  }

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

    onChange(newValue); // return new values to parent component
  }

  function toggleOpen(): void {
    const next = !isOpen;
    setIsOpen(next);
    if (!next) {
      setActiveIndex(-1); // reset active index
      setQuery(''); // reset filter when closing
    }
  }

  const filteredOptions = search
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

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
        <span className="block min-w-0 truncate" style={{}}>
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
          {search && (
            // add search box at the top of dropdown bar if dev specifies
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
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-1 text-gray-400">No results</div>
          ) : (
            // render each option as a button
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
                    ${!isSelected && activeIndex === index ? 'bg-rehua-light-gray' : ''}
                  `}
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
                  {/* Render checkboxes to denote selection */}
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
                  <span className="truncate">{option}</span>
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
