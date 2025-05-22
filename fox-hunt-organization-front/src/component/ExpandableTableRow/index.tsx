import React, { useState } from 'react';
import { TableCell, TableRow } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface ExpandableTableRowProps {
  expandComponent: React.ReactNode;
  children: React.ReactNode;
}

const ExpandableTableRow = ({
  children,
  expandComponent,
  ...otherProps
}: ExpandableTableRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow {...otherProps}>
        <TableCell padding="checkbox">
          <IconButton onClick={() => setIsExpanded(!isExpanded)} size="large">
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {children}
      </TableRow>
      {isExpanded && <TableRow>{expandComponent}</TableRow>}
    </>
  );
};

export default ExpandableTableRow;
