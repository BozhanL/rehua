import ContentButton from '../ContentButton';
import Modal from '../Modal';
import { useRef } from 'react';
import type { JSX } from 'react/jsx-runtime';

interface MFAModalProps {
  open: boolean;
  onBack: () => void; // call back function
}

function AddMFAModal({ open, onBack }: Readonly<MFAModalProps>): JSX.Element {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  //TODO:
  // auth + popups
  //
  return (
    <Modal surfaceProps={{ width: 700, height: 300 }} open={open}>
      <div className="flex flex-col items-center justify-center gap-5">
        <span className="mt-4 mr-3 text-4xl font-bold text-rehua-maroon">
          Multi-Factor Authentication
        </span>

        <span className="font-light">Please enter in your 6-digit code:</span>

        <div className="flex gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              maxLength={1}
              inputMode="numeric"
              className="
                size-20 rounded-3xl bg-rehua-gray text-center text-7xl
                font-extrabold drop-shadow-zinc-800
                focus:border-rehua-maroon
              "
              onChange={(e) => {
                if (e.target.value && index < 5) {
                  inputRefs.current[index + 1]?.focus();
                }
              }}
            />
          ))}
        </div>

        <div className="flex gap-60">
          <ContentButton
            text1="Go Back"
            onClick={() => {
              onBack();
            }}
            backgroundColor="bg-rehua-red"
            horizontalPadding={0.4}
            iconProps={{ name: 'circle-arrow' }}
          />

          <ContentButton
            text1="Login"
            backgroundColor="bg-rehua-green"
            onClick={() => {
              //TO DO
              //login logic
            }}
            horizontalPadding={0.4}
            iconProps={{ name: 'key' }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddMFAModal;
