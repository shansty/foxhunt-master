import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton } from '@mui/material';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';

const paginationStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(0),
  },
  nested: {
    paddingRight: 0,
  },
}));

interface TableNavigationProps {
  pageSize: number;
  pageNumber: number;
  items: any[];
  changePage(newPage: number, pageSize: number, items: any[]): void;
}

function TablePaginationNavigation(props: TableNavigationProps) {
  const classes = paginationStyles();
  const theme = useTheme();
  const { items, pageNumber, pageSize, changePage } = props;

  const handleFirstPageButtonClick = () => {
    changePage(0, pageSize, items);
  };

  const handleBackButtonClick = () => {
    changePage(pageNumber - 1, pageSize, items);
  };

  const handleNextButtonClick = () => {
    changePage(pageNumber + 1, pageSize, items);
  };

  const handleLastPageButtonClick = () => {
    changePage(
      Math.max(0, Math.ceil(items.length / pageSize) - 1),
      pageSize,
      items,
    );
  };

  return (
    <div className={classes.root}>
      <IconButton
        className={classes.nested}
        onClick={handleFirstPageButtonClick}
        disabled={pageNumber === 0}
        aria-label="first page"
        size="large"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        className={classes.nested}
        onClick={handleBackButtonClick}
        disabled={pageNumber === 0}
        aria-label="previous page"
        size="large"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        className={classes.nested}
        onClick={handleNextButtonClick}
        disabled={pageNumber >= Math.ceil(items.length / pageSize) - 1}
        aria-label="next page"
        size="large"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={pageNumber >= Math.ceil(items.length / pageSize) - 1}
        aria-label="last page"
        size="large"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const mapStateToProps = createStructuredSelector({
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
});

export default connect(mapStateToProps)(TablePaginationNavigation);
