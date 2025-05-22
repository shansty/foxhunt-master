import React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View } from 'react-native';
import CountDown from 'react-native-countdown-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../../utils/constants/colors';
import { capitalizeFirstLetter } from '../../../utils/commonUtils';

const RenderCommandCompetitionSectionHeader = ({ competition, email, isActive }) => {
  const timeToStart = moment(competition.participants
    .find((participant) => participant.email === email).startDate)
    .diff(moment(), 'seconds');

  return (
    <View
      style={isActive ?
        [styles.headerContainer, styles.activeBorderRadius] : styles.headerContainer
      }
    >
      <View style={styles.competitionContainer}>
        <View style={styles.competitionRowContainer}>
          <Text numberOfLines={1} style={styles.competitionName}>
            {capitalizeFirstLetter(competition.name)}
          </Text>
        </View>
        {timeToStart <= 0 ?
          <Text style={styles.competitionDate}>Active</Text> :
          <View style={styles.competitionRowContainer}>
            <CountDown
              size={10}
              until={timeToStart}
              digitStyle={{ backgroundColor: COLORS.lavender }}
              digitTxtStyle={{ color: COLORS.white, fontSize: 13 }}
              separatorStyle={{ color: COLORS.white, padding: 0 }}
              timeToShow={['M', 'S']}
              timeLabels={{ m: null, s: null }}
              showSeparator
            />
            <Text numberOfLines={1} style={styles.competitionDateTitle}>
              before the start
            </Text>
          </View>
        }
      </View>
      <View style={styles.centeredArrow}>
        <Ionicons
          name={isActive ? 'chevron-up-outline' : 'chevron-down-outline'}
          style={styles.arrowIcon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  activeBorderRadius: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    marginTop: 10,
  },
  competitionContainer: {
    maxWidth: '80%',
  },
  competitionRowContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitionName: {
    color: COLORS.white,
    fontSize: 18,
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  competitionDate: {
    color: COLORS.green,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  competitionDateTitle: {
    color: COLORS.white,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  centeredArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5,
  },
  arrowIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
});

export default RenderCommandCompetitionSectionHeader;
