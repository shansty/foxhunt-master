import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Card } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { TextField } from 'formik-mui';
import Typography from '@mui/material/Typography';
import { FormikHelpers } from 'formik';

import { FormikInput } from 'common-front';
import { Location } from 'src/types/Location';
import LocationMapManager from 'src/containers/LocationContainer/LocationMapManager';
import { LOCATION_MANAGEMENT } from 'src/featureToggles/featureNameConstants';
import { isFeatureEnabled } from 'src/featureToggles/FeatureTogglesUtils';
import {
  SaveButton,
  CancelButton,
  DeleteButton,
  CloneButton,
} from 'common-front';

export interface LocationFormProps {
  location: Location;
  locationState: Location;
  onSave: (
    formValues: Location,
    { setSubmitting }: FormikHelpers<Location>,
  ) => void;
  handleLocationChange: (changeSet: Partial<Location>) => void;
  showLocationClonePopUp: () => void;
  showAlertDialog: () => void;
  goToListLocationsPage: () => void;
  showErrorMessage: (message: string) => void;
}

const LocationForm = ({
  location,
  locationState,
  onSave,
  handleLocationChange,
  showLocationClonePopUp,
  showAlertDialog,
  showErrorMessage,
  goToListLocationsPage,
}: LocationFormProps) => {
  const { id } = location;
  const isDrawingManagerEnabled = !id || location.updatable;
  const isManagementDisabled =
    (!!id && !location.updatable) || !isFeatureEnabled(LOCATION_MANAGEMENT);

  return (
    <Formik
      initialValues={location}
      onSubmit={onSave}
      validateOnChange={false}
      enableReinitialize
      validationSchema={Yup.object().shape({
        name: Yup.string().required().min(5).max(50),
        description: Yup.string(),
      })}
    >
      {(props) => {
        const { handleChange, handleSubmit } = props;
        return (
          <Card variant={'outlined'}>
            <CardContent>
              <Form onSubmit={handleSubmit}>
                <Grid container direction={'column'} spacing={1}>
                  <Grid item container direction={'column'} spacing={1}>
                    <Grid item>
                      <Typography
                        className="text-black px-2 font-weight-bold"
                        component="div"
                      >
                        Main Information
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid item container direction={'row'} spacing={1}>
                    <Grid item md={6} sm={12}>
                      <FormikInput
                        component={TextField}
                        name={'name'}
                        label={'Name*'}
                        variant="outlined"
                        enableFeedback
                        fullWidth
                        onChange={handleChange}
                        disabled={isManagementDisabled}
                      />
                    </Grid>
                    <Grid item md={6} sm={12}>
                      <FormikInput
                        component={TextField}
                        name={'description'}
                        label={'Description'}
                        variant="outlined"
                        enableFeedback
                        fullWidth
                        multiline
                        maxRows={5}
                        onChange={handleChange}
                        disabled={isManagementDisabled}
                      />
                    </Grid>
                  </Grid>
                  <Grid item container direction={'column'} spacing={1}>
                    <Grid item>
                      <Typography
                        className="text-black px-2 font-weight-bold"
                        component="div"
                      >
                        Associated Area
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{ maxWidth: '100%' }}
                      data-testid="location-map"
                    >
                      <LocationMapManager
                        location={locationState}
                        onChange={handleLocationChange}
                        showErrorMessage={showErrorMessage}
                        isDrawingManagerEnabled={isDrawingManagerEnabled}
                      />
                    </Grid>
                    <Grid item>
                      {!isManagementDisabled ? (
                        <div data-testid="management-buttons">
                          <SaveButton />
                          <CancelButton onClick={goToListLocationsPage} />
                          {!!id && (
                            <>
                              <DeleteButton onClick={showAlertDialog} />
                              <CloneButton onClick={showLocationClonePopUp} />
                            </>
                          )}
                        </div>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        );
      }}
    </Formik>
  );
};

export default LocationForm;
