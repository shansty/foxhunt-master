import React, { useContext, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import Header from '../../../components/parts/Header';
import COLORS from '../../../utils/constants/colors';
import {
  ALLOWED_LOCATION_PERMISSION_STATE,
  DEFAULT_AREA,
  DEFAULT_COMPETITION_DURATION,
  DEFAULT_FOX_AMOUNT,
  DEFAULT_FOX_DURATION,
  DEFAULT_FREQUENCY,
  DEFAULT_SILENCE_INTERVAL,
  FORBIDDEN_LOCATION_PERMISSION_STATE,
  INITIAL_LOCATION_PERMISSION_STATE,
} from '../../../utils/constants/commonConstants';
import getUserLocation from '../../../utils/userLocation/getUserLocation';
import { clearState } from '../../../context/competition/active/action/CompetitionActions';
import Button from '../../../components/parts/Button';
import DefaultTitle from '../../../components/parts/DefaultTitle';
import WarningNotification from '../../../components/notification/WarningNotification';
import {
  ALLOW_LOCATION_WARNING_SUBTITLE,
  ALLOW_LOCATION_WARNING_TITLE,
} from '../../../utils/constants/errors';
import { Context as CommonContext } from '../../../context/CommonContext';
import {
  GameSettingsCheckboxItem,
  GameSettingsSlideItem,
  GameSettingsSwitchItem,
} from '../../../components/competitions/settings';
import { getSettingsList } from '../../../utils/commonUtils';
import styles from '../single/GeneralCompetitionStartSettingsScreen.styles';
import { SINGLE_COMPETITION_START } from '../../../utils/constants/routeNames';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';

const GeneralCompetitionStartSettingsScreen = ({ navigation, route }) => {
  const { state: { tooltips } } = useContext(CommonContext);
  const {
    initializeSingleCompetition,
    startSingleCompetition,
    startSingleRadioOrienteeringCompetition,
  } = useContext(CompetitionContext);
  const [locationPermissionState, setLocationPermissionState] =
    useState(INITIAL_LOCATION_PERMISSION_STATE);
  const [isSpinner, setSpinner] = useState(false);
  const [competition, setCompetition] = useState({
    duration: DEFAULT_COMPETITION_DURATION,
    area: DEFAULT_AREA,
    foxAmount: DEFAULT_FOX_AMOUNT,
    frequency: DEFAULT_FREQUENCY,
    foxDuration: DEFAULT_FOX_DURATION,
    hasSilenceInterval: DEFAULT_SILENCE_INTERVAL,
  });
  const previousRoute = route.params.routeName;
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
      const _competition = {
        ...competition,
        startUserLocation: startUserLocation,
      };
      const assembledCompetition = initializeSingleCompetition(_competition);
      if (previousRoute === SINGLE_COMPETITION_START) {
        startSingleCompetition(assembledCompetition);
      } else {
        startSingleRadioOrienteeringCompetition(assembledCompetition);
      }
    }
  };

  const renderSliderItem = (item) => (
    <GameSettingsSlideItem
      textCode={tooltips[item.textCode]}
      item={item}
      competition={competition}
      setValue={setCompetition}
    />
  );

  const renderSwitchItem = (item) => (
    <GameSettingsSwitchItem
      textCode={tooltips[item.textCode]}
      item={item}
      competition={competition}
      setValue={setCompetition}
    />
  );

  const renderCheckboxItem = (item) => (
    <GameSettingsCheckboxItem
      textCode={tooltips[item.textCode]}
      item={item}
      competition={competition}
      setValue={setCompetition}
    />
  );

  return (
    <View style={styles.container}>
      <Header
        currentRoute="Game Settings"
        openDrawer={navigation.openDrawer}
      />
      <WarningNotification
        isVisible={locationPermissionState === FORBIDDEN_LOCATION_PERMISSION_STATE}
        title={ALLOW_LOCATION_WARNING_TITLE}
        subTitle={ALLOW_LOCATION_WARNING_SUBTITLE}
      />
      <DefaultTitle
        title="Customize Game Settings"
        titleCode={tooltips.SINGLE_PARTICIPANT_COMPETITION_SETTINGS_START_TITLE}
        centered={true}
      />
      <View style={styles.form}>
        <FlatList data={getSettingsList(competition)} renderItem={({ item })=>{
          switch (item.type) {
            case 'slider':
              return renderSliderItem(item);
            case 'radio':
              return renderSwitchItem(item);
            case 'checkbox':
              return renderCheckboxItem(item);
          }
        }}/>
      </View>
      <Button
        title='Start'
        backgroundColor={COLORS.green}
        buttonCode={tooltips.SINGLE_PARTICIPANT_COMPETITION_START_WITH_SETTINGS_BTN}
        action={setCompetitionInfo}
        isLoading={isSpinner && locationPermissionState !== FORBIDDEN_LOCATION_PERMISSION_STATE}
      />
    </View>
  );
};

export default GeneralCompetitionStartSettingsScreen;
