import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 47,
    backgroundColor: COLORS.greyBackground,
  },
  competitionTitle: {
    alignSelf: 'center',
    color: COLORS.white,
    marginTop: 7,
    fontSize: 18,
  },
  descriptionBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  separator: {
    marginTop: 10,
    height: 0,
    borderColor: COLORS.blueBackground,
    borderWidth: 0.5,
  },
  contentContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsRow: {
    display: 'flex',
    paddingVertical: 5,
    flexDirection: 'row',
    marginVertical: 10,
  },
  buttonShell: {
    flex: 1,
    marginTop: 10,
  },
  buttonSeparator: {
    marginHorizontal: 5,
  },
  finishButton: {
    backgroundColor: COLORS.red,
    borderRadius: 5,
    color: COLORS.black,
  },
  moreButton: {
    backgroundColor: COLORS.grey,
    borderRadius: 5,
    color: COLORS.black,
  },
  error: {
    color: COLORS.white,
    marginVertical: '60%',
    alignSelf: 'center',
    fontSize: 16,
  },
  descriptionText: {
    color: COLORS.white,
    fontSize: 15,
    marginTop: 3,
  },
});
