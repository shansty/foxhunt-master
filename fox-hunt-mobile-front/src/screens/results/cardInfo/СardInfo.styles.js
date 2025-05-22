import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

export default StyleSheet.create({
  cardInfoContainer: {
    width: 180,
  },
  nameText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    paddingRight: 10,
  },
  startText: {
    fontSize: 14,
    color: COLORS.black,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  startTextContainer: {
    marginTop: 4,
    borderWidth: 0,
    width: '100%',
  },
  locationText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  locationTextContainer: {
    marginTop: 4,
    borderWidth: 0,
    width: '100%',
  },
  timeText: {
    color: COLORS.gray,
    fontSize: 15,
  },
});
