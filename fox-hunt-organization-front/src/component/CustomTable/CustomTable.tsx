import React, { ChangeEvent, useEffect, useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Checkbox,
  Button,
} from '@mui/material';

import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import PageTitle from '../../container/MainLayout/PageTitle/PageTitle';
import { connect } from 'react-redux';
import {
  selectEmptyRows,
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import CustomTablePagination from '../pagination/CustomTablePagination';
import { createStructuredSelector } from 'reselect';
import { makeStyles } from '@mui/styles';
import { Row, HeaderColumn, Cell, updatedCell } from '../../types/CustomTable';
import { isBoolean, isUndefined } from 'lodash';
import { NO_DATA_DEFAULT_MESSAGE } from '../../utils/commonConstants';

const useStyles = makeStyles({
  stickyCell: {
    top: 0,
    left: 0,
    zIndex: 2,
    width: '226px',
    position: 'sticky',
    backgroundColor: '#FAFAFA',
    boxShadow: 'inset -1px 0px 0px #aaa',
  },
  footer: {
    display: 'grid',
  },
  rotatedCellContainer: {
    width: '0px',
    height: 'fit-content',
    margin: 'auto',
  },
  rotatedCellContent: {
    width: '150px',
    transformOrigin: 'left',
    transform: 'rotate(-45deg)',
    marginTop: '90px',
  },
  headerCell: {
    height: '165px',
  },
  noTableData: {
    textAlign: 'center',
  },
  checkboxWrapper: {
    width: 'fit-content',
    height: 'fit-content',
    margin: 'auto',
  },
  diagonalCell: {
    backgroundImage:
      'linear-gradient(to bottom left, #FAFAFA 50%, #cecece 40%, #FAFAFA 51%)',
  },
  diagonalLabel: {
    transform: 'rotate(38deg)',
    position: 'absolute',
  },
  firstDiagonalLabel: {
    marginTop: '-20%',
    marginLeft: '40%',
  },
  secondDiagonalLabel: {
    marginLeft: '12%',
    marginTop: '8%',
  },
  saveBtn: {
    width: '10%',
    marginBottom: '25px',
    marginLeft: '25px',
  },
});

interface CustomTableProps {
  rows: Row[];
  headers: HeaderColumn[];
  emptyRows?: number;
  pageNumber?: number;
  pageSize?: number;
  tableTitle: string;
  tableDescr: string;
  noDataMessage?: string;
  handleChange: (data: Map<string, updatedCell>) => void;
}

function CustomTable({
  pageSize,
  pageNumber,
  headers,
  rows = [],
  handleChange,
  tableDescr,
  tableTitle,
  noDataMessage = NO_DATA_DEFAULT_MESSAGE,
}: CustomTableProps) {
  const classes = useStyles();
  const [updatedItems, setUpdatedItems] = useState<Map<string, updatedCell>>(
    new Map(),
  );

  const onSaveClick = () => {
    handleChange(updatedItems);
  };

  useEffect(() => {
    if (rows.length) setUpdatedItems(new Map());
  }, [rows]);

  const getFeatureValue = (
    updatedItems: Map<string, updatedCell>,
    item: any,
    organizationId: any,
  ) => {
    const updatedValue = updatedItems.get(
      `${item.id} ${organizationId}`,
    )?.value;
    return isBoolean(updatedValue) ? updatedValue : item.value;
  };

  const getNewItems = (
    cellIds: string,
    value: boolean,
    oldItems: Map<string, updatedCell>,
  ) => {
    const cellIdsArr = cellIds.split(' ');
    const newItems = new Map(oldItems);
    newItems.set(cellIds, {
      itemId: cellIdsArr[0],
      organizationId: cellIdsArr[1],
      value: value,
    });

    return newItems;
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdatedItems(
      (oldItems): Map<string, updatedCell> =>
        getNewItems(event.target.id, event.target.checked, oldItems),
    );
  };

  return (
    <>
      <PageTitle titleHeading={tableTitle} titleDescription={tableDescr} />
      <Button
        variant="contained"
        color="primary"
        className={classes.saveBtn}
        onClick={onSaveClick}
      >
        Save
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              {headers.map((row: HeaderColumn) => (
                <TableCell
                  className={
                    row.sticky
                      ? `${classes.stickyCell} ${classes.diagonalCell}`
                      : classes.headerCell
                  }
                  key={row.id}
                >
                  {!row.sticky ? (
                    <div className={classes.rotatedCellContainer}>
                      <div className={classes.rotatedCellContent}>
                        {row.label}
                      </div>
                    </div>
                  ) : (
                    <>
                      {row.label.split(' ').map((el, i) => (
                        <div
                          className={`${
                            i === 0
                              ? classes.firstDiagonalLabel
                              : classes.secondDiagonalLabel
                          } ${classes.diagonalLabel}`}
                          key={el}
                        >
                          {el}
                        </div>
                      ))}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(!isUndefined(pageSize) && !isUndefined(pageNumber) && pageSize > 0
              ? rows.slice(
                  pageNumber * pageSize,
                  pageNumber * pageSize + pageSize,
                )
              : rows
            ).map((row: Row) => (
              <TableRow key={row.id}>
                <TableCell className={classes.stickyCell}>{row.name}</TableCell>
                {row.items.map((item: Cell) => (
                  <TableCell key={item.id}>
                    <div className={classes.checkboxWrapper}>
                      <Checkbox
                        checked={getFeatureValue(updatedItems, item, row.id)}
                        color="secondary"
                        id={`${item.id} ${row.id}`}
                        onChange={handleCheckboxChange}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={headers.length + 1}
                  className={classes.noTableData}
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TableFooter className={classes.footer}>
        <CustomTablePagination items={rows} />
      </TableFooter>
    </>
  );
}

const mapDispatchToProps = (dispatch: any) => ({
  initPagination: () => dispatch({ type: 'INIT_PAGINATION' }),
});

const mapStateToProps = createStructuredSelector({
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
  emptyRows: selectEmptyRows,
});

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
