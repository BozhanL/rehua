'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import MFAModal from '@/app/components/mfa/MFAModal';
import { getTotpData } from '@/app/utils/auth';
import { HttpError } from '@rehua/sdk';
import { QRCodeSVG } from 'qrcode.react';
import { useState, type JSX } from 'react';

// the QR code is at most 400px, and shrinks to fit narrow or short screens
const qrCodeWidth = 'min(100%, 400px, 40dvh)';

// the API responds with 400 "Invalid TOTP code" when the code does not match the secret
export function isInvalidTotpCodeError(error: unknown): boolean {
  return error instanceof HttpError && error.status === 400;
}

interface MFASetUpProps {
  title: string;
  label: string; // account name shown in the authenticator app (the user's email)
  onBack: () => void;
  // the page makes its own API call, this component awaits it to close the code entry or show a wrong code
  onSubmitCode: (totpCode: string, totpSecret: string) => Promise<unknown>;
}

// set-up steps, QR code and 6-digit code entry, shared by adding a new user and resetting a user's MFA
export default function MFASetUp({
  title,
  label,
  onBack,
  onSubmitCode,
}: Readonly<MFASetUpProps>): JSX.Element {
  // generate the TOTP secret once per visit, so a wrong code does not change the QR code
  const [totpData] = useState(() => getTotpData(label));
  const [isMFAOpen, setIsMFAOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mfaError, setMfaError] = useState<string | null>(null);
  const [mfaResetKey, setMfaResetKey] = useState(0);

  async function handleSubmitCode(code: string): Promise<void> {
    setMfaError(null);
    setIsSubmitting(true);

    try {
      await onSubmitCode(code, totpData.secret);
      setIsMFAOpen(false); // the page shows its own success popup
    } catch (error) {
      if (isInvalidTotpCodeError(error)) {
        setMfaError(
          'The code you entered was incorrect.\nPlease scan the QR code again.',
        );
      } else {
        setIsMFAOpen(false); // the page shows its own failure popup
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* back button and title, the title wraps on narrow screens */}
      <div className="mx-6 mt-6 mb-5 flex items-center gap-6 bg-rehua-white">
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          className="shrink-0"
          style={{ cursor: 'pointer' }}
        >
          <Icon name="circle-arrow" width={50} className="text-rehua-navy" />
        </button>

        <div className="flex min-w-0 items-center gap-3">
          <Icon name="lock-time" width={40} className="shrink-0" />
          <h1
            className="
              text-2xl font-bold
              md:text-3xl
            "
          >
            {title}
          </h1>
        </div>
      </div>

      {/* stacked on tablets and smaller, side by side on wider screens */}
      <div
        className="
          mx-6 flex flex-col items-center gap-10 pb-10
          md:mx-16
          lg:flex-row lg:items-start lg:justify-between
        "
      >
        {/* set-up steps */}
        <div
          className="
            flex max-w-3xl min-w-0 flex-col gap-6
            lg:mt-10
          "
        >
          <span
            className="
              text-2xl font-bold
              md:text-3xl
            "
          >
            Set-Up Steps:
          </span>
          <ol
            className="
              flex list-decimal flex-col gap-6 pl-8 text-xl/relaxed
              font-semibold
              md:gap-8 md:pl-10 md:text-2xl/relaxed
            "
          >
            <li>
              Install an Authenticator App on your personal device (e.g.
              Microsoft Authenticator or Google Authenticator)
            </li>
            <li>Set up an account on the authenticator app if required</li>
            <li>
              Scan the QR code using your personal device or manually enter in
              the code
            </li>
            <li>Enter in the digits you see on your personal device</li>
          </ol>
        </div>

        {/* QR code, secret for manual entry and next step button */}
        <div
          className="
            flex w-full flex-col items-center gap-5
            lg:w-100 lg:shrink-0
          "
        >
          <div style={{ width: qrCodeWidth }}>
            <QRCodeSVG
              value={totpData.uri}
              size={400}
              level="Q"
              title="Authenticator app QR code"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <span
            className="
              text-center text-2xl font-semibold break-all
              md:text-3xl
            "
            style={{ width: qrCodeWidth }}
          >
            {totpData.secret}
          </span>
          <ContentButton
            text1="Next Step"
            iconProps={{ name: 'circle-arrow', rotation: 180 }}
            iconPosition="left"
            horizontalPadding={0.4}
            textIconGap={0.3}
            height={70}
            backgroundColor="bg-rehua-green"
            className="text-3xl"
            onClick={() => {
              setMfaError(null);
              setMfaResetKey((prev) => prev + 1); // reopen the code entry with empty boxes
              setIsMFAOpen(true);
            }}
          />
        </div>
      </div>

      {/* 6-digit code entry */}
      <MFAModal
        key={mfaResetKey}
        open={isMFAOpen}
        onBack={() => {
          setIsMFAOpen(false);
          setMfaError(null);
        }}
        confirmButtonText1="Finish"
        confirmButtonText2="Set-Up"
        onSubmitCode={(code) => {
          void handleSubmitCode(code);
        }}
        isSubmitting={isSubmitting}
        mfaError={mfaError}
        onDismissError={() => {
          setMfaError(null);
        }}
      />
    </>
  );
}
