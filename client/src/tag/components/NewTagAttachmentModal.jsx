import React, { useState, useEffect } from 'react';

import Filter from 'shared/Filter';
import { useFilter } from 'shared/FilterContext';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';
import Modal from 'shared/Modal';
import useTags from 'tag/hooks/useTags';

const filterId = 'tag-picker-filter';

// Choose a tag and attach it to an item.
// attachedTags = already attached, so they cannot be selected now.
// modelName = e.g. "people", for fetching the allowed tags.
// onSubmit = accepts the tag ID to attach to the item.
export default function NewTagAttachmentModal({
  attachedTags,
  modelName,
  onSubmit,
}) {
  const { clearFilter, getFilterContent } = useFilter();
  const [selectedTag, setSelectedTag] = useState('');
  const [tagValue, setTagValue] = useState('');

  const { tags: allowedTags } = useTags({
    allowedForModel: modelName,
    filterId,
  });

  const excludeIds = attachedTags.map(tag => tag.id);
  const availableTags = allowedTags.filter(tag => !excludeIds.includes(tag.id));

  const filterActive = getFilterContent(filterId) !== '';
  const showEmptyOption = !filterActive;

  useEffect(() => {
    // The select tag has been filtered out, or the filter has been applied
    // for the first time and the empty option is now hidden.
    // Prior to applying the filter, allow the selection to be empty.
    // After clearing the filter, leave the selection as is.
    if (filterActive && !availableTags.find(tag => tag.id === selectedTag.id)) {
      setSelectedTag(availableTags[0] || '');
    }
  }, [filterActive, availableTags]);

  const isValid =
    !!selectedTag && (!selectedTag.expectsValue || tagValue.trim() !== '');

  function handleSelectedTagChange(newId) {
    setSelectedTag(availableTags.find(tag => tag.id === newId));
    setTagValue('');
  }

  async function handleConfirm() {
    await onSubmit({ tagId: selectedTag.id, tagValue });
    setSelectedTag('');
    clearFilter(filterId);
  }

  return (
    <Modal
      title="Add Tag"
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      triggerButtonLabel="Add Tag"
      confirmButtonLabel="Attach"
    >
      {/* Width ensures the modal stays the same size when description comes and goes */}
      <FormSection label="Choose tag" style={{ width: '500px' }}>
        <Filter filterId={filterId} />
        <br />
        <Select
          onChange={handleSelectedTagChange}
          value={selectedTag.id}
          disabled={availableTags.length === 0}
        >
          {showEmptyOption && <option value="">select</option>}
          {availableTags.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.title}
            </option>
          ))}
        </Select>
      </FormSection>
      {selectedTag?.definition && (
        <FormSection style={{ width: '500px' }} label="Definition">
          {selectedTag.definition}
        </FormSection>
      )}
      {selectedTag?.expectsValue && (
        <FormSection label="Value">
          {selectedTag.valueOptions ? (
            <Select value={tagValue} onChange={setTagValue}>
              <option value="">select value</option>
              {selectedTag.valueOptions.map(opt => (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              ))}
            </Select>
          ) : (
            <Input value={tagValue} onChange={setTagValue} />
          )}
        </FormSection>
      )}
    </Modal>
  );
}
