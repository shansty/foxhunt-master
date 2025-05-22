import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 47,
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: 5,
    height: 40,
  },
  pickerLabel: {
    color: COLORS.white,
    fontSize: 15,
    paddingBottom: 5,
  },
  form: {
    paddingTop: 10,
    justifyContent: 'center',
  },
  pickerItemStyle: {
    justifyContent: 'flex-start',
    paddingTop: 1,
    paddingBottom: 5,
  },
  pickerContainerStyle: {
    height: 40,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default styles;
