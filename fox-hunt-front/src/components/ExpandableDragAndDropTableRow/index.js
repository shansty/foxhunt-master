import React, { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ExpandableDragAndDropTableRow = ({
  children,
  expandComponent,
  provided,
  ...otherProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        {...otherProps}
      >
        <TableCell padding="checkbox" sx={{ maxWidth: 50, minWidth: 50 }}>
          <IconButton onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && <TableRow>{expandComponent}</TableRow>}
    </>
  );
};

export default ExpandableDragAndDropTableRow;
