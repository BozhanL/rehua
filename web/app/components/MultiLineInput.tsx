import type { JSX, TextareaHTMLAttributes } from 'react';

// React component that renders a normal, multi-line input, with flexible props and pre-set styling
function MultiLineInput({
  style,
  ...props
}: Readonly<TextareaHTMLAttributes<HTMLTextAreaElement>>): JSX.Element {
  return (
    <textarea
      {...props}
      className="bg-rehua-white"
      style={{
        width: '100%',
        fontSize: 24, // by default, height is determined based on font size
        padding: '0 10px', // spacing of the first letter of row and the front of the input box
        border: '1px solid',
        borderRadius: 6,
        boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.3)',
        outline: 'none', // no outline should appear upon selection
        resize: 'none', // no dynamic resizing
        ...style,
      }}
    ></textarea>
  );
}

export default MultiLineInput;
