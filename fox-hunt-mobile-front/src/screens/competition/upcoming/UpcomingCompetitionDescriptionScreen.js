import React, { useContext } from 'react';
import { Button } from 'react-native-elements';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../utils/constants/colors';
import Header from '../../../components/parts/Header';
import { TRAINER } from '../../../utils/constants/role';
import Spinner from '../../../components/Spinner';
import CompetitionDescription
  from '../../../components/competitions/CompetitionDescription';
import CompetitionMap from '../../../components/competitions/part/CompetitionMap';
import { ACCEPTED, DECLINED, PENDING } from '../../../utils/constants/inviteStatuses';
import { Context as UpcomingCompetitionContext }
  from '../../../context/competition/UpcomingCompetitionContext';
import {
  LATITUDE_INDEX,
  LONGITUDE_INDEX,
} from '../../../utils/constants/commonConstants';

const UpcomingCompetitionDescriptionScreen = ({ navigation }) => {
  const {
    state,
    subscribeToCompetition,
    acceptCompetitionInvite,
    declineInvitation,
    leaveTheCompetition,
  } = useContext(UpcomingCompetitionContext);
  const { currentCompetition } = state;

  return state.isLoading ? <Spinner/> :
    <View style={styles.container}>
      <Header
        currentRoute={currentCompetition.name}
        openDrawer={navigation.openDrawer}
      />
      <ScrollView>
        <View style={styles.competitionDescription}>
          <CompetitionDescription
            currentCompetition={currentCompetition}
          />
          <CompetitionMap
            startPoint={currentCompetition.startPoint}
            finishPoint={currentCompetition.finishPoint}
            polygon={currentCompetition.location.coordinates.coordinates}
            centerOfLocation={{
              latitude: currentCompetition.location.center.coordinates[LATITUDE_INDEX],
              longitude: currentCompetition.location.center.coordinates[LONGITUDE_INDEX],
            }}
          />
        </View>
        {!!state.errorMessage && <Text style={styles.errorMessage}>{state.errorMessage}</Text>}
        {currentCompetition.invitationStatus && currentCompetition.invitationStatus !== DECLINED ?
          <View style={styles.buttonsBlock}>
            <View style={styles.buttonShell}>
              {currentCompetition.invitationStatus === ACCEPTED ?
                <Button
                  buttonStyle={styles.declineButton}
                  title="Decline"
                  onPress={() => leaveTheCompetition(currentCompetition.id)}
                /> :
                <Button
                  buttonStyle={styles.declineButton}
                  title="Decline"
                  onPress={() => declineInvitation(currentCompetition.id)}
                />
              }
            </View>
            {(currentCompetition.invitationStatus === PENDING ||
              currentCompetition.invitationStatus === ACCEPTED) &&
              currentCompetition.source === TRAINER &&
            <>
              <Text style={styles.separator} />
              <View style={styles.buttonShell}>
                <Button
                  buttonStyle={styles.acceptButton}
                  title="Join"
                  onPress={() => acceptCompetitionInvite(currentCompetition.id)}
                />
              </View>
            </>
            }
          </View> :
          <View style={styles.buttonShell}>
            <Button
              buttonStyle={styles.submitButton}
              title="Join"
              onPress={() => subscribeToCompetition(currentCompetition.id)}
            />
          </View>
        }
      </ScrollView>
    </View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 47,
    backgroundColor: COLORS.greyBackground,
  },
  competitionDescription: {
    paddingHorizontal: 11.5,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: -10,
    textAlign: 'center',
  },
  buttonsBlock: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 10,
  },
  buttonShell: {
    flex: 1,
    marginBottom: 10,
  },
  declineButton: {
    backgroundColor: COLORS.red,
    borderRadius: 5,
    color: COLORS.black,
  },
  separator: {
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: COLORS.green,
    borderRadius: 5,
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    marginHorizontal: 10,
    color: COLORS.black,
  },
});

export default UpcomingCompetitionDescriptionScreen;
