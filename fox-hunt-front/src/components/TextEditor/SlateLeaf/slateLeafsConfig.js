import { LEAF_TYPE } from '../util/textEditorConstants';
import { Box } from '@mui/material';

export const leafsConfig = {
  [LEAF_TYPE.BOLD]: {
    component: Box,
    props: {
      component: 'span',
      fontWeight: 'fontWeightBold',
    },
  },
  [LEAF_TYPE.ITALIC]: {
    component: Box,
    props: {
      component: 'span',
      fontStyle: 'italic',
    },
  },
  [LEAF_TYPE.CODE]: {
    component: 'code',
    props: {},
  },
  [LEAF_TYPE.UNDERLINE]: {
    component: Box,
    props: {
      component: 'span',
      style: { textDecoration: 'underline' },
    },
  },
  [LEAF_TYPE.TEXT]: {
    component: Box,
    props: {
      component: 'span',
    },
  },
};
