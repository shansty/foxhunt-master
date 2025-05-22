import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  createHelpContentTopic,
  updateHelpContentTopic,
} from '../../store/actions/helpContentActions';
import {
  checkIfEditorIsEmpty,
  wrapInEditorObject,
} from '../../utils/textEditorUtils';
import HelpContentForm from './HelpContentForm';
import { topicShape } from './propShapes';

const CreateTopicModal = ({
  topic,
  saveOrderChanges,
  helpContents,
  renderButtons,
  handleClose,
}) => {
  const dispatch = useDispatch();
  const confirmButtonName = topic?.index ? 'Update' : 'Create';

  const createTopic = (topic) => {
    dispatch(createHelpContentTopic(topic));
  };

  const updateTopic = (topic) => {
    dispatch(updateHelpContentTopic(topic));
  };

  const onSave = async (values, { setSubmitting }) => {
    const { title, notes } = values;
    const isDescriptionWritten = checkIfEditorIsEmpty(values.contents);
    let { contents } = values;
    !isDescriptionWritten
      ? (contents = null)
      : (contents = wrapInEditorObject(contents));

    setSubmitting(false);
    await saveOrderChanges();

    if (topic?.index) {
      const updatedTopic = {
        id: topic.id,
        title,
        notes,
        contents,
      };
      updateTopic(updatedTopic);
    } else {
      let lastIndex = helpContents.length;
      const createdTopic = {
        title,
        contents,
        notes,
        index: ++lastIndex,
      };
      createTopic(createdTopic);
    }

    handleClose();
  };

  return (
    <HelpContentForm
      helpContent={topic}
      onSave={onSave}
      confirmButtonName={confirmButtonName}
      renderButtons={renderButtons}
    />
  );
};

CreateTopicModal.propTypes = {
  topic: topicShape,
  handleClose: PropTypes.func.isRequired,
  saveOrderChanges: PropTypes.func.isRequired,
  helpContents: PropTypes.array.isRequired,
  renderButtons: PropTypes.func.isRequired,
};

export default CreateTopicModal;
