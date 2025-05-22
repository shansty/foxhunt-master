import React from 'react';
import TableFooter from '@mui/material/TableFooter';
import { TableRow } from '@mui/material';
import PaginationComponent from '../PaginationComponent';

interface TableFooterComponentProps {
  countAllRows: number;
  onChange(pager?: { page: number; rowsPerPage?: number }): void;
  pager: {
    page: number;
    rowsPerPage: number;
  };
}

const TableFooterComponent = ({
  countAllRows,
  onChange,
  pager,
}: TableFooterComponentProps) => {
  return (
    <TableFooter>
      <TableRow>
        <PaginationComponent
          countAllRows={countAllRows}
          onChange={onChange}
          pager={pager}
        />
      </TableRow>
    </TableFooter>
  );
};

export default TableFooterComponent;
