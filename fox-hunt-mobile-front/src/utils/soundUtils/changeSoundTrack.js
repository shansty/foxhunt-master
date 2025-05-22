import SoundPlayer from 'react-native-sound-player';
import { CHANGE_TRACK_COEFFICIENT } from '../constants/commonConstants';
import {
  FOX_TRACK,
  WARNING_TRACK,
  SOUND_FORMAT_MP3,
  WHITE_NOISE_TRACK,
} from '../constants/sound';

const changeSoundTrack = (state, setCurrentSound) => {
  if (state.positionOutOfLocation) {
    if (state.currentSound === WARNING_TRACK) return;
    SoundPlayer.loadSoundFile(WARNING_TRACK, SOUND_FORMAT_MP3);
    setCurrentSound(WARNING_TRACK);
  }
  if (state.gameState.currentFox &&
      (state.frequencyCloseness <= CHANGE_TRACK_COEFFICIENT) &&
      (state.currentSound !== `${FOX_TRACK}${state.gameState.currentFox.index}`)) {
    SoundPlayer.loadSoundFile(
      `${FOX_TRACK}${state.gameState.currentFox.index}`,
      SOUND_FORMAT_MP3,
    );
    setCurrentSound(`${FOX_TRACK}${state.gameState.currentFox.index}`);
  } else {
    if (state.currentSound === WHITE_NOISE_TRACK) return;
    SoundPlayer.loadSoundFile(WHITE_NOISE_TRACK, SOUND_FORMAT_MP3);
    setCurrentSound(WHITE_NOISE_TRACK);
  }
};

export default changeSoundTrack;
