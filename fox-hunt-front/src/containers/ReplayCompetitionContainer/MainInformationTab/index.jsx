import React from 'react';
import { Formik, Field } from 'formik';
import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Typography, Grid, Button } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MapIcon from '@mui/icons-material/Map';

import { FormikInput } from 'common-front';
import DatePickerField from 'src/components/Formik/FormikDatePicker';
import { DATE_FORMATS } from 'src/constants/dateFormatConstants';
import UserResultsTable from 'src/components/UserResultsTable';
import { getColorConfig } from 'src/utils';
import { selectGameResults } from 'src/store/selectors/competitionSelectors';
import IconPopupDialog from 'src/components/IconPopupDialog';
import WatchCompetitionManager from 'src/components/WatchCompetitionManager';

import styles from '../styles';

const MainInformationTab = ({
  competition,
  toggleMainInfo,
  isMainInfoOpen,
}) => {
  const initialResults = useSelector(selectGameResults);

  const mainInfoButtonLabel = (
    <>
      <span>{isMainInfoOpen ? 'Hide' : 'Show'} Competition Details</span>
      {isMainInfoOpen ? (
        <ExpandLessIcon className="sidebar-expand-icon" />
      ) : (
        <ExpandLessIcon className="sidebar-expand-icon sidebar-expand-icon-rotate" />
      )}
    </>
  );

  return (
    <>
      <Grid container direction={'column'} spacing={1}>
        <Button
          sx={{ width: '220px', mt: 1, mb: 1 }}
          variant="text"
          color="secondary"
          onClick={toggleMainInfo}
        >
          {mainInfoButtonLabel}
        </Button>
        {isMainInfoOpen && (
          <Formik initialValues={competition}>
            <Grid item container direction={'row'} columnSpacing={1}>
              <Grid item xs={12} sm={12}>
                <Typography mb={2}>Time and Location</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormikInput
                  fullWidth
                  disabled
                  enableFeedback
                  component={TextField}
                  value={competition.name}
                  name={'name'}
                  label={'Name'}
                  variant="outlined"
                />
              </Grid>
              {competition.notes && (
                <Grid item xs={12} sm={6}>
                  <FormikInput
                    disabled
                    multiline
                    fullWidth
                    enableFeedback
                    value={competition.notes}
                    component={TextField}
                    name={'description'}
                    label={'Description'}
                    variant="outlined"
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Field
                    disabled
                    fullWidth
                    component={DatePickerField}
                    name={'startDate'}
                    label="Start Time"
                    variant="inline"
                    placeholder={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                    format={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                    keyBoardFormat={DATE_FORMATS.DATE_PICKER_KEYBOARD}
                    inputVariant={'outlined'}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Field
                    disabled
                    fullWidth
                    component={DatePickerField}
                    name={'finishDate'}
                    label="Finish Time"
                    variant="inline"
                    placeholder={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                    format={DATE_FORMATS.DATE_PICKER_WITH_TIME}
                    keyBoardFormat={DATE_FORMATS.DATE_PICKER_KEYBOARD}
                    inputVariant={'outlined'}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item container xs={12} sm={6}>
                <Grid item xs>
                  <FormikInput
                    disabled
                    fullWidth
                    enableFeedback
                    value={competition.location.name}
                    component={TextField}
                    name={'location'}
                    label={'Location'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item>
                  <IconPopupDialog icon={<MapIcon />}>
                    <WatchCompetitionManager competition={competition} dialog />
                  </IconPopupDialog>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography mb={2}>Competition Settings</Typography>
              </Grid>
              <Grid xs={12} item container columnSpacing={1}>
                <Grid item xs={12} sm={3}>
                  <FormikInput
                    disabled
                    fullWidth
                    enableFeedback
                    value={competition.foxAmount}
                    component={TextField}
                    name={'foxAmount'}
                    label={'Amount of Foxes'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormikInput
                    disabled
                    fullWidth
                    enableFeedback
                    value={competition.distanceType?.name}
                    component={TextField}
                    name={'distanceType'}
                    label={'Distance Type'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormikInput
                    disabled
                    fullWidth
                    enableFeedback
                    value={competition.foxDuration}
                    component={TextField}
                    name={'foxDuration'}
                    label={'Fox Duration (Seconds)'}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormikInput
                    disabled
                    fullWidth
                    enableFeedback
                    value={competition.frequency}
                    component={TextField}
                    name={'frequency'}
                    label={'Fox Frequency (MGz)'}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Formik>
        )}
        <Grid item sx={styles.results}>
          <UserResultsTable
            replay
            userResults={initialResults}
            config={{ color: getColorConfig(competition.participants) }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default MainInformationTab;
