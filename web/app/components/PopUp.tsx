'use client';

import ContentButton, { type ContentButtonProps } from './ContentButton';
import Icon from './Icon';
import Modal, { type ModalProps } from './Modal';
import type { CSSProperties, JSX } from 'react';

interface PopUpProps {
  isAlertPopup: boolean;

  text1: string;
  text1Style?: CSSProperties;

  text2?: string;
  text2Style?: CSSProperties;

  button1Props: ContentButtonProps;
  button2Props?: ContentButtonProps;

  modalProps: ModalProps;
}

function PopUp({
  isAlertPopup,
  text1,
  text1Style,
  text2,
  text2Style,
  button1Props,
  button2Props,
  modalProps,
}: Readonly<PopUpProps>): JSX.Element {
  const icon = isAlertPopup ? (
    <Icon name="alert" className="text-rehua-red" width={40} />
  ) : (
    <Icon name="info-circle" className="text-rehua-navy" width={40} />
  );

  return (
    <Modal {...modalProps}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          //gap: 16,
          minHeight: '100%',
        }}
      >
        {icon}
        <span style={text1Style}>{text1}</span>
        {text2 && <span style={text2Style}>{text2}</span>}

        <div
          style={{
            display: 'flex',
            justifyContent: button2Props ? 'space-between' : 'center',
            //gap: 16,
            width: '100%',
          }}
        >
          <ContentButton {...button1Props} />
          {button2Props && <ContentButton {...button2Props} />}
        </div>
      </div>
    </Modal>
  );
}

export default PopUp;
