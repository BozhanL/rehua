'use client';
import { useDropdown } from '../../hooks/useDropdown';
import Icon from './Icon';
import React, { useEffect, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';

interface DropdownProps<T extends string = string> {
  options: T[]; // list of options to select
  selectedValues: T[]; // either one or multiple element array depending on multiple flag
  onChange: (newValues: T[]) => void; // callback function to handle new list of selected values
  multiple?: boolean;
  search?: boolean; // render a search bar
  defaultText?: string; // default text in the expand dropdown button
  labelMode?: 'replace' | 'prefix'; // replace: selected values replace defaultText prefix: defaultText stays, selected values appended after it
  width?: number; // width in pixels
  size?: number; // controls overall scale (button height, font, icon), fallback 16
  lengthOfDropdown?: number; // argument for maxHeight style for dropdown
  selectedColor?: string; // tailwind CSS string for the colour of the selected option, applies to checkbox tick colour too
  checkboxColor?: string; // tailwind CSS accent class for the checkbox tick colour (multi-select), fallback 'accent-rehua-blue'
  textAlign?: 'left' | 'right' | 'center'; // fallback to 'left'
  style?: React.CSSProperties;
}
function DropdownBar<T extends string = string>({
  options,
  selectedValues,
  multiple = false,
  defaultText = 'Select',
  labelMode = 'replace',
  search = false,
  onChange,
  width = 200,
  lengthOfDropdown,
  selectedColor = 'bg-rehua-blue',
  checkboxColor = 'accent-rehua-blue',
  textAlign = 'left',
  size = 16,
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
    portalRef,
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

  // position of the dropdown menu relative to the viewport
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  // update the position of the dropdown menu when the dropdown is open and the wrapperRef is available
  useEffect(() => {
    if (!isOpen || !wrapperRef.current) {
      return;
    }

    function updateMenuPosition(): void {
      const rect = wrapperRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      setMenuPosition({
        top: rect.bottom,
        left: rect.left,
      });
    }

    // set initial position when dropdown opens
    updateMenuPosition();

    // keep the dropdown aligned through resizing and scrolling
    window.addEventListener('scroll', updateMenuPosition, true);
    window.addEventListener('resize', updateMenuPosition);

    return (): void => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [isOpen, wrapperRef]);

  const fontSize = size;
  const iconSize = Math.round(size * 0.6);
  const checkBoxSize = Math.round(size * 0.8);
  const paddingY = Math.round(size * 0.25);

  // Label shown on the dropdown bar button
  let label = defaultText;
  if (selectedValues.length) {
    label =
      labelMode === 'prefix' && defaultText
        ? `${defaultText} ${selectedValues.join(', ')}`
        : selectedValues.join(', ');
  }

  return (
    <div className="relative inline-block" style={style} ref={wrapperRef}>
      {/* dropdown bar button */}
      <button
        className={`
          flex items-center justify-between gap-2 rounded-sm border
          border-rehua-gray bg-rehua-white p-1
        `}
        style={{
          width,
          paddingBlock: paddingY,
          paddingInline: paddingY,
        }}
        type="button"
        onClick={toggleOpen}
      >
        {/* dropdown bar label */}
        <span className="block min-w-0 truncate" style={{ fontSize: fontSize }}>
          {label}
        </span>
        {/* dropdown bar arrow */}
        <Icon
          name="dropdown-arrow"
          width={iconSize}
          className="mr-1 shrink-0"
        />
      </button>

      {/* options in dropdown bar  (list of buttons) */}
      {isOpen &&
        createPortal(
          <div
            tabIndex={0}
            ref={(element) => {
              listBoxRef.current = element;
              portalRef.current = element;
            }}
            onKeyDown={(e) => {
              handleKeyPress(e);
            }}
            className="
              fixed z-40 overflow-x-hidden overflow-y-auto bg-rehua-white
              shadow-md outline-none
            "
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              maxHeight: lengthOfDropdown,
            }}
          >
            {/* Render search box if specified */}
            {search && (
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                style={{
                  width: width,
                  fontSize: fontSize,
                }}
                placeholder="Search..."
                className="w-full p-2 outline-none"
              />
            )}

            {/* buttons (dropdown options) */}
            {filteredOptions.length === 0 ? (
              <div
                className="px-2 text-rehua-dark-gray"
                style={{ paddingBlock: paddingY, fontSize: fontSize }}
              >
                No results
              </div>
            ) : (
              // each option as a button
              filteredOptions.map((option, index) => {
                const isSelected = selectedValues.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    className={`
                      flex w-full items-center gap-2 pl-2 outline-none
                      ${isSelected && !multiple ? selectedColor : ''}
                      ${(multiple || !isSelected) && activeIndex === index ? 'bg-rehua-light-gray' : ''}
              `}
                    // set logical reference to each new button for keyboard interaction
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
                    {/* checkboxes to denote selection (only for multiple dropdowns) */}
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly // selection is driven by the parent button's onClick, not this input directly
                        tabIndex={-1} // keep it out of tab order; keyboard nav already handled by handleKeyPress
                        className={`
                          shrink-0
                          ${checkboxColor}
                        `}
                        style={{
                          width: checkBoxSize,
                          height: checkBoxSize,
                          margin: 0,
                        }}
                      />
                    )}

                    {/* option text inside button, with padding if single input */}
                    <span
                      style={{ fontSize: fontSize }}
                      className={`
                        truncate
                        ${!multiple ? 'pl-2' : ''}
                      `}
                    >
                      {option}
                    </span>
                  </button>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default DropdownBar;
