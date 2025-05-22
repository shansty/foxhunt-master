import { StyleSheet } from 'react-native';
import COLORS from '../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyBackground,
    paddingTop: 10,
  },
  dataText: {
    color: COLORS.white,
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  drawerIcon: {
    color: COLORS.white,
    fontSize: 20,
    opacity: 0.7,
  },
  helpBlock: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
export default styles;
