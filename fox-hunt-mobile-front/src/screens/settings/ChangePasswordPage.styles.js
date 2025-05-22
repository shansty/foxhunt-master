import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: '15%',
    backgroundColor: COLORS.greyBackground,
    paddingHorizontal: 10,
  },
  inputsBlock: {
    paddingTop: 10,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: COLORS.blueBackground,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: -10,
    marginHorizontal: -10,
  },
  inputStyle: {
    color: COLORS.white,
    fontSize: 15,
  },
  inputLabelStyle: {
    marginHorizontal: -10,
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 20,
    marginTop: -5,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default styles;
