import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

export default StyleSheet.create({
  mainCardView: {
    height: 90,
    alignItems: 'center',
    borderRadius: 15,
    shadowColor: COLORS.grey,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 6,
    marginBottom: 6,
    width: 370,
    justifyContent: 'space-between',
  },
  singleCompetitionCard: {
    marginRight: 20,
    marginLeft: 0,
    backgroundColor: COLORS.lavender,
  },
  foxPointsContainer: { flexDirection: 'row', width: '100%' },
  commandCompetitionCard: {
    marginRight: 0,
    marginLeft: 5,
    backgroundColor: COLORS.blueBackground,
  },
  singleCardInfoContainer: {
    marginLeft: 15,
  },
});
