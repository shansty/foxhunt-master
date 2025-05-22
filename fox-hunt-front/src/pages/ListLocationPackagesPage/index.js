import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { createStructuredSelector } from 'reselect';
import ListLocationPackages from 'src/containers/ListLocationPackagesContainer/ListLocationPackages';
import * as FoxHuntPropTypes from 'src/utils/FoxHuntPropTypes';
import {
  getLocationPackages,
  removeLocationPackage,
} from 'src/store/actions/locationPackagesActions';
import {
  selectAllLocationPackages,
  selectAllLocationPackagesCount,
} from 'src/store/selectors/locationPackagesSelectors';
import { buildCreateLocationPackageUrl } from 'src/api/utils/navigationUtil';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';

function ListLocationPackagesPage({
  locationPackages,
  allSize,
  fetchLocationPackages,
  removeLocationPackage,
}) {
  const initialState = {
    pager: {
      page: 0,
      rowsPerPage: 25,
    },
  };

  const navigate = useNavigate();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetchLocationPackages({
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  }, [fetchLocationPackages, state.pager.page, state.pager.rowsPerPage]);

  const changePager = (pager = { page: 0, rowsPerPage: 25 }) => {
    const newPager = Object.assign(state.pager, pager);
    const newState = { ...state, pager: newPager };
    setState(newState);
    fetchLocationPackages({
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  };

  const handleCreateLocationPackage = () => {
    navigate(buildCreateLocationPackageUrl());
  };

  return (
    <MainLayout>
      <div style={{ paddingBottom: '0.5rem' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          onClick={handleCreateLocationPackage}
        >
          Create a Location package
        </Button>
      </div>
      {locationPackages && (
        <ListLocationPackages
          locationPackages={locationPackages}
          onRemoveLocationPackage={removeLocationPackage}
          pager={state.pager}
          onPageChange={changePager}
          countAllRows={allSize}
        />
      )}
    </MainLayout>
  );
}

ListLocationPackagesPage.propTypes = {
  locationPackages: PropTypes.arrayOf(
    FoxHuntPropTypes.locationPackage.propTypes,
  ),
  error: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  locationPackages: selectAllLocationPackages,
  allSize: selectAllLocationPackagesCount,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLocationPackages: (params) => dispatch(getLocationPackages(params)),
  removeLocationPackage: (locationPackage) =>
    dispatch(removeLocationPackage(locationPackage.locationPackageId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(signInRequired(ListLocationPackagesPage));
