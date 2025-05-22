import React from 'react';
import TableFooter from '@mui/material/TableFooter';
import PaginationComponent from '../../components/UI/Pagination/PaginationComponent';
import { TableRow } from '@mui/material';

function TableFooterComponent(props) {
  const { pager, onChange, countAllRows } = props;

  return (
    <TableFooter>
      <TableRow>
        <PaginationComponent
          pager={pager}
          onChange={onChange}
          countAllRows={countAllRows}
        />
      </TableRow>
    </TableFooter>
  );
}

export default TableFooterComponent;
