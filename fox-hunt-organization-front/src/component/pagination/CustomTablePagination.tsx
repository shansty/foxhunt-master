import TablePaginationNavigation from './TablePaginationNavigation';
import TablePagination from '@mui/material/TablePagination';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import { PaginationDispatch } from '../../types/Dispatch';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  pagination: {
    '& p': {
      marginBottom: '0px',
    },
  },
});

interface CustomTablePaginationProps {
  pageSize: number;
  pageNumber: number;
  items: any[];
  changePage(newPage: number, pageSize: number, items: any[]): void;
}

function CustomTablePagination(props: CustomTablePaginationProps) {
  const { items, pageSize, pageNumber, changePage } = props;
  const classes = useStyles();
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    changePage(newPage, pageSize, items);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    changePage(0, parseInt(event.target.value, 10), items);
  };

  return (
    <TablePagination
      rowsPerPageOptions={[5, 8, 12, 20, { label: 'All', value: -1 }]}
      count={items.length}
      rowsPerPage={pageSize}
      page={pageNumber}
      className={classes.pagination}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true,
      }}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      ActionsComponent={() => <TablePaginationNavigation {...props} />}
    />
  );
}

const mapStateToProps = createStructuredSelector({
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
});

const mapDispatchToProps = (dispatch: PaginationDispatch) => ({
  changePage: (pageNumber: number, pageSize: number, allItems: any[]) =>
    dispatch({
      type: 'CHANGE_PAGE',
      payload: {
        pageNumber: pageNumber,
        pageSize: pageSize,
        allItems: allItems,
      },
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CustomTablePagination);
