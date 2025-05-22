import { ELEMENT_TYPES } from '../util/textEditorConstants';
import { Typography, ListItem, List } from '@mui/material';

export const elementsConfig = {
  [ELEMENT_TYPES.BLOCK_QUOTE]: {
    component: 'blockquote',
    props: {},
  },
  [ELEMENT_TYPES.HEADING_ONE]: {
    component: Typography,
    props: { variant: 'h1' },
  },
  [ELEMENT_TYPES.HEADING_TWO]: {
    component: Typography,
    props: { variant: 'h2' },
  },
  [ELEMENT_TYPES.HEADING_THREE]: {
    component: Typography,
    props: { variant: 'h3' },
  },
  [ELEMENT_TYPES.BULLETED_LIST]: {
    component: List,
    props: {
      component: 'ul',
      style: {
        listStyleType: 'disc',
      },
    },
  },
  [ELEMENT_TYPES.NUMBERED_LIST]: {
    component: List,
    props: {
      component: 'ol',
      style: {
        listStyleType: 'decimal',
      },
    },
  },
  [ELEMENT_TYPES.LIST_ITEM]: {
    component: ListItem,
    props: {
      component: 'li',
      style: {
        listStylePosition: 'inside',
        display: 'list-item',
      },
    },
  },
  [ELEMENT_TYPES.PARAGRAPH]: {
    component: Typography,
    props: {
      component: 'p',
    },
  },
};
