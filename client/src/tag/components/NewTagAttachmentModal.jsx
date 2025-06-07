import React, { useState, useEffect } from 'react';

import Filter from 'shared/Filter';
import { useFilter } from 'shared/FilterContext';
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

  const isValid = !!selectedTag;

  function handleChange(newId) {
    setSelectedTag(availableTags.find(tag => tag.id === newId));
  }

  async function handleConfirm() {
    await onSubmit(selectedTag.id);
    setSelectedTag('');
    clearFilter(filterId);
  }

  return (
    <Modal
      title="Add Tag"
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      triggerButtonLabel="Add Tag"
    >
      <Filter filterId={filterId} />
      <br />
      <Select
        onChange={handleChange}
        value={selectedTag.id}
        disabled={availableTags.length === 0}
      >
        {showEmptyOption && <option value="">Select a tag</option>}
        {availableTags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.title}
          </option>
        ))}
      </Select>
      <p style={{ width: '500px' }}>
        {selectedTag?.definition && <b>Definition: </b>}
        {selectedTag?.definition}
      </p>
    </Modal>
  );
}
