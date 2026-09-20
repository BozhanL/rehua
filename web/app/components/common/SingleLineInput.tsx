import type { InputHTMLAttributes, JSX } from 'react';

// React component that renders single line input, with flexible props and pre-set styling
function SingleLineInput({
  style,
  ...props
}: Readonly<InputHTMLAttributes<HTMLInputElement>>): JSX.Element {
  return (
    <input
      {...props}
      className="bg-rehua-white"
      style={{
        width: '100%',
        fontSize: 20, // by default, height is determined based on font size
        padding: '0 10px', // spacing of the first letter and the front of the input box
        border: '1px solid',
        borderRadius: 6,
        boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.3)',
        outline: 'none', // no outline should appear upon selection
        ...style,
      }}
    />
  );
}

export default SingleLineInput;
