import React from 'react';
import { getSettingsList } from '../../../utils/commonUtils';
import ListContentWithButton from '../../list/ListContentWithButton';

const SettingsList = ({ initCompetition }) => {
  return (
    getSettingsList(initCompetition).map((option) => (
      <ListContentWithButton
        key={option.key}
        title={option.title}
        value={option.valueLabel}
      />
    ))
  );
};

export default SettingsList;
