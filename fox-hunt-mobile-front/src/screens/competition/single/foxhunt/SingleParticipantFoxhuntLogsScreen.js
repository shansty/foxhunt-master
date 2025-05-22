import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import COLORS from '../../../../utils/constants/colors';
import Header from '../../../../components/parts/Header';
import Tooltip from '../../../../components/parts/Tooltip';
import {
  HELP_LOG_SCREEN,
  TABLE_COLUMN,
} from '../../../../utils/constants/commonConstants';
import takeDataFromInternalStore from '../../../../utils/files/takeDataFromInternalStore';

const SingleParticipantFoxhuntLogsScreen = ({ navigation }) => {
  const [scv, setScv] = useState([]);

  const getScv = async () => {
    const data = await takeDataFromInternalStore();
    const arr = data[0].split(',');
    const subarray = [];
    for (let i = 0; i < Math.ceil(arr.length / TABLE_COLUMN); i++) {
      subarray[i] = arr.slice((i * TABLE_COLUMN), (i * TABLE_COLUMN) + TABLE_COLUMN);
    }
    setScv(subarray);
  };

  useEffect(() => {
    getScv();
  }, []);
  return (
    <View style={styles.container}>
      <Header
        currentRoute="Logs"
        openDrawer={navigation.openDrawer}
      />
      <View style={styles.helpSectionContainer}>
        <Text style={styles.helpText}>Help</Text>
        <Tooltip message={HELP_LOG_SCREEN}
          width={240}/>
      </View>
      <ScrollView horizontal={true}>
        <ScrollView>
          <View style={styles.column}>
            {scv.map((values, arrIndex) => {
              return (
                <View key={arrIndex}>
                  <View style={ styles.row }>
                    {values.map((value, index) => {
                      if (arrIndex + 1 < scv.length && index < values.length) {
                        const firstOrThirdColumn = index !== 1 && index !== 3;
                        return (
                          <View key={value + index}
                            style={firstOrThirdColumn ? styles.smallColumn : styles.cell }>
                            <Text style={styles.cellText}>
                              {
                                /*  For correct display in excel,*/
                                /*  a line break is added at the end of each line,*/
                                /*  this expression removes a line break for correct display*/
                              }
                              {(arrIndex >= 1 && index === 0) ? value.slice(1) : value}
                            </Text>
                          </View>
                        );
                      }
                      return;
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 55,
    paddingHorizontal: 1,
    backgroundColor: COLORS.greyBackground,
  },
  helpSectionContainer: { paddingVertical: 10, flexDirection: 'row' },
  helpText: { color: 'white', paddingHorizontal: 5 },
  column: { flexDirection: 'column' },
  row: { flexDirection: 'row' },
  cell: { width: 100, height: 30, borderWidth: 0.75, borderColor: COLORS.white },
  smallColumn: { width: 65, height: 30, borderWidth: 0.75, borderColor: COLORS.white },
  cellText: { color: COLORS.white, paddingHorizontal: 3, alignSelf: 'center' },
});

export default SingleParticipantFoxhuntLogsScreen;
