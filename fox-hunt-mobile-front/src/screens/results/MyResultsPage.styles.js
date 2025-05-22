import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 45,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: '70%',
    marginHorizontal: 15,
  },
});
