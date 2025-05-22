import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ListContent from '../../list/ListContent';
import COLORS from '../../../utils/constants/colors';
import { capitalizeFirstLetter } from '../../../utils/commonUtils';
import {
  ALLOWED_LOCATION_PERMISSION_STATE,
  FORBIDDEN_LOCATION_PERMISSION_STATE,
  INITIAL_LOCATION_PERMISSION_STATE,
} from '../../../utils/constants/commonConstants';
import getUserLocation from '../../../utils/userLocation/getUserLocation';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';
import { Button } from 'react-native-elements';
import WarningNotification from '../../notification/WarningNotification';
import {
  ALLOW_LOCATION_WARNING_SUBTITLE,
  ALLOW_LOCATION_WARNING_TITLE,
} from '../../../utils/constants/errors';

const RenderCommandCompetitionSectionContent = ({ competition, setCompetition }) => {
  const [locationPermissionState, setLocationPermissionState] =
      useState(INITIAL_LOCATION_PERMISSION_STATE);
  const { startCommandCompetition } = useContext(CompetitionContext);
  const [isSpinner, setSpinner] = useState(false);

  const setCompetitionWithPermission = async () => {
    setSpinner(true);
    setLocationPermissionState(INITIAL_LOCATION_PERMISSION_STATE);
    let currentUserLocation;
    let isLocationAllowed;
    try {
      currentUserLocation = await getUserLocation();
      isLocationAllowed = currentUserLocation.hasOwnProperty('coords');
      setLocationPermissionState(isLocationAllowed ?
        ALLOWED_LOCATION_PERMISSION_STATE :
        FORBIDDEN_LOCATION_PERMISSION_STATE,
      );
    } catch (err) {
      setLocationPermissionState(FORBIDDEN_LOCATION_PERMISSION_STATE);
    }
    if (isLocationAllowed) {
      const comp = await setCompetition(competition.id, currentUserLocation);
      startCommandCompetition(comp);
    }
  };

  return <View style={styles.contentBlock}>
    <WarningNotification
      isVisible={locationPermissionState === FORBIDDEN_LOCATION_PERMISSION_STATE}
      title={ALLOW_LOCATION_WARNING_TITLE}
      subTitle={ALLOW_LOCATION_WARNING_SUBTITLE}
    />
    <ListContent title={'Location:'}
      value={capitalizeFirstLetter(competition.location.name)}/>
    <ListContent title={'Fox amount:'} value={competition.foxAmount}/>
    <ListContent title={'Fox duration:'} value={competition.foxDuration}/>
    <ListContent title={'Distance:'}
      value={competition.distanceType.distanceLength}/>
    {competition.coach.firstName &&
    <ListContent
      title={'Couch:'}
      value={competition.coach.lastName ?
        competition.coach.firstName + ' ' + competition.coach.lastName :
        competition.coach.firstName
      }
    />
    }
    <View style={styles.buttonContainer}>
      <Button
        buttonStyle={styles.submitButton}
        title="START"
        onPress={setCompetitionWithPermission}
        loading={isSpinner && locationPermissionState !== FORBIDDEN_LOCATION_PERMISSION_STATE}
      />
    </View>
  </View>;
};

const styles = StyleSheet.create({
  contentBlock: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginHorizontal: 5,
    borderColor: COLORS.blueBackground,
    borderTopWidth: 1,
    borderWidth: 1,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    color: COLORS.black,
    height: 40,
  },
  buttonContainer: {
    paddingTop: 10,
  },
});

export default RenderCommandCompetitionSectionContent;
