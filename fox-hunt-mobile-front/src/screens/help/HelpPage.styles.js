import { StyleSheet } from 'react-native';
import COLORS from '../../utils/constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.greyBackground,
  },
  flatListStyle: { marginTop: 50 },
  item: {
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: COLORS.blueBackground,
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer: {
    flexDirection: 'column',
    maxWidth: '90%',
  },
  itemName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: '700',
  },
  itemDescription: {
    color: COLORS.lightGrey,
    fontSize: 14,
    fontWeight: '100',
  },
  iconView: {
    alignSelf: 'flex-start',
  },
});

export default styles;
