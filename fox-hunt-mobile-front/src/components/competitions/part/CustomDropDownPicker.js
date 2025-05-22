import React, { useContext } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Context as CommonContext } from '../../../context/CommonContext';
import COLORS from '../../../utils/constants/colors';
import Tooltip from '../../parts/Tooltip';
import styles from './CustomDropDownPicker.styles';

const CustomDropDownPicker = ({ selectedItem, items, setItem, dropDownCode, withTooltip }) => {
  const { state } = useContext(CommonContext);

  const dropDownPickerTooltipRender = state.tooltips?.hasOwnProperty(dropDownCode) && withTooltip;
  return (
    <View style={[
      styles.container,
      dropDownPickerTooltipRender && { marginLeft: 30 },
    ]}>
      <DropDownPicker
        defaultValue={selectedItem}
        items={items}
        style={styles.pickerStyle}
        containerStyle={[
          styles.pickerContainer,
          dropDownPickerTooltipRender && { marginRight: 10 },
        ]}
        labelStyle={styles.pickerLabel}
        itemStyle={styles.pickerItem}
        arrowColor={COLORS.white}
        activeLabelStyle={styles.activeLabel}
        activeItemStyle={styles.pickerActiveItem}
        dropDownStyle={styles.pickerDropDown}
        onChangeItem={(item) => setItem(item.value)}
      />
      {dropDownPickerTooltipRender && (
        <View style={{ marginTop: 5 }}>
          <Tooltip message={state.tooltips[dropDownCode]} />
        </View>
      )}
    </View>
  );
};

export default CustomDropDownPicker;
