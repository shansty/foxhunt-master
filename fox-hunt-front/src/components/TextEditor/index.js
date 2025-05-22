import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';
import SlateElement from './SlateElement';
import SlateLeaf from './SlateLeaf';
import EditorToolbar from './EditorTooltbar';
import { StyledContainer, StyledEditor } from './styles';

const TextEditor = ({ initialValue, helpers: { setValue } }) => {
  const editor = useMemo(() => withReact(createEditor()), []);
  const [editorValue, setEditorValue] = useState(JSON.parse(initialValue));

  const onChange = useCallback(
    (value) => {
      setEditorValue(value);
      setValue(value);
    },
    [setValue],
  );

  return (
    <StyledContainer>
      <Slate editor={editor} value={editorValue} onChange={onChange}>
        <EditorToolbar />
        <StyledEditor renderElement={SlateElement} renderLeaf={SlateLeaf} />
      </Slate>
    </StyledContainer>
  );
};

TextEditor.propTypes = {
  initialValue: PropTypes.string.isRequired,
  helpers: PropTypes.shape({
    setValue: PropTypes.func.isRequired,
  }),
};

export default TextEditor;
