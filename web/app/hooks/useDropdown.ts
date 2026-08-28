import { useState, useRef, useEffect } from 'react';
import type { Dispatch, SetStateAction, RefObject } from 'react';

// handle state and interactivity for DropdownBar component

// Return type
interface UseDropdownReturn<T extends string = string> {
  isOpen: boolean;
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  activeIndex: number;
  listBoxRef: RefObject<HTMLDivElement | null>;
  buttonRefs: RefObject<(HTMLButtonElement | null)[]>;
  wrapperRef: RefObject<HTMLDivElement | null>;
  portalRef: RefObject<HTMLDivElement | null>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleOptionClick: (option: T) => void;
  toggleOpen: () => void;
  filteredOptions: T[];
}
// Input props for Dropdownbar
interface UseDropdownProps<T extends string = string> {
  options: T[];
  selectedValues: T[];
  onChange: (newValues: T[]) => void;
  multiple?: boolean;
  search?: boolean;
}

// Handle state
export function useDropdown<T extends string = string>({
  options,
  selectedValues,
  onChange,
  multiple = false,
  search = false,
}: UseDropdownProps<T>): UseDropdownReturn<T> {
  const [isOpen, setIsOpen] = useState(false); // dropdown open/closed
  const [query, setQuery] = useState(''); // search query
  const [activeIndex, setActiveIndex] = useState(-1);

  const listBoxRef = useRef<HTMLDivElement>(null); // reference to dropdown box - to enable keyboard interaction (esc,up,down)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]); // reference to an array of buttons (dropdown items)
  const wrapperRef = useRef<HTMLDivElement>(null); // reference to the whole dropdown
  const portalRef = useRef<HTMLDivElement>(null); // reference to the dropdown portal

  // focus the inner dropdown box to handle keyboard interaction
  useEffect(() => {
    if (isOpen && !search) {
      listBoxRef.current?.focus();
    }
  }, [isOpen, search]);

  // Close dropdown when click or touch outside of the wider dropdown wrapper
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // While dropdown is open check each click for any outside of the dropdown wrapper
    function handleOutsideInteraction(e: PointerEvent): void {
      if (
        wrapperRef.current &&
        portalRef.current &&
        !wrapperRef.current.contains(e.target as Node) &&
        !portalRef.current.contains(e.target as Node)
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
    if (length === 0) {
      return;
    }
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

  //Return state to dropdown bar component for rendering
  return {
    isOpen: isOpen,
    query: query,
    setQuery: setQuery,
    activeIndex: activeIndex,
    listBoxRef: listBoxRef,
    buttonRefs: buttonRefs,
    wrapperRef: wrapperRef,
    portalRef: portalRef,
    handleKeyPress: handleKeyPress,
    handleOptionClick: handleOptionClick,
    toggleOpen: toggleOpen,
    filteredOptions: filteredOptions,
  };
}
