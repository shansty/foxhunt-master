import React from 'react';
import { EDITOR_TEXT } from '../components/TextEditor/util/textEditorConstants';
import { Node, Text } from 'slate';
import { Box } from '@mui/material';
import SlateLeaf from '../components/TextEditor/SlateLeaf';
import SlateElement from '../components/TextEditor/SlateElement';

// eslint-disable react/no-children-prop

export const checkIfEditorIsEmpty = (description) => {
  let descriptionNodes = description;
  if (typeof description === 'string') {
    descriptionNodes = JSON.parse(description);
  }
  const plainText = descriptionNodes.map((node) => Node.string(node)).join('');
  return !!plainText;
};

export const wrapInEditorObject = (contents) => {
  let editorConents = contents;
  if (typeof contents === 'string') {
    editorConents = JSON.parse(contents);
  }
  return { [EDITOR_TEXT]: editorConents };
};

export const parseEditorText = (editorText) => {
  if (editorText && editorText[EDITOR_TEXT]) {
    const node = { children: editorText[EDITOR_TEXT] };
    return parseToHTML(node);
  }
  return '';
};

const parseToHTML = (node, key) => {
  if (Text.isText(node)) {
    const text = <Box component="span">{node.text}</Box>;
    return (
      <SlateLeaf leaf={node} key={key}>
        {text}
      </SlateLeaf>
    );
  }

  const children = node.children.map((node, index) => parseToHTML(node, index));

  if (node.type) {
    return (
      <SlateElement element={node} key={key}>
        {children}
      </SlateElement>
    );
  } else {
    return children;
  }
};
