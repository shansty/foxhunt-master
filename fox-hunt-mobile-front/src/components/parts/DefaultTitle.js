import React from 'react';
import { Text, View } from 'react-native';
import Tooltip from './Tooltip';
import styles from './DefaultTitle.styles';

const DefaultTitle = ({ title, titleCode, centered }) => {
  return (
    <>
      <View style={[styles.tooltipContainer, (titleCode && centered) && { paddingLeft: 30 }]}>
        {titleCode && (
          <View style={{ marginLeft: 5, marginTop: 1.5 }}>
            <Tooltip message={titleCode} />
          </View>
        )}
      </View>
      {!!title && <Text style={styles.titleText}>{title}</Text>}
    </>
  );
};

export default DefaultTitle;
