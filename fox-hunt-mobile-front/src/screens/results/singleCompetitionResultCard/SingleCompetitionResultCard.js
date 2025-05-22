import React from 'react';
import { View } from 'react-native';
import CardInfo from '../cardInfo/CardInfo';
import ResultTime from '../resultTime/ResultTime';


const SingleCompetitionResultCard = ({ item: { competition, startDate, foundedFoxes }, createFoxPoint, styles }) => {
  return (
    <View style={{ ...styles.mainCardView, ...styles.singleCompetitionCard }}>
      <View>
        <CardInfo competition={competition} startDate={startDate}/>
      </View>
      <View>
        <View style={styles.foxPointsContainer}>
          {
            createFoxPoint(competition, foundedFoxes).map((data) => (
              data
            ))
          }
        </View>
        <ResultTime time={competition.startDate}/>
      </View>
    </View>
  );
};
export default SingleCompetitionResultCard;
