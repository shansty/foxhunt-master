import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { DropdownMenu, TableHeader, useIsMobile } from 'common-front';
import CloneLocationContainer from '../CloneLocationContainer';
import AlertDialog from 'src/components/AlertDialog';
import TableFooterComponent from 'src/components/TableFooter';
import { buildUpdateLocationByIdUrl } from 'src/api/utils/navigationUtil';
import { formatDate } from 'src/utils';
import {
  DELETE_LOCATION_TEXT,
  DELETE_LOCATION_TITLE,
} from 'src/constants/alertConst';
import {
  selectAllLocations,
  selectFavoriteLocations,
} from 'src/store/selectors/locationsSelectors';
import {
  getLocations,
  getLocationById,
  removeLocation,
} from 'src/store/actions/locationsActions';
import {
  FAVORITE_LOCATION_MANAGEMENT,
  LOCATION_MANAGEMENT,
} from 'src/featureToggles/featureNameConstants';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { ConditionalContainer } from 'src/featureToggles/customFeatures/ConditionalContainer';
import { useNavigate } from 'react-router-dom';

function ListLocations({
  countAllRows,
  locations,
  onPageChange,
  organization,
  pager,
  ...props
}) {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [locationToRemove, setLocationToRemove] = useState(null);
  const [openLocationClonePopUp, setOpenLocationClonePopUp] = useState(false);
  const [locationToClone, setLocationToClone] = useState(null);

  const favoriteLocationsId = props?.favoriteLocations?.map(
    (location) => location.id,
  );

  const handleClickOpen = (location) => {
    setOpenLocationClonePopUp(true);
    setLocationToClone(location);
  };

  const handleClickClose = () => {
    setOpenLocationClonePopUp(false);
    setLocationToClone(null);
  };

  const getActionItems = (location) => {
    const fetchLocationAndRedirect = (id) => {
      dispatch(getLocationById(id)).then(({ payload }) => {
        if (payload?.status === 200) {
          navigate(buildUpdateLocationByIdUrl(id));
        }
      });
    };

    const items = [
      {
        id: location.id,
        title: 'Details',
        action: () => fetchLocationAndRedirect(location.id),
      },
    ];
    if (isFeatureEnabled(LOCATION_MANAGEMENT)) {
      items.push({
        id: location.id,
        title: 'Clone',
        to: '#',
        action: () => handleClickOpen(location),
      });
    }
    if (location.updatable && isFeatureEnabled(LOCATION_MANAGEMENT)) {
      items.push({
        id: location.id,
        title: 'Remove',
        to: '#',
        action: () => showAlertDialog(location),
      });
    }
    return items;
  };

  const removeLocation = (id) => {
    props.removeLocation(id).then(props.fetchLocations);
    closeAlertDialog();
  };

  function showAlertDialog(location) {
    setLocationToRemove(location);
    setOpen(true);
  }

  function closeAlertDialog() {
    setOpen(false);
    setLocationToRemove(null);
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHeader
            headerCells={[
              { name: '#' },
              { name: 'Name' },
              { name: 'Created by' },
              { name: 'Created at', hideOnMobile: true },
              { name: 'Updated by', hideOnMobile: true },
              { name: 'Updated at', hideOnMobile: true },
              { name: 'Operation' },
            ]}
          />
          <TableBody>
            {locations.map((location, index) => (
              <TableRow key={`${location.id}${location.name}`}>
                <TableCell scope="row" align={'justify'}>
                  {pager.page * pager.rowsPerPage + ++index}
                </TableCell>
                <TableCell align={'justify'}>
                  {location.name}
                  {favoriteLocationsId?.includes(location.id) && (
                    <ConditionalContainer
                      feature={FAVORITE_LOCATION_MANAGEMENT}
                    >
                      <StarIcon style={{ color: '#ffdd00' }} />
                    </ConditionalContainer>
                  )}
                </TableCell>
                <TableCell align={'justify'}>
                  {`${location.createdBy.firstName} ${location.createdBy.lastName}`}
                </TableCell>
                {!isMobile && (
                  <>
                    <TableCell align={'justify'}>
                      {formatDate(location.createdDate)}
                    </TableCell>
                    <TableCell align={'justify'}>
                      {location.updatedBy
                        ? `${location.updatedBy.firstName} ${location.updatedBy.lastName}`
                        : '-'}
                    </TableCell>
                    <TableCell align={'justify'}>
                      {location.updatedBy
                        ? formatDate(location.updatedDate)
                        : '-'}
                    </TableCell>
                  </>
                )}
                <TableCell align={'justify'}>
                  <DropdownMenu items={getActionItems(location)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooterComponent
            pager={pager}
            onChange={onPageChange}
            countAllRows={countAllRows}
          />
        </Table>
        <AlertDialog
          open={open}
          onClose={closeAlertDialog}
          title={DELETE_LOCATION_TITLE}
          text={DELETE_LOCATION_TEXT}
          onSubmit={() => removeLocation(locationToRemove.id)}
        />
      </TableContainer>
      {openLocationClonePopUp && (
        <CloneLocationContainer
          isOpen={openLocationClonePopUp}
          handleClickClose={handleClickClose}
          locationToClone={locationToClone}
        />
      )}
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  locations: selectAllLocations,
  favoriteLocations: selectFavoriteLocations,
});

const mapDispatchToProps = (dispatch) => ({
  fetchLocations: (params) => dispatch(getLocations(params)),
  removeLocation: (id) => dispatch(removeLocation(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListLocations);
