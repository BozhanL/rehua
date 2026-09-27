'use client';
import ContentButton from '@/app/components/common/ContentButton';
import Icon from '@/app/components/common/Icon';
import MFAModal from '@/app/components/mfa/MFAModal';
import { getTotpData } from '@/app/utils/auth';
import { HttpError } from '@rehua/sdk';
import { QRCodeSVG } from 'qrcode.react';
import { useState, type JSX } from 'react';

// size of the QR code and width of the secret underneath it, in pixels
const qrCodeSize = 400;

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
      {/* back button and title */}
      <div
        className="
          mx-6 mt-6 mb-5 flex min-w-max items-center gap-6 bg-rehua-white
        "
      >
        <button
          type="button"
          aria-label="Go back"
          onClick={onBack}
          style={{ cursor: 'pointer' }}
        >
          <Icon name="circle-arrow" width={50} className="text-rehua-navy" />
        </button>

        <div className="flex gap-3">
          <Icon name="lock-time" width={40} />
          <h1 className="translate-y-1 text-3xl font-bold">{title}</h1>
        </div>
      </div>

      <div className="mx-16 flex flex-wrap justify-between gap-12 pb-10">
        {/* set-up steps */}
        <div className="mt-10 flex max-w-3xl flex-col gap-8">
          <span className="text-3xl font-bold">Set-Up Steps:</span>
          <ol
            className="
              flex list-decimal flex-col gap-8 pl-10 text-2xl/relaxed
              font-semibold
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
        <div className="flex flex-col items-center gap-5">
          <QRCodeSVG
            value={totpData.uri}
            size={qrCodeSize}
            level="Q"
            title="Authenticator app QR code"
          />
          <span
            className="text-center text-4xl font-semibold break-all"
            style={{ width: qrCodeSize }}
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
