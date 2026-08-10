'use client';

import ContentButton, { type ContentButtonProps } from './ContentButton';
import Icon from './Icon';
import Modal, { type ModalProps } from './Modal';
import type { CSSProperties, JSX, ReactNode } from 'react';

// interface for PopUp component props
interface PopUpProps {
  isAlertPopup?: boolean; // colours + styling are preset depending on this value, fallback to false (informational)
  text1: ReactNode; // first line of text; apply multiple lines with /n or <br />
  text1Style?: CSSProperties;
  text1ClassName?: string;
  text2?: ReactNode; // second line of text; apply multiple lines with /n or <br />
  text2Style?: CSSProperties;
  text2ClassName?: string;
  button1Props: ContentButtonProps; // props for first button, mandatory
  button2Props?: ContentButtonProps; // props for second button, optional
  buttonsStyle?: CSSProperties; // additional styles for buttons div
  defaultButtonHeight?: number; // default height for buttons in pixels, fallback to 75px
  modalProps: ModalProps; // props for modal component (handles open/close state, background overlay, and surface props)
}

// React component that renders a popup with an icon, text, and buttons (underlying modal handles state)
function PopUp({
  isAlertPopup = false,
  text1,
  text1Style,
  text1ClassName,
  text2,
  text2Style,
  text2ClassName,
  button1Props,
  button2Props,
  buttonsStyle,
  defaultButtonHeight = 75,
  modalProps,
}: Readonly<PopUpProps>): JSX.Element {
  // determine colours and icon based on whether popup is an alert or informational
  const [popupColor, iconColor, iconName] = isAlertPopup
    ? ['text-rehua-red', 'text-rehua-ruby', 'alert' as const]
    : ['text-rehua-navy', 'text-rehua-navy', 'info-circle' as const];

  // default text styles for popup text, can be overridden/added to by text1Style and text2Style
  const defaultTextStyles: CSSProperties = {
    whiteSpace: 'pre-line',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 1.1,
    padding: 8,
  };

  return (
    <Modal {...modalProps}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', // horizontal centreing of content
          justifyContent: 'center', // vertical centreing of content
          textAlign: 'center', // aligns text centre
          gap: 20, // main gap between icon, text, and buttons
          minHeight: '100%',
        }}
      >
        <Icon
          name={iconName}
          className={iconColor}
          width={170}
          style={{ marginBottom: 15 }}
        />
        <div
          style={{
            ...defaultTextStyles,
            ...text1Style,
          }}
          className={`
            ${popupColor}
            ${text1ClassName ?? ''}
          `}
        >
          {text1}
        </div>
        {text2 && (
          <div
            style={{
              ...defaultTextStyles,
              ...text2Style,
            }}
            className={`
              ${popupColor}
              ${text2ClassName ?? ''}
            `}
          >
            {text2}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: button2Props ? 'space-between' : 'center',
            width: '80%', // controls width of buttons div
            marginTop: 35,
            ...buttonsStyle,
          }}
        >
          <ContentButton height={defaultButtonHeight} {...button1Props} />
          {button2Props && (
            <ContentButton height={defaultButtonHeight} {...button2Props} />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PopUp;
