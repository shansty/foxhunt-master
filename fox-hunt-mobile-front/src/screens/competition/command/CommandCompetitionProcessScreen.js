import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Header from '../../../components/parts/Header';
import Spinner from '../../../components/Spinner';
import CustomModal from '../../../components/CustomModal';
import useCompetition from '../../../hooks/useCompetition';
import { Context as CompetitionContext } from '../../../context/competition/active/CompetitionContext';
import useCommandCompetition from '../../../hooks/useCommandCompetition';
import OutOfPolygonNotification from '../../../components/notification/OutOfPolygonNotification';
import FoxNotification from '../../../components/notification/FoxNotification';
import CustomCountdown from '../../../components/competitions/part/CustomCountdown';
import CustomCircularPicker from '../../../components/competitions/part/CustomCircularPicker';
import {
  INITIAL_VOLUME,
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
} from '../../../utils/constants/commonConstants';
import FoxPoints from '../../../components/competitions/part/FoxPoints';
import { Button } from 'react-native-elements';
import DebugMode from '../../../components/competitions/part/DebugMode';
import DebugAdditions from '../../../components/competitions/part/DebugAdditions';
import { styles } from '../../../components/competitions/statistics/styles';
import { createConnection } from '../../../context/competition/active/action/CommandCompetitionActions';

const CommandCompetitionProcessScreen = ({ navigation }) => {
  const [eventSource, setEventSource] = useState(null);
  const { state, changeSoundVolume, dispatch } = useContext(CompetitionContext);
  const { handleClickChangeFrequency, isFinishModal, setFinishModal } = useCompetition();
  const { stop } = useCommandCompetition(navigation, eventSource);
  const { competition, gameState } = state;

  const acceptAction = async () => {
    setFinishModal(false);
    await stop(eventSource);
  };
  const disagreeAction = () => {
    setFinishModal(false);
  };
  useEffect(()=>{
    async function createSseConnection() {
      return await createConnection(dispatch)(competition);
    }
    createSseConnection().then((data)=>setEventSource(data));
  }, []);

  const memoizedFinishCallback = useCallback(stop, []);
  const memoizedAcceptActionCallback = useCallback(()=>acceptAction(eventSource), [eventSource]);
  const memoizedDisagreeActionCallback = useCallback(disagreeAction, []);
  return state.isLoading ? <Spinner/> :
    <View style={styles.container}>
      <Header
        currentRoute={state.competition.name}
        openDrawer={() => setFinishModal(true)}
      />
      <CustomModal
        isVisible={isFinishModal}
        acceptAction={memoizedAcceptActionCallback}
        disagreeAction={memoizedDisagreeActionCallback}
      />
      <OutOfPolygonNotification
        positionOutOfLocation={state.positionOutOfLocation}
        competitionDuration={gameState.activeCompetition.competitionDuration}
      />
      <FoxNotification isFoxFound={state.isFound} />
      <ScrollView style={{ width: '100%', paddingHorizontal: '10%' }}>
        <View>
          <CustomCountdown
            actualStartDate={competition.actualStartDate}
            competitionDuration={gameState.activeCompetition.competitionDuration}
            onFinish={memoizedFinishCallback}
          />
          <Text style={styles.separator}/>
          <View style={styles.descriptionBlock}>
            <CustomCircularPicker
              title={'Frequency'}
              value={state.frequency}
              handleChange={handleClickChangeFrequency}
            />
            <CustomCircularPicker
              title={'Volume'}
              value={state.volume}
              handleChange={changeSoundVolume}
              defaultPos={INITIAL_VOLUME}
            />
          </View>
          <Text style={styles.separator} />
          <Text style={styles.competitionTitle}>Foxes</Text>
          <View style={styles.contentContainer}>
            <FoxPoints
              foxPoints={competition.foxPoints}
              foundFoxes={gameState.foundFoxes}
            />
          </View>
          <Text style={styles.separator} />
          <View style={styles.buttonShell}>
            <Button
              buttonStyle={styles.finishButton}
              title="Finish participation"
              onPress={() => setFinishModal(true)}
            />
          </View>
          <DebugMode
            longitude={competition.location.center.coordinates[LONGITUDE_INDEX]}
            latitude={competition.location.center.coordinates[LATITUDE_INDEX]}
            polygon={competition.location.coordinates}
            foxPoints={competition.foxPoints}
            currentFox={gameState.currentFox}
          />
          <DebugAdditions
            userLocation={state.userLocation}
            calculatedSoundLevel={state.calculatedSoundLevel}
            volume={state.volume}
            gameState={state.gameState}
          />
        </View>
      </ScrollView>
    </View>;
};

export default CommandCompetitionProcessScreen;
