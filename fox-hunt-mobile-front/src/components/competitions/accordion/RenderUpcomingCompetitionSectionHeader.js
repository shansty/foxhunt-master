import React from 'react';
import moment from 'moment';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../../utils/constants/colors';
import { TRAINER } from '../../../utils/constants/role';
import { capitalizeFirstLetter } from '../../../utils/commonUtils';
import { ACCEPTED, DECLINED, PENDING } from '../../../utils/constants/inviteStatuses';

const RenderUpcomingCompetitionSectionHeader = (competition, index, isActive) => {
  const getBadgeColor = () => {
    switch (competition.invitationStatus) {
      case PENDING:
        return styles.orangeBackground;
      case ACCEPTED:
        return styles.greenBackground;
      case DECLINED:
        return styles.redBackground;
      default:
        return styles.defaultBackground;
    }
  };
  return (
    <View
      style={isActive ? [styles.headerContainer, styles.activeBorderRadius] :
        styles.headerContainer
      }
    >
      <View style={styles.competitionContainer}>
        <View style={styles.competitionNameContainer}>
          <Text numberOfLines={1} style={styles.competitionName}>
            {capitalizeFirstLetter(competition.name)}
          </Text>
          {!!competition.invitationStatus && competition.source === TRAINER &&
            <Ionicons name="mail-unread-outline" style={styles.messageIcon} />
          }
        </View>
        <Text style={styles.competitionDescription}>
          {capitalizeFirstLetter(competition.location.name)}
        </Text>
        <Text numberOfLines={1} style={styles.competitionDate}>
          {moment(competition.startDate).format('LL - dddd LT')}
        </Text>
      </View>
      <View style={competition.invitationStatus ? styles.statusContainer : styles.centeredArrow}>
        {!!competition.invitationStatus && <View style={[getBadgeColor(), styles.badge]} />}
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
  defaultBackground: {
    backgroundColor: COLORS.blueBackground,
  },
  orangeBackground: {
    backgroundColor: COLORS.orange,
  },
  greenBackground: {
    backgroundColor: COLORS.green,
  },
  redBackground: {
    backgroundColor: COLORS.red,
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
  competitionNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  competitionName: {
    color: COLORS.white,
    fontSize: 18,
    paddingVertical: 2,
  },
  competitionDescription: {
    color: COLORS.white,
    opacity: 0.8,
    paddingVertical: 1,
  },
  competitionDate: {
    color: COLORS.white,
    fontSize: 16,
    paddingVertical: 1,
  },
  messageIcon: {
    paddingHorizontal: 5,
    fontSize: 18,
    color: COLORS.white,
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
    paddingTop: 10,
  },
  centeredArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 50,
  },
  arrowIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
});

export default RenderUpcomingCompetitionSectionHeader;
