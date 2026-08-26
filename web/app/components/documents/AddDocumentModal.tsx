import ContentButton from '../common/ContentButton';
import Icon from '../common/Icon';
import Modal from '../common/Modal';
import SingleLineInput from '../common/SingleLineInput';
import { useState, type JSX } from 'react';

interface AddDocumentModalProps {
  isOpen: boolean;
  onBack: () => void; // let the parent handle the back button, matches AddMFAModal
  onSelectCategory: (
    category: 'long-term' | 'palliative' | 'short-term' | 'daycare',
  ) => void;
  onUpload: () => void;
}

function AddDocumentModal({
  isOpen,
  onBack,
}: Readonly<AddDocumentModalProps>): JSX.Element {
  const [category, setCategory] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(
    'Add a New Patient Document',
  );
  const [searchQuery, setSearchQuery] = useState<string | null>(null);

  function handleSwitch(category: string | null): void {
    const label = category ? 'Pick a Template' : 'Add a New Patient Document';
    setCategory(category);
    setLabel(label);
  }

  return (
    <Modal open={isOpen} surfaceProps={{ width: 600, height: 500 }}>
      {/* content wrapper */}
      <div className="flex flex-col gap-6 px-8 py-6">
        {/* header row */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => {
              if (category === null) {
                onBack();
              } else {
                handleSwitch(null);
              }
            }}
            aria-label="Go back"
            className="shrink-0"
          >
            <Icon name="circle-arrow" color="text-rehua-blue" width={37} />
          </button>
          <Icon name="folder" color="bg-rehua-maroon" width={33} />
          <span className="text-3xl font-bold text-rehua-maroon">{label}</span>
        </div>
        {/* category buttons */}

        <div className="flex">
          {category === null ? (
            <div className="grid w-full grid-cols-2 gap-3">
              <ContentButton
                text1="Long"
                text2="Term"
                iconProps={{ name: 'plus' }}
                iconPosition="right"
                height={70}
                backgroundColor="bg-rehua-green"
                onClick={() => {
                  handleSwitch('long-term');
                }}
              />
              <ContentButton
                text1="Palliative"
                iconProps={{ name: 'plus' }}
                iconPosition="right"
                height={70}
                backgroundColor="bg-rehua-pastel-pink"
                onClick={() => {
                  handleSwitch('palliative');
                }}
              />
              <ContentButton
                text1="Short"
                text2="Term"
                iconProps={{ name: 'plus' }}
                iconPosition="right"
                height={70}
                backgroundColor="bg-rehua-blue"
                onClick={() => {
                  handleSwitch('short-term');
                }}
              />
              <ContentButton
                text1="Daycare"
                iconProps={{ name: 'plus' }}
                iconPosition="right"
                height={70}
                backgroundColor="bg-rehua-orange"
                onClick={() => {
                  handleSwitch('daycare');
                }}
              />
              <ContentButton
                text1="Upload"
                iconProps={{ name: 'file-upload' }}
                iconPosition="right"
                backgroundColor="bg-rehua-navy"
                height={65}
                onClick={() => {
                  //handle upload document (pdf) similar to bozhan
                }}
                className="col-span-2 mx-auto w-1/2"
              />
            </div>
          ) : (
            // search bar and button
            <div>
              <div className="flex">
                <SingleLineInput
                  defaultValue={'Enter Template Name Here'}
                  onKeyDown={(e) => {
                    setSearchQuery(e);
                  }}
                  width={300}
                />
                <ContentButton
                  backgroundColor="bg-rehua-navy"
                  iconProps={{ name: 'search' }}
                  text1="Search"
                  onClick={() => {
                    // filter list of options with searchQuery
                  }}
                />
              </div>
              {/* list of options */}
              {/* api call */}
              {}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AddDocumentModal;
