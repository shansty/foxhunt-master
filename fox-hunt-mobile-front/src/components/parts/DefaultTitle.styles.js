import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

const styles = StyleSheet.create({
  tooltipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
    marginBottom: 15,
    color: COLORS.white,
  },
  subTitleText: {
    color: COLORS.lavender,
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default styles;
