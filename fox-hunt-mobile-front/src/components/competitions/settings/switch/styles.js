import COLORS from '../../../../utils/constants/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  section: {
    paddingVertical: 5,
  },
  innerSection: {
    marginLeft: 20,
    marginRight: 15,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.pickerItem,
    borderWidth: 0,
    borderRadius: 5,
    marginHorizontal: -10,
    overflow: 'hidden',
  },
  choice: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choiceText: {
    color: 'white',
  },
});

export default styles;
