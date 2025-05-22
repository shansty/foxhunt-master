import SoundPlayer from 'react-native-sound-player';
import { SOUND_INTERVAL, INITIAL_VOLUME, VOLUME_LEVELS } from '../constants/commonConstants';
import { SOUND_FORMAT_MP3, WHITE_NOISE_TRACK } from '../constants/sound';

const playSound = async () => {
  try {
    SoundPlayer.loadSoundFile(WHITE_NOISE_TRACK, SOUND_FORMAT_MP3);
    const info = await SoundPlayer.getInfo();
    SoundPlayer.setVolume(INITIAL_VOLUME / VOLUME_LEVELS);
    const soundInterval = setInterval(() => {
      SoundPlayer.play();
    }, info.duration + SOUND_INTERVAL);
    return soundInterval;
  } catch (err) {
    return new Error(err);
  }
};

export default playSound;
