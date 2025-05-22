import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PageTitle from '../MainLayout/PageTitle/PageTitle';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
} from '@mui/material';
import { TableHeader } from 'common-front';
import CustomTablePagination from '../../component/pagination/CustomTablePagination';
import {
  selectEmptyRows,
  selectPageNumber,
  selectPageSize,
} from '../../store/selectors/paginationSelector';
import { createStructuredSelector } from 'reselect';
import { selectAllFeatures } from '../../store/selectors/featureSelectors';
import * as featureActions from '../../store/actions/featureActions';
import { Feature } from '../../types/Feature';
import { FeatureDispatch } from '../../types/Dispatch';
import { NO_DATA_DEFAULT_MESSAGE } from '../../utils/commonConstants';
import { getPaginatedRows } from 'common-front';
import CustomTableRow from './components/CustomTableRow';

export interface IUpdatedFeature {
  description: string | undefined;
  id: number;
}
interface FeatureManagmentPageProps {
  features: Feature[] | undefined;
  pageSize: number;
  pageNumber: number;
  emptyRows: number;
  updateFeature: (feature: IUpdatedFeature) => Promise<any>;
  fetchFeatures: () => Promise<any>;
  initPagination: () => void;
}

function FeatureManagmentPage({
  features = [],
  pageSize,
  pageNumber,
  emptyRows,
  updateFeature,
  fetchFeatures,
  initPagination,
}: FeatureManagmentPageProps) {
  const title = 'Feature Management';
  const description = 'Table manages all features.';
  const optimalRecordHeight = 63;
  const paginatedRows = getPaginatedRows(features, pageSize, pageNumber);

  useEffect(() => {
    fetchFeatures();
  }, []);

  useEffect(() => {
    return () => initPagination();
  }, [features]);

  return (
    <>
      <PageTitle titleHeading={title} titleDescription={description} />
      <TableContainer component={Paper}>
        <Table aria-label="custom pagination table">
          <TableHeader
            headerCells={[
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Edit' },
            ]}
          />
          <TableBody>
            {paginatedRows.map((feature: Feature) => (
              <CustomTableRow
                key={feature.id}
                feature={feature}
                updateFeature={updateFeature}
              />
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: optimalRecordHeight * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}

            {features.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>{NO_DATA_DEFAULT_MESSAGE}</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <CustomTablePagination items={features} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

const mapDispatchToProps = (dispatch: FeatureDispatch) => ({
  fetchFeatures: () => dispatch(featureActions.fetchFeatures()),
  initPagination: () => dispatch({ type: 'INIT_PAGINATION' }),
  updateFeature: (feature: IUpdatedFeature) =>
    dispatch(featureActions.updateFeature(feature)),
});

const mapStateToProps = createStructuredSelector({
  features: selectAllFeatures,
  pageSize: selectPageSize,
  pageNumber: selectPageNumber,
  emptyRows: selectEmptyRows,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeatureManagmentPage);
