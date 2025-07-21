import React from 'react';
import TablePagination, {
  tablePaginationClasses,
} from '@mui/material/TablePagination';
import PropTypes from 'prop-types';
import TablePaginationActions from '../../Pagination/TablePaginationActions';
import { styled } from '@mui/material/styles';

const StyledTablePagination = styled(TablePagination)({
  [`& .${tablePaginationClasses.selectLabel}`]: {
    marginBottom: 0,
  },
  [`& .${tablePaginationClasses.displayedRows}`]: {
    marginBottom: 0,
  },
});

export default function PaginationComponent(props) {
  const { pager, onChange, countAllRows } = props;

  const { rowsPerPage, page } = pager;
  const handleChangePage = (event, newPage) => {
    onChange({ page: newPage });
  };

  const handleChangeRowsPerPage = (event) => {
    onChange({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
  };

  return (
    <StyledTablePagination
      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
      count={countAllRows ? countAllRows : pager.rowsPerPage}
      rowsPerPage={rowsPerPage}
      page={page}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
}

PaginationComponent.propTypes = {
  pager: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }),
  countAllRows: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
