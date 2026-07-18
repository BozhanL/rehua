import ContentButton from '@/app/components/ContentButton';
import Modal from '@/app/components/Modal';
import type { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import { useState, type JSX } from 'react';

interface AddSectionModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (name: string, content: JSONSchema7Definition) => void;
}

export default function AddSectionModal({
  open,
  onCancel: onClose,
  onSave: onSubmit,
}: Readonly<AddSectionModalProps>): JSX.Element {
  const [name, setName] = useState('');
  const [type, setType] = useState<JSONSchema7TypeName>('string');

  return (
    <Modal open={open}>
      <div className="flex flex-col gap-4 p-4">
        <h2>Add Section</h2>

        <input
          value={name}
          placeholder="Section name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as JSONSchema7TypeName);
          }}
        >
          <option value="string">String</option>
          <option value="integer">Integer</option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
        </select>

        <div className="flex gap-2">
          <ContentButton type="button" text1="Cancel" onClick={onClose} />

          <ContentButton
            type="button"
            text1="Add"
            onClick={() => {
              onSubmit(name, { type });

              setName('');
              setType('string');
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
