import type { InputHTMLAttributes, JSX } from 'react';

function SingleLineInput({
  style,
  ...props
}: Readonly<InputHTMLAttributes<HTMLElement>>): JSX.Element {
  return (
    <input
      {...props}
      className="bg-rehua-white"
      style={{
        width: '100%',
        fontSize: 24,
        padding: '0 10px',
        border: '1px solid',
        borderRadius: 6,
        boxShadow: 'inset 0 1px 3px rgb(0 0 0 / 0.3)',
        outline: 'none',
        ...style,
      }}
    />
  );
}

export default SingleLineInput;
