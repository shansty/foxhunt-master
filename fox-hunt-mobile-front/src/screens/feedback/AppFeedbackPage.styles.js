import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
  },
  secondaryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  greetingText: {
    color: COLORS.lightGrey,
    textAlign: 'center',
    fontSize: 12,
  },
  inputContainerStyle: {
    borderWidth: 1,
    borderColor: COLORS.blueBackground,
    borderRadius: 5,
    marginTop: 5,
    fontSize: 12,
    alignSelf: 'center',
    textAlignVertical: 'top',
    paddingHorizontal: 8,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.white,
  },
  button: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: COLORS.blueBackground,
    padding: 8,
    borderRadius: 5,
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.errorText,
    opacity: 0.8,
    marginHorizontal: 10,
    marginBottom: 15,
    marginTop: 15,
    textAlign: 'center',
  },
});

export default styles;
