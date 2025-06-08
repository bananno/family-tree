import React, { useState, useEffect } from 'react';

import Filter from 'shared/Filter';
import { useFilter } from 'shared/FilterContext';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';
import Modal from 'shared/Modal';
import useTags from 'tag/hooks/useTags';

const filterId = 'tag-picker-filter';

// Choose a tag and attach it to an item, or edit the value of an existing attachment.
// tagAttachment = (edit) the tag whose value is being edited.
// tagAttachments = (add) already attached, so they cannot be added again.
// modelName = (add) e.g. "people", for fetching the allowed tags.
// onSubmit = accepts the tag ID to attach to the item.
export default function TagAttachmentModal({
  tagAttachment,
  tagAttachments = [],
  modelName,
  onSubmit,
  onCancel,
}) {
  const isNew = !tagAttachment;

  const { clearFilter } = useFilter();
  const [selectedTag, setSelectedTag] = useState('');
  const [tagValue, setTagValue] = useState(tagAttachment?.value || '');

  function handleSelectedTagChange(newTag) {
    setSelectedTag(newTag);
    setTagValue('');
  }

  async function handleConfirm() {
    if (isNew) {
      await onSubmit(selectedTag.id, tagValue);
    } else {
      await onSubmit(tagValue);
    }

    setSelectedTag('');
    clearFilter(filterId);
  }

  const displayedTag = isNew ? selectedTag : tagAttachment;

  // For create mode, there must be a tag selected and a value if required.
  // For edit mode, ignore the selected tag but still require the value.
  const isValid =
    (!isNew || !!selectedTag) &&
    (!displayedTag.expectsValue || tagValue.trim() !== '');

  // For create mode, the modal manages its own state internally.
  // For edit mode, the modal is managed by the parent.
  const open = isNew ? undefined : true;

  return (
    <Modal
      title={isNew ? 'Add Tag' : 'Edit tag'}
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      triggerButtonLabel="Add Tag"
      confirmButtonLabel={isNew ? 'Attach' : 'Save'}
      open={open}
      onCancel={isNew ? undefined : onCancel}
    >
      {/* Width ensures the modal stays the same size when description comes and goes */}
      <FormSection label="Tag" style={{ width: '500px' }}>
        {isNew ? (
          <TagPicker
            value={selectedTag.id}
            setValue={handleSelectedTagChange}
            tagAttachments={tagAttachments}
            modelName={modelName}
          />
        ) : (
          tagAttachment.title
        )}
      </FormSection>
      {displayedTag?.definition && (
        <FormSection style={{ width: '500px' }} label="Definition">
          {displayedTag.definition}
        </FormSection>
      )}
      {displayedTag?.expectsValue && (
        <FormSection label="Value">
          <ValueField
            tag={displayedTag}
            value={tagValue}
            setValue={setTagValue}
          />
        </FormSection>
      )}
    </Modal>
  );
}

////////////////////

function TagPicker({ value, setValue, tagAttachments, modelName }) {
  const { getFilterContent } = useFilter();

  const { tags: allowedTags } = useTags({
    allowedForModel: modelName,
    filterId,
  });

  const excludeIds = tagAttachments.map(tag => tag.id);
  const availableTags = allowedTags.filter(tag => !excludeIds.includes(tag.id));

  const filterActive = getFilterContent(filterId) !== '';
  const showEmptyOption = !filterActive;

  useEffect(() => {
    // The select tag has been filtered out, or the filter has been applied
    // for the first time and the empty option is now hidden.
    // Prior to applying the filter, allow the selection to be empty.
    // After clearing the filter, leave the selection as is.
    if (filterActive && !availableTags.find(tag => tag.id === value)) {
      setValue(availableTags[0] || '');
    }
  }, [filterActive, availableTags]);

  function handleChange(newId) {
    setValue(availableTags.find(tag => tag.id === newId));
  }

  return (
    <>
      <Filter filterId={filterId} />
      <br />
      <Select
        onChange={handleChange}
        value={value}
        disabled={availableTags.length === 0}
      >
        {showEmptyOption && <option value="">select</option>}
        {availableTags.map(tag => (
          <option key={tag.id} value={tag.id}>
            {tag.title}
          </option>
        ))}
      </Select>
    </>
  );
}

function ValueField({ tag, value, setValue }) {
  if (tag.valueOptions) {
    return (
      <Select value={value} onChange={setValue}>
        <option value="">select value</option>
        {tag.valueOptions.map(opt => (
          <option value={opt} key={opt}>
            {opt}
          </option>
        ))}
      </Select>
    );
  }
  return <Input value={value} onChange={setValue} />;
}
