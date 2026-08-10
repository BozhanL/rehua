'use client';

import ContentButton, { type ContentButtonProps } from './ContentButton';
import Icon from './Icon';
import Modal, { type ModalProps } from './Modal';
import type { CSSProperties, JSX, ReactNode } from 'react';

interface PopUpProps {
  isAlertPopup?: boolean;
  text1: ReactNode;
  text1Style?: CSSProperties;
  text1ClassName?: string;
  text2?: ReactNode;
  text2Style?: CSSProperties;
  text2ClassName?: string;
  button1Props: ContentButtonProps;
  button2Props?: ContentButtonProps;
  buttonsStyle?: CSSProperties;
  defaultButtonHeight?: number;
  modalProps: ModalProps;
}

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
  const [popupColor, iconColor, iconName] = isAlertPopup
    ? ['text-rehua-red', 'text-rehua-ruby', 'alert' as const]
    : ['text-rehua-navy', 'text-rehua-navy', 'info-circle' as const];

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
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 20,
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
            width: '80%',
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
