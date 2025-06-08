import React, { useState, useEffect } from 'react';

import Filter from 'shared/Filter';
import { useFilter } from 'shared/FilterContext';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';
import Modal from 'shared/Modal';
import useTags from 'tag/hooks/useTags';

const filterId = 'tag-attachment-modal-filter';

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

  const { existingValue, invalidSavedValueNote } =
    getExistingValueAndWarnings(tagAttachment);

  const { clearFilter } = useFilter();
  const [selectedTag, setSelectedTag] = useState('');
  const [tagValue, setTagValue] = useState(existingValue);

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

  // When editing existing an tag attachment, the value is editable if there's
  // a value, even if the tag no longer allows values.
  const showTagValueField = displayedTag?.expectsValue || tagAttachment?.value;

  // For create mode, there must be a tag selected and a value if required.
  // For edit mode:
  //    - ignore the selected tag, but still require the value.
  //    - if the tag doesn't expect a value, but a value was previously saved,
  //        deleting the value is the only action allowed.
  const tagIsValid = isNew ? !!selectedTag : true;
  const valueHasValue = tagValue.trim() !== '';
  const valueIsValid = displayedTag.expectsValue
    ? valueHasValue
    : !valueHasValue;
  const isValid = tagIsValid && valueIsValid;

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
      {showTagValueField && (
        <FormSection label="Value">
          <ValueField
            tag={displayedTag}
            value={tagValue}
            setValue={setTagValue}
          />
          {invalidSavedValueNote && (
            <p>
              <i>{invalidSavedValueNote}</i>
              <br />
              <i>Old value: </i> {tagAttachment.value}
            </p>
          )}
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

function getExistingValueAndWarnings(tagAttachment) {
  // Create mode - no warning applicable.
  if (!tagAttachment) {
    return { existingValue: '' };
  }

  const existingValue = tagAttachment.value || '';
  const valueIsPresent = !!existingValue;

  // There's no existing value. If one is required, the regular validation
  // will handle it.
  if (!valueIsPresent) {
    return { existingValue };
  }

  // No value is allowed. If a value was previously saved, show instructions
  // to delete the value.
  // The edit modal is normally disabled for a tag attachment that does not allow
  // a value. If the value already exists when it shouldn't, the modal can be opened
  // but only to delete the value.
  // Warning is based on the actual saved state, not the current form state.
  // User action expected: clear the field and then save.
  if (!tagAttachment.expectsValue) {
    return {
      existingValue,
      invalidSavedValueNote: valueIsPresent
        ? 'This tag no longer supports a value. Please delete.'
        : undefined,
    };
  }

  // Free text is allowed, so the saved value should be used. No warnings applicable.
  if (!tagAttachment.valueOptions) {
    return { existingValue };
  }

  // Options are required and the saved value is a valid option. No warnings applicable.
  if (tagAttachment.valueOptions.includes(existingValue)) {
    return { existingValue };
  }

  // The saved value is no longer in the list of allowed values.
  // Don't use the existing value as it's not compatible with the Select.
  // User action expected: select a new value from the list.
  return {
    existingValue: '',
    invalidSavedValueNote:
      'The saved value is no longer available. Choose a new one.',
  };
}
