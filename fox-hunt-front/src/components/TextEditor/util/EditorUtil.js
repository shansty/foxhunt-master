import { Editor, Transforms } from 'slate';
import { LIST_TYPES, ELEMENT_TYPES } from './textEditorConstants';

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};

export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: getBlockType(isActive, isList, format),
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const getBlockType = (isActive, isList, format) => {
  if (isActive) {
    return ELEMENT_TYPES.PARAGRAPH;
  } else if (isList) {
    return ELEMENT_TYPES.LIST_ITEM;
  } else {
    return format;
  }
};

export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);
  return marks ? !!marks[format] : false;
};

export const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
