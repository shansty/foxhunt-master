import React from 'react';
import { View } from 'react-native';
import moment from 'moment';
import ResultTime from '../resultTime/ResultTime';
import { convertToTimeFormat, difToDateFormat } from '../../../utils/commonUtils';
import { TIME_FORMAT } from '../../../utils/constants/commonConstants';
import CardInfo from '../cardInfo/CardInfo';


const CommandCompetitionResultCard = ({ item: { competition, startDate, finishDate, foundedFoxes }, createFoxPoint, styles }) => {
  return (
    <View style={{ ...styles.mainCardView, ...styles.commandCompetitionCard }}>
      <View>
        <View style={styles.foxPointsContainer}>
          {
            createFoxPoint(competition, foundedFoxes).map((data) => (
              data
            ))
          }
        </View>
        <ResultTime time={difToDateFormat(finishDate ?
          convertToTimeFormat(finishDate) : competition.actualFinishDate,
        moment(competition.startDate)
          .format(TIME_FORMAT))}/>
      </View>
      <View style={styles.singleCardInfoContainer}>
        <CardInfo competition={competition} startDate={startDate}/>
      </View>
    </View>
  );
};
export default CommandCompetitionResultCard;
