import { find } from 'lodash';

export const getColorConfig = (participants = []) =>
  participants.map((participant) => ({
    id: participant.id,
    color: participant.color,
  }));

export const getColorFromConfig = (config = {}, id, defaultColor = 'black') => {
  if (!config.color) {
    return defaultColor;
  }
  const configColor = find(config.color, ['id', id]);

  if (!configColor || !configColor.color) {
    return defaultColor;
  }

  return configColor.color;
};
