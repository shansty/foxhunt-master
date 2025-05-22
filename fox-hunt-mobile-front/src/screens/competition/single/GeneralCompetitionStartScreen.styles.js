import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 11.5,
    justifyContent: 'center',
  },
  gameSettingsContainer: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  competitionTitle: {
    alignSelf: 'center',
    color: COLORS.white,
    paddingTop: 10,
    paddingBottom: 5,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: 5,
    height: 40,
  },
  advancedSettings: {
    color: COLORS.grey,
    alignSelf: 'center',
    paddingTop: 10,
    textDecorationLine: 'underline',
  },
});

export default styles;
