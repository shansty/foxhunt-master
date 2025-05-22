import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { styles } from '../../../components/competitions/statistics/styles';
import useSingleCompetition from '../../../hooks/useSingleCompetition';
import Header from '../../../components/parts/Header';
import { Context as CompetitionContext }
  from '../../../context/competition/active/CompetitionContext';
import Spinner from '../../../components/Spinner';
import CustomModal from '../../../components/CustomModal';
import useCompetition from '../../../hooks/useCompetition';
import OutOfPolygonNotification
  from '../../../components/notification/OutOfPolygonNotification';
import FoxNotification from '../../../components/notification/FoxNotification';
import CustomCountdown
  from '../../../components/competitions/part/CustomCountdown';
import CustomCircularPicker
  from '../../../components/competitions/part/CustomCircularPicker';
import { INITIAL_VOLUME } from '../../../utils/constants/commonConstants';
import FoxPoints from '../../../components/competitions/part/FoxPoints';
import { Button } from 'react-native-elements';
import DebugMode from '../../../components/competitions/part/DebugMode';
import DebugAdditions
  from '../../../components/competitions/part/DebugAdditions';

const GeneralCompetitionProcessScreen = ({ navigation }) => {
  const { state, changeSoundVolume } = useContext(CompetitionContext);
  const { handleClickChangeFrequency, isFinishModal, setFinishModal } = useCompetition();
  const { stop } = useSingleCompetition(navigation);
  const [isDebugShown, setIsDebugShown] = useState(false);
  const { competition, gameState, isError, isLoading } = state;

  const acceptAction = async () => {
    setFinishModal(false);
    await stop();
  };

  const disagreeAction = () => {
    setFinishModal(false);
  };

  useEffect(() => {
    if (isError) {
      memoizedFinishCallback();
    }
  }, [isError]);

  const memoizedFinishCallback = useCallback(stop, [state.scv]);
  const memoizedAcceptActionCallback = useCallback(acceptAction, [state.scv]);
  const memoizedDisagreeActionCallback = useCallback(disagreeAction, []);
  return (
    <View style={styles.container}>
      <Header
        currentRoute="TRY NOW!"
        openDrawer={() => setFinishModal(true)}
      />
      {isLoading ? <Spinner/> :
        <>
          <CustomModal
            isVisible={isFinishModal}
            acceptAction={memoizedAcceptActionCallback}
            disagreeAction={memoizedDisagreeActionCallback}
          />
          <OutOfPolygonNotification
            competitionDuration={competition.duration}
            positionOutOfLocation={state.positionOutOfLocation}
          />
          <FoxNotification isFoxFound={state.isFound} />
          <ScrollView style={{ width: '100%', paddingHorizontal: '10%' }}>
            <View>
              <CustomCountdown
                actualStartDate={state.startOfParticipation}
                competitionDuration={competition.duration}
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
              <Text style={styles.separator}/>
              <Text style={styles.competitionTitle}>Foxes</Text>
              <View style={styles.contentContainer}>
                <FoxPoints
                  foxPoints={competition.foxPoints}
                />
              </View>
              <Text style={styles.separator}/>
              <View style={styles.buttonShell}>
                <Button
                  buttonStyle={styles.finishButton}
                  title="Finish participation"
                  onPress={() => setFinishModal(true)}
                />
              </View>
              {!gameState.isRadioOrienteering && <View style={styles.buttonShell}>
                <Button
                  buttonStyle={styles.moreButton}
                  title="Debug Mode"
                  onPress={() => setIsDebugShown(!isDebugShown)}
                />
              </View>}
              {(isDebugShown || gameState.isRadioOrienteering) && (
                <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                  <DebugMode
                    latitude={competition.center.latitude}
                    longitude={competition.center.longitude}
                    polygon={competition.polygon}
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
              )}
            </View>
          </ScrollView>
        </>
      }
    </View>
  );
};

export default GeneralCompetitionProcessScreen;
