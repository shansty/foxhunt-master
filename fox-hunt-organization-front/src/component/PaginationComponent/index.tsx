import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TablePaginationActions from './TablePaginationActions';

interface TablePaginationProps {
  countAllRows: number;
  pageNumber?: number;
  onChange(pager: { page: number; rowsPerPage?: number }): void;
  pageSize?: number;
  pager: {
    page: number;
    rowsPerPage: number;
  };
}

const PaginationComponent = ({
  countAllRows,
  onChange,
  pager,
}: TablePaginationProps) => {
  const { rowsPerPage, page } = pager;
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    onChange({ page: newPage });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onChange({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  return (
    <TablePagination
      ActionsComponent={TablePaginationActions}
      count={countAllRows ? countAllRows : pager.rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      page={page}
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
      sx={{
        '& p': {
          marginBottom: 0,
        },
      }}
    />
  );
};

export default PaginationComponent;
