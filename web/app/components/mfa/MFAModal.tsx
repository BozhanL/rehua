import ContentButton from '../common/ContentButton';
import type { IconProps } from '../common/Icon';
import Modal from '../common/Modal';
import PopUp from '../common/PopUp';
import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react/jsx-runtime';

interface MFAModalProps {
  open: boolean; // whether the modal is open or closed
  onBack: () => void; // call back function to let the parent handle the back button
  confirmButtonText1?: string;
  confirmButtonText2?: string;
  confirmButtonIcon?: IconProps['name'];
  onSubmitCode: (code: string) => void; // let parent component handle full /auth/login with username,password, and totpcode
  isSubmitting?: boolean;
}

function AddMFAModal({
  open,
  onBack,
  confirmButtonText1 = 'Login',
  confirmButtonText2,
  confirmButtonIcon = 'key',
  onSubmitCode,
  isSubmitting = false,
}: Readonly<MFAModalProps>): JSX.Element {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [errorOpen, setErrorOpen] = useState(false);

  //focus the input box when modal opens
  useEffect(() => {
    if (open) {
      inputRefs.current[0]?.focus();
    }
  }, [open]);

  function handleSubmit(): void {
    const code = inputRefs.current.map((el) => el?.value ?? '').join(''); // 1,2,3,4 = '1234'
    // validate length
    if (code.length !== 6) {
      setErrorOpen(true);
      return;
    }
    onSubmitCode(code);
  }

  function handlePaste(e: React.ClipboardEvent, index: number): void {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, ''); // strip non-digits
    if (!pasted) {
      return;
    }
    // fill starting from the box that was pasted into
    const chars = pasted.slice(0, 6 - index).split('');

    chars.forEach((char, offset) => {
      const targetIndex = index + offset;
      const input = inputRefs.current[targetIndex];
      if (input) {
        input.value = char;
      }
    });
    // focus the next empty box, or the last filled one if the code is complete
    const nextIndex = Math.min(index + chars.length, 5);
    inputRefs.current[nextIndex]?.focus();
  }

  function handleKeyPress(e: React.KeyboardEvent, index: number): void {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
        break;
      case 'ArrowRight':
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
        break;
      case 'Backspace':
      case 'Delete': {
        const currentValue = inputRefs.current[index]?.value;
        if (!currentValue && index > 0) {
          e.preventDefault();
          const prevInput = inputRefs.current[index - 1];
          if (prevInput) {
            prevInput.value = '';
          }
          prevInput?.focus();
        }
        break;
      }
      case 'Escape':
        e.preventDefault();
        onBack();
        break;
      case 'Enter':
        e.preventDefault();
        handleSubmit();
        return;
      default:
        return;
    }
  }

  return (
    <Modal surfaceProps={{ width: 700, height: 300 }} open={open}>
      {/* content div */}
      <div className="flex flex-col items-center justify-center gap-5">
        {/* headings */}
        <div className="flex w-full flex-col items-start gap-1 pl-8">
          <span className="mt-6 text-4xl font-bold text-rehua-maroon">
            Multi-Factor Authentication
          </span>
          <span className="mt-3 text-xl font-medium">
            Please enter in your 6-digit code:
          </span>
        </div>

        {/* input boxes */}
        <div className="flex gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              maxLength={1}
              inputMode="numeric"
              disabled={isSubmitting}
              className="
                size-20 rounded-3xl bg-rehua-light-gray text-center shadow-md
                shadow-rehua-dark-gray outline-none
                focus:border-rehua-maroon
              "
              style={{
                fontWeight: 800,
                fontSize: '35px',
              }}
              onChange={(e) => {
                const digit = e.target.value.replace(/\D/g, ''); // strip anything non-numeric
                e.target.value = digit;
                if (e.target.value && index < 5) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                handleKeyPress(e, index);
              }}
              onPaste={(e) => {
                handlePaste(e, index);
              }}
            />
          ))}
        </div>

        {/* buttons: go back and login/confirm */}
        <div className="mt-3 flex gap-60">
          <ContentButton
            text1="Go Back"
            onClick={() => {
              onBack();
            }}
            backgroundColor="bg-rehua-red"
            horizontalPadding={0.4}
            iconProps={{ name: 'circle-arrow' }}
            height={45}
          />

          <ContentButton
            text1={isSubmitting ? 'Checking...' : confirmButtonText1}
            text2={confirmButtonText2 ?? ''}
            backgroundColor="bg-rehua-green"
            onClick={() => {
              handleSubmit();
            }}
            horizontalPadding={0.5}
            height={45}
            iconProps={{ name: confirmButtonIcon }}
          />
        </div>
      </div>
      <PopUp
        isAlertPopup
        text1={'Please enter all 6 digits'}
        modalProps={{
          open: errorOpen,
        }}
        button1Props={{
          text1: 'Ok',
          backgroundColor: 'bg-rehua-green',
          onClick: () => {
            setErrorOpen(false);
          },
        }}
      />
    </Modal>
  );
}

export default AddMFAModal;
