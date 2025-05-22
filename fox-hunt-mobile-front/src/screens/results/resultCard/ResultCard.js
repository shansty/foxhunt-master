import React from 'react';
import FoxPoint from '../foxPoint/FoxPoint';

import styles from './ResultCard.styles';
import SingleCompetitionResultCard
  from '../singleCompetitionResultCard/SingleCompetitionResultCard';
import CommandCompetitionResultCard
  from '../commandCompetitionResultCard/CommandCompetitionResultCard';
const ResultCard = ({ item }) => {
  const createFoxPoint = (competition, foundedFoxes ) => {
    const arr = [];
    Array(competition.foxAmount).fill().map((_, index)=>{
      if (index < foundedFoxes) {
        arr.push(
          <FoxPoint key={index} isFound={true}/>,
        );
      } else {
        arr.push(
          <FoxPoint key={index} isFound={false}/>,
        );
      }
    });
    return arr;
  };

  return (
    !item.competition.name ?
      <SingleCompetitionResultCard
        styles={styles}
        item={item}
        createFoxPoint={createFoxPoint} /> :
      <CommandCompetitionResultCard
        styles={styles}
        item={item}
        createFoxPoint={createFoxPoint}
      />
  );
};

export default ResultCard;
