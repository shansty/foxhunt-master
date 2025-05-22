import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import COLORS from '../../../utils/constants/colors';
import { capitalizeFirstLetter } from '../../../utils/commonUtils';
import ListContent from '../../list/ListContent';

const RenderUpcomingCompetitionSectionContent = ({ competition, setCurrentCompetition }) => (
  <View style={styles.contentBlock}>
    <Text style={styles.competitionTitle}>Description</Text>
    <Text style={styles.competitionContent}>
      {capitalizeFirstLetter(competition.notes)}
    </Text>
    <Text style={styles.separator} />
    <Text style={styles.competitionTitle}>Settings</Text>
    <ListContent title={'Fox amount:'} value={competition.foxAmount} />
    <ListContent title={'Fox duration:'} value={competition.foxDuration} />
    <ListContent title={'Distance:'} value={competition.distanceType.distanceLength} />
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
        title="View Details"
        onPress={() =>
          setCurrentCompetition(competition.id, competition.invitationStatus, competition.source)
        }
      />
    </View>
  </View>
);

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
  competitionTitle: {
    textAlign: 'center',
    color: COLORS.white,
    paddingTop: 10,
    fontSize: 16,
  },
  competitionContent: {
    color: COLORS.white,
    opacity: 0.8,
    paddingTop: 5,
  },
  separator: {
    marginTop: 10,
    height: 0,
    borderColor: COLORS.blueBackground,
    borderWidth: 0.5,
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    color: COLORS.black,
  },
  buttonContainer: {
    paddingTop: 10,
  },
});

export default RenderUpcomingCompetitionSectionContent;
