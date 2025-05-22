import React from 'react';
import { StyleSheet, Text } from 'react-native';
import moment from 'moment';
import COLORS from '../../utils/constants/colors';
import ListContentWithButton from '../list/ListContentWithButton';
import { capitalizeFirstLetter } from '../../utils/commonUtils';

const CompetitionDescription = ({ currentCompetition }) => (
  <>
    <Text style={styles.competitionTitle}>Description</Text>

    {!!currentCompetition.name &&
      <ListContentWithButton title="Name:" value={capitalizeFirstLetter(currentCompetition.name)} />
    }

    {!!currentCompetition.location.name &&
      <ListContentWithButton
        title="Location:"
        value={capitalizeFirstLetter(currentCompetition.location.name)}
      />
    }

    {(!!currentCompetition.coach.firstName && !!currentCompetition.coach.lastName) &&
      <ListContentWithButton
        title="Coach:"
        value={capitalizeFirstLetter(currentCompetition.coach.firstName) + ' ' +
        capitalizeFirstLetter(currentCompetition.coach.lastName)}
      />
    }

    {!!currentCompetition.notes &&
      <Text style={styles.competitionContent}>
        {capitalizeFirstLetter(currentCompetition.notes)}
      </Text>
    }

    <Text style={styles.separator} />
    <Text style={styles.competitionTitle}>Settings</Text>
    <ListContentWithButton
      title="Number of foxes:"
      value={currentCompetition.foxAmount}
    />
    <ListContentWithButton
      title="Duration:"
      value={currentCompetition.foxDuration + 'min'}
    />
    <ListContentWithButton
      title="Distance:"
      value={currentCompetition.distanceType.distanceLength + 'm'}
    />
    <ListContentWithButton
      title="Participants:"
      value={currentCompetition.participants.length}
    />
    <ListContentWithButton
      title="Date:"
      value={moment(currentCompetition.startDate).format('dddd, LL')}
    />
    <ListContentWithButton
      title="Approximate time:"
      value={moment(currentCompetition.startDate).format('LT')}
    />
  </>
);

const styles = StyleSheet.create({
  competitionTitle: {
    alignSelf: 'center',
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
});

export default CompetitionDescription;
