import { StyleSheet } from 'react-native';
import COLORS from '../../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  pickerStyle: {
    backgroundColor: COLORS.pickerItem,
    borderWidth: 0,
  },
  pickerContainer: {
    flex: 1,
    height: 40,
    marginTop: 5,
  },
  pickerLabel: {
    color: COLORS.white,
  },
  pickerItem: {
    justifyContent: 'flex-start',
    paddingTop: 7,
    paddingBottom: 7,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    backgroundColor: COLORS.pickerItem,
    color: COLORS.white,
  },
  activeLabel: {
    color: COLORS.grey,
  },
  pickerActiveItem: {
    backgroundColor: COLORS.pickerActiveItem,
  },
  pickerDropDown: {
    backgroundColor: COLORS.pickerItem,
    borderWidth: 0,
    borderTopWidth: 0.5,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
});

export default styles;
