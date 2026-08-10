'use client';

import ContentButton, { type ContentButtonProps } from './ContentButton';
import Icon from './Icon';
import Modal, { type ModalProps } from './Modal';
import type { CSSProperties, JSX } from 'react';

interface PopUpProps {
  isAlertPopup?: boolean;

  text1: string;
  text1Style?: CSSProperties;

  text2?: string;
  text2Style?: CSSProperties;

  button1Props: ContentButtonProps;
  button2Props?: ContentButtonProps;
  buttonsStyle?: CSSProperties;

  modalProps: ModalProps;
}

function PopUp({
  isAlertPopup = false,
  text1,
  text1Style,
  text2,
  text2Style,
  button1Props,
  button2Props,
  buttonsStyle,
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
  };

  const defaultButtonHeight = 75;

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
          style={{ marginBottom: 10 }}
        />
        <span
          style={{
            ...defaultTextStyles,
            ...text1Style,
          }}
          className={popupColor}
        >
          {text1}
        </span>
        {text2 && (
          <span
            style={{
              ...defaultTextStyles,
              ...text2Style,
            }}
            className={popupColor}
          >
            {text2}
          </span>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: button2Props ? 'space-between' : 'center',
            width: '70%',
            marginTop: 25,
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
