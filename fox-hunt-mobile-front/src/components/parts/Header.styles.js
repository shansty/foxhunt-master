import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.headerBackground,
    height: 45,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingRight: 3,
    borderColor: COLORS.greyBackground,
    borderTopWidth: 0.5,
  },
  menuContainer: {
    paddingLeft: 10,
  },
  menu: {
    alignSelf: 'flex-end',
    color: COLORS.white,
    fontSize: 28,
  },
  routeName: {
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: '13%',
    paddingBottom: 3,
    color: COLORS.white,
  },
});

export default styles;
