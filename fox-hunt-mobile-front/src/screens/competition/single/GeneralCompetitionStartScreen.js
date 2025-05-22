import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/parts/Header';
import COLORS from '../../../utils/constants/colors';
import {
  ALLOWED_LOCATION_PERMISSION_STATE,
  DEFAULT_SINGLE_COMPETITIONS,
  FORBIDDEN_LOCATION_PERMISSION_STATE,
  INITIAL_LOCATION_PERMISSION_STATE,
} from '../../../utils/constants/commonConstants';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';
import CustomDropDownPicker from '../../../components/competitions/part/CustomDropDownPicker';
import {
  GENERAL_PARTICIPANT_START_SETTINGS_SCREEN,
  SPC_LOGS_SCREEN,
} from '../../../utils/constants/routeNames';
import getUserLocation from '../../../utils/userLocation/getUserLocation';
import Button from '../../../components/parts/Button';
import DefaultTitle from '../../../components/parts/DefaultTitle';
import WarningNotification from '../../../components/notification/WarningNotification';
import {
  ALLOW_LOCATION_WARNING_SUBTITLE,
  ALLOW_LOCATION_WARNING_TITLE,
} from '../../../utils/constants/errors';
import { Context as CommonContext } from '../../../context/CommonContext';
import styles from './GeneralCompetitionStartScreen.styles';
import Separator from '../../../components/parts/Separator';
import SettingsList from '../../../components/competitions/part/SettingsList';
import { navigationRef } from '../../../navTools/rootNavigation';

const GeneralCompetitionStartScreen = ({ navigation, initializeSingleCompetition, startSingleCompetition, header }) => {
  const { state: { tooltips } } = useContext(CommonContext);
  const [initCompetition, setInitCompetition] = useState(DEFAULT_SINGLE_COMPETITIONS[0].value);
  const [locationPermissionState, setLocationPermissionState] =
    useState(INITIAL_LOCATION_PERMISSION_STATE);
  const [isSpinner, setSpinner] = useState(false);
  const routeName = navigationRef.current.getCurrentRoute().name;

  const {
    clearState,
  } = useContext(CompetitionContext);

  useEffect(() => {
    clearState();
  }, []);

  const setCompetitionInfo = async () => {
    setSpinner(true);
    setLocationPermissionState(INITIAL_LOCATION_PERMISSION_STATE);
    let startUserLocation;
    let isLocationAllowed;
    try {
      startUserLocation = await getUserLocation();
      isLocationAllowed = startUserLocation.hasOwnProperty('coords');
      setLocationPermissionState(isLocationAllowed ?
        ALLOWED_LOCATION_PERMISSION_STATE :
        FORBIDDEN_LOCATION_PERMISSION_STATE,
      );
    } catch (err) {
      setLocationPermissionState(FORBIDDEN_LOCATION_PERMISSION_STATE);
    }
    if (isLocationAllowed) {
      const competition = {
        ...initCompetition,
        startUserLocation: startUserLocation,
      };
      const assembledCompetition = initializeSingleCompetition(competition);
      startSingleCompetition(assembledCompetition);
    }
  };

  const redirectToSettings = () => navigation.navigate(GENERAL_PARTICIPANT_START_SETTINGS_SCREEN, { routeName });
  useEffect(()=>{
    initCompetition.custom ? redirectToSettings() : null;
  }, [initCompetition]);

  const RenderSettingsList = () => {
    if (initCompetition.custom) {
      return null;
    }

    return (
      <View>
        <View style={styles.gameSettingsContainer}>
          <Text style={styles.competitionTitle}>Game settings</Text>
          <SettingsList initCompetition={initCompetition}/>
          <Separator />
        </View>
        <Button
          title='Start'
          backgroundColor={COLORS.green}
          buttonCode={tooltips.SINGLE_PARTICIPANT_COMPETITION_START_BTN}
          action={setCompetitionInfo}
          isLoading={isSpinner && locationPermissionState !== FORBIDDEN_LOCATION_PERMISSION_STATE}
        />
        <TouchableOpacity onPress={() => navigation.navigate(SPC_LOGS_SCREEN)}>
          <Text style={styles.advancedSettings}>Logs of last competition</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        currentRoute={header}
        openDrawer={navigation.openDrawer}
      />
      <WarningNotification
        isVisible={locationPermissionState === FORBIDDEN_LOCATION_PERMISSION_STATE}
        title={ALLOW_LOCATION_WARNING_TITLE}
        subTitle={ALLOW_LOCATION_WARNING_SUBTITLE}
      />
      <DefaultTitle
        title="Choose the difficulty level"
        titleCode={tooltips.DOMAIN_TITLE}
        centered={true}
      />
      <CustomDropDownPicker
        selectedItem={initCompetition}
        items={DEFAULT_SINGLE_COMPETITIONS}
        setItem={setInitCompetition}
        dropDownCode={tooltips.SINGLE_PARTICIPANT_COMPETITION_START_DROP_DOWN}
        withTooltip={true}
      />
      <RenderSettingsList />
    </View>
  );
};

export default GeneralCompetitionStartScreen;
