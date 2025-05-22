import React, { useContext, useEffect } from 'react';
import { BackHandler, Text, View } from 'react-native';
import moment from 'moment';
import ListContentWithButton from '../../../components/list/ListContentWithButton';
import { styles } from '../../../components/competitions/statistics/styles';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';
import { COMMAND_COMPETITIONS } from '../../../utils/constants/routeNames';
import Header from '../../../components/parts/Header';
import WarningNotification from '../../../components/notification/WarningNotification';
import {
  COMPETITION_WARNING_SUBTITLE,
  COMPETITION_WARNING_TITLE,
} from '../../../utils/constants/errors';
import { SERVER_DATE_FORMAT, TIME_FORMAT } from '../../../utils/constants/commonConstants';

const CommandCompetitionResultScreen = ({ navigation }) => {
  const { state } = useContext(CompetitionContext);

  useEffect(() => {
    const backAction = () => {
      navigation.navigate(COMMAND_COMPETITIONS);
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
        isVisible={state.isError}
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
          value={(state.foundFoxes || state.gameState.results[0].foundFoxes) +
          '/' + state.competition.foxAmount}
        />
        <ListContentWithButton
          title={'Time in the game:'}
          value={moment.utc(moment(state.gameState.results[0].finishDate, SERVER_DATE_FORMAT)
            .diff(moment(state.gameState.results[0].startDate, SERVER_DATE_FORMAT)))
            .format(TIME_FORMAT)}

        />
        <Text style={styles.separator}/>
        <Text style={styles.competitionTitle}>Thanks for participation!</Text>
      </View>
    </View>
  );
};

export default CommandCompetitionResultScreen;

