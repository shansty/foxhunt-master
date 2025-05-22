import COLORS from '../../../../utils/constants/colors';
import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  section: {
    paddingVertical: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValue: {
    width: 60,
    height: 30,
    marginRight: 10,
    backgroundColor: COLORS.blueBackground,
    borderRadius: 5,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#fff',
  },
  container: {
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  track: {
    width: Dimensions.get('window').width*0.7,
    height: 10,
    borderRadius: 4,
    backgroundColor: COLORS.pickerItem,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: COLORS.blueBackground,
    borderColor: COLORS.white,
    borderWidth: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.35,
  },
});

export default styles;
