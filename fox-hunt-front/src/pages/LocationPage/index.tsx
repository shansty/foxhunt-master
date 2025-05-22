import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from 'src/store/hooks';
import {
  selectLocation,
  selectLocationLoadingState,
} from 'src/store/selectors/locationsSelectors';
import CloneLocationContainer from 'src/containers/CloneLocationContainer';
import AlertDialog from 'src/components/AlertDialog';
import {
  DELETE_LOCATION_TEXT,
  DELETE_LOCATION_TITLE,
} from 'src/constants/alertConst';
import { buildLocationUrl } from 'src/api/utils/navigationUtil';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import { FAVORITE_LOCATION_MANAGEMENT } from 'src/featureToggles/featureNameConstants';
import { enqueueSnackbar } from 'src/store/actions/notificationsActions';
import { createErrorMessage } from 'src/utils/notificationUtil';
import useAlertDialog from 'src/containers/LocationContainer/hooks/useAlertDialog';
import useLocationClonePopUp from 'src/containers/LocationContainer/hooks/useLocationClonePopUp';
import useOnLocationSave from 'src/containers/LocationContainer/hooks/useOnLocationSave';
import useLocationContainer from 'src/containers/LocationContainer/hooks/useLocationContainer';
import MainLayout from 'src/layouts/MainLayout';
import { signInRequired } from 'src/hocs/permissions';
import CreateLocationPageTitle from 'src/containers/LocationContainer/CreateLocationPageTitle';
import ExistingLocationPageTitle from 'src/containers/LocationContainer/ExistingLocationPageTitle';
import { Location } from 'src/types/Location';
import LocationForm from 'src/containers/LocationContainer/LocationForm';

const LocationPage = () => {
  const dispatch = useAppDispatch();
  const location = useAppSelector(selectLocation);
  const isLocationLoading = useAppSelector(selectLocationLoadingState);

  const [locationState, setLocationState] = useState<Location>({
    coordinates: [],
    center: [],
    forbiddenAreas: [],
    zoom: 10,
    isFavorite: false,
  });

  const navigate = useNavigate();
  const { id: propsId } = useParams();
  const { id } = location;

  const showErrorMessage = (message: string) => {
    dispatch(enqueueSnackbar(createErrorMessage(message, dispatch)));
  };

  const { isOpenAlertDialog, showAlertDialog, closeAlertDialog } =
    useAlertDialog();

  const {
    isOpenLocationClonePopUp,
    showLocationClonePopUp,
    closeLocationClonePopUp,
  } = useLocationClonePopUp();

  const remove = useLocationContainer(location, setLocationState, propsId);

  const isFavLocationFeatureEnabled = isFeatureEnabled(
    FAVORITE_LOCATION_MANAGEMENT,
  );
  const isFetchingLocation = propsId && isLocationLoading && !id;

  const goToListLocationsPage = () => {
    navigate(buildLocationUrl());
  };
  const handleLocationChange = (changeSet: Partial<Location>) => {
    setLocationState((locationState) => ({
      ...locationState,
      ...changeSet,
    }));
  };
  const onSave = useOnLocationSave(
    goToListLocationsPage,
    location,
    locationState,
    showErrorMessage,
  );

  const locationFormProps = {
    location,
    locationState,
    onSave,
    handleLocationChange,
    showLocationClonePopUp,
    showAlertDialog,
    goToListLocationsPage,
    showErrorMessage,
  };

  return (
    <MainLayout>
      {!isFetchingLocation && (
        <>
          {id ? (
            <ExistingLocationPageTitle
              location={location}
              isFavLocationFeatureEnabled={isFavLocationFeatureEnabled}
            />
          ) : (
            <CreateLocationPageTitle />
          )}
          <LocationForm {...locationFormProps} />
          <AlertDialog
            onClose={closeAlertDialog}
            onSubmit={() => remove(id)}
            open={isOpenAlertDialog}
            text={DELETE_LOCATION_TEXT}
            title={DELETE_LOCATION_TITLE}
          />
          {isOpenLocationClonePopUp && (
            <CloneLocationContainer
              isOpen={isOpenLocationClonePopUp}
              handleClickClose={closeLocationClonePopUp}
              locationToClone={location}
            />
          )}
        </>
      )}
    </MainLayout>
  );
};

export default signInRequired(LocationPage);
