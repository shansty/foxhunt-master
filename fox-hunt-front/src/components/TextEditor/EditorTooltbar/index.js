import React from 'react';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import CodeIcon from '@mui/icons-material/Code';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { StyledEditorButton, StyledContainer, StyledDivider } from './styles';
import { ELEMENT_TYPES, LEAF_TYPE } from '../util/textEditorConstants';
import {
  isBlockActive,
  toggleBlock,
  isMarkActive,
  toggleMark,
} from '../util/EditorUtil';

const markButtons = [
  { format: LEAF_TYPE.BOLD, icon: <FormatBoldIcon /> },
  { format: LEAF_TYPE.ITALIC, icon: <FormatItalicIcon /> },
  { format: LEAF_TYPE.UNDERLINE, icon: <FormatUnderlinedIcon /> },
  { format: LEAF_TYPE.CODE, icon: <CodeIcon /> },
];

const blockButtons = [
  { format: ELEMENT_TYPES.HEADING_ONE, icon: <LooksOneIcon /> },
  { format: ELEMENT_TYPES.HEADING_TWO, icon: <LooksTwoIcon /> },
  { format: ELEMENT_TYPES.HEADING_THREE, icon: <Looks3Icon /> },
  { format: ELEMENT_TYPES.BLOCK_QUOTE, icon: <FormatQuoteIcon /> },
  { format: ELEMENT_TYPES.NUMBERED_LIST, icon: <FormatListNumberedIcon /> },
  { format: ELEMENT_TYPES.BULLETED_LIST, icon: <FormatListBulletedIcon /> },
];

const EditorToolbar = () => (
  <StyledContainer>
    <ToggleButtonGroup size="small" arial-label="text formatting">
      {markButtons.map(({ format, icon }) => (
        <StyledEditorButton
          format={format}
          icon={icon}
          key={format}
          isSelected={isMarkActive}
          toggleButton={toggleMark}
        />
      ))}
    </ToggleButtonGroup>
    <StyledDivider flexItem orientation="vertical" />
    <ToggleButtonGroup size="small" arial-label="text formatting" exclusive>
      {blockButtons.map(({ format, icon }) => (
        <StyledEditorButton
          format={format}
          key={format}
          icon={icon}
          isSelected={isBlockActive}
          toggleButton={toggleBlock}
        />
      ))}
    </ToggleButtonGroup>
  </StyledContainer>
);

export default EditorToolbar;
