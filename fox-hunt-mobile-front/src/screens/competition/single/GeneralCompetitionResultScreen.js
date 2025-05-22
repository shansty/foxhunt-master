import React, { useContext, useEffect } from 'react';
import { BackHandler, Text, View } from 'react-native';
import moment from 'moment';
import ListContentWithButton from '../../../components/list/ListContentWithButton';
import { styles } from '../../../components/competitions/statistics/styles';
import {
  DATE_FORMAT,
  INTERNAL_STORE_FOLDER_NAME_FOR_RESULTS,
  TIME_FORMAT,
} from '../../../utils/constants/commonConstants';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';
import Header from '../../../components/parts/Header';
import { SINGLE_COMPETITION_START } from '../../../utils/constants/routeNames';
import WarningNotification from '../../../components/notification/WarningNotification';
import {
  COMPETITION_WARNING_SUBTITLE,
  COMPETITION_WARNING_TITLE,
} from '../../../utils/constants/errors';
import saveToFile from '../../../utils/files/saveToFile';
import { convertToResultFormat } from '../../../utils/files/convertToResultFormat';

const GeneralCompetitionResultScreen = ({ navigation }) => {
  const { state } = useContext(CompetitionContext);
  const { gameState, competition, checkList, isError, startOfParticipation } = state;

  useEffect(() => {
    if (checkList) {
      const result = convertToResultFormat(state);
      saveToFile(result, INTERNAL_STORE_FOLDER_NAME_FOR_RESULTS);
    }
    const backAction = () => {
      navigation.navigate(SINGLE_COMPETITION_START);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <WarningNotification
        isVisible={isError}
        title={COMPETITION_WARNING_TITLE}
        subTitle={COMPETITION_WARNING_SUBTITLE}
      />
      <Header
        currentRoute="Result"
        openDrawer={navigation.openDrawer}
      />
      <View>
        <Text style={styles.separator}/>
        <Text style={styles.competitionTitle}>Your result is:</Text>
        <ListContentWithButton
          title={'Found foxes: '}
          value={gameState.foundFoxes + '/' + competition.foxAmount}
        />
        <ListContentWithButton
          title={'Time in the game:'}
          value={moment.utc(moment(checkList.completionTime, DATE_FORMAT)
            .diff(moment(startOfParticipation, DATE_FORMAT)))
            .format(TIME_FORMAT)}
        />
        <Text style={styles.separator}/>
        <Text style={styles.competitionTitle}>Thanks for participation!</Text>
      </View>
    </View>
  );
};

export default GeneralCompetitionResultScreen;

