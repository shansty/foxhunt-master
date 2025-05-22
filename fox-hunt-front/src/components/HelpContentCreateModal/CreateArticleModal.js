import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  createHelpContentArticle,
  updateHelpContentArticle,
} from '../../store/actions/helpContentActions';
import {
  checkIfEditorIsEmpty,
  wrapInEditorObject,
} from '../../utils/textEditorUtils';
import HelpContentForm from './HelpContentForm';
import { articleShape, topicShape } from './propShapes';

const CreateArticleModal = ({
  handleClose,
  article,
  topic,
  saveOrderChanges,
  renderButtons,
}) => {
  const dispatch = useDispatch();
  const confirmButtonName = article?.title ? 'Update' : 'Create';

  const createArticle = (article) => {
    dispatch(createHelpContentArticle({ article, topic }));
  };

  const updateArticle = (article) => {
    dispatch(updateHelpContentArticle({ article, topic }));
  };

  const onSave = async (values, { setSubmitting }) => {
    const { title, contents, notes } = values;
    const isDescriptionWritten = checkIfEditorIsEmpty(contents);

    setSubmitting(false);
    await saveOrderChanges();

    if (article?.title && isDescriptionWritten) {
      const updatedArticle = {
        id: article.id,
        title,
        notes,
        contents: wrapInEditorObject(contents),
      };
      updateArticle(updatedArticle);
    } else if (isDescriptionWritten) {
      let lastIndex = topic.articles?.length || 0;
      const createdArticle = {
        title,
        notes,
        contents: wrapInEditorObject(contents),
        index: ++lastIndex,
      };
      createArticle(createdArticle);
    }

    handleClose();
  };

  return (
    <HelpContentForm
      helpContent={article}
      onSave={onSave}
      confirmButtonName={confirmButtonName}
      renderButtons={renderButtons}
    />
  );
};

CreateArticleModal.propTypes = {
  topic: topicShape,
  article: articleShape,
  handleClose: PropTypes.func.isRequired,
  saveOrderChanges: PropTypes.func.isRequired,
  renderButtons: PropTypes.func.isRequired,
};

CreateArticleModal.defaultProps = {
  topic: null,
  article: null,
};

export default CreateArticleModal;
