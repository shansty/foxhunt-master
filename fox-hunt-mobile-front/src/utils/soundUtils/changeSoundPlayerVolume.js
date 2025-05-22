import SoundPlayer from 'react-native-sound-player';
import {
  ANGLE_DIVIDER,
  MIN_VOLUME,
  VOLUME_LEVELS,
  TWO_FRACTION_DIGITS,
  SOUND_COEFFICIENT,
} from '../constants/commonConstants';
import { WHITE_NOISE_TRACK, WARNING_TRACK } from '../constants/sound';

const volumes = {
  0: 1,
  1: 0.9,
  2: 0.8,
  3: 0.7,
  4: 0.6,
  5: 0.5,
  6: 0.4,
  7: 0.3,
  8: 0.2,
  9: 0.1,
  10: 0,
};

const changeSoundPlayerVolume = (volume, angleToPoint, setCalculatedSoundLevel, currentSound) => {
  if (currentSound === WHITE_NOISE_TRACK || currentSound === WARNING_TRACK) {
    setCalculatedSoundLevel(volume);
    SoundPlayer.setVolume(volume / VOLUME_LEVELS);
    return;
  }
  const angleVolumeKey = Math.floor(angleToPoint / ANGLE_DIVIDER);
  if (volume === MIN_VOLUME) {
    setCalculatedSoundLevel(MIN_VOLUME);
    SoundPlayer.setVolume(MIN_VOLUME);
    return;
  }
  if (angleVolumeKey || angleVolumeKey === 0) {
    const calculatedVolume = +(
      (volumes[angleVolumeKey] * VOLUME_LEVELS + volume) / SOUND_COEFFICIENT
    ).toFixed(TWO_FRACTION_DIGITS);
    setCalculatedSoundLevel(calculatedVolume * VOLUME_LEVELS);
    SoundPlayer.setVolume(calculatedVolume);
  } else {
    setCalculatedSoundLevel(volume);
    SoundPlayer.setVolume(volume / VOLUME_LEVELS);
  }
};

export default changeSoundPlayerVolume;
