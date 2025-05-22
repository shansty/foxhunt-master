import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  loadInitialTrackers,
  loadTrackers,
} from 'src/store/actions/replayActions';
import {
  getLastTrackerPosition,
  getTrackerSize,
  removeTrackerElement,
  sliceParticipantTrackers,
  unshiftTrackers,
} from '../utils';
import { selectTrackers } from 'src/store/selectors/replaySelectors';

export default function useReplayTab(id, size, isLoading) {
  // size fo displayed trackers
  const tracerSize = 8;
  // size of trackers that loaded at one time
  const bathSize = 100;
  // time of refreshing map with markers
  const refreshTime = 1000;
  const initialSliderPosition = 1;

  const loadedTrackers = useSelector(selectTrackers);
  const dispatch = useDispatch();

  const [trackersArr, setTrackersArr] = useState([]);
  const [activeFoxIndex, setActiveFoxIndex] = useState(0);
  const [displayedTrackers, setDisplayedTrackers] = useState([]);
  const [additionalDataLoadState, setAdditionalDataLoadState] = useState(false);
  const [playTimer, setPlayTimer] = useState(null);
  const [playStarted, setPlayStarted] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(initialSliderPosition);
  const [participantId, setParticipantId] = useState('');

  const startReplay = () => setPlayStarted(true);
  const stopReplay = () => clearIntervalAndUpdateState(playTimer);

  const clearIntervalAndUpdateState = useCallback(
    (interval = playTimer) => {
      setPlayStarted(false);
      clearInterval(interval);
      setPlayTimer(null);
    },
    [playTimer],
  );

  const changeParticipant = (event, option) => {
    const newParticipantId = Number.parseInt(option.value);
    setParticipantId(newParticipantId);
    setSliderPosition(1);
    setTrackersArr([]);
    dispatch(
      loadInitialTrackers({
        id,
        participantId: newParticipantId,
        trackerQuantity: bathSize,
        tracerSize,
      }),
    );
  };

  const addNewTrackers = useCallback(() => {
    if (trackersArr.length === 0) {
      return setTrackersArr(loadedTrackers);
    }
    unshiftTrackers(trackersArr, loadedTrackers);
    setTrackersArr(trackersArr);
  }, [loadedTrackers, trackersArr]);

  const updateDisplayedTrackers = useCallback(
    (currentSliderPosition = sliderPosition) => {
      if (!trackersArr || trackersArr.length === 0) {
        setDisplayedTrackers(loadedTrackers);
        return;
      }

      const newArr = sliceParticipantTrackers(
        currentSliderPosition,
        trackersArr,
        tracerSize,
      );
      const participantTracker = newArr.find(
        (el) => el.participantId === participantId,
      );
      const activeFoxIndex =
        participantTracker?.trackerList[0].activeFoxInfo.foxPointIndex;
      setActiveFoxIndex(activeFoxIndex);
      setDisplayedTrackers(newArr);
    },
    [participantId, sliderPosition, trackersArr, loadedTrackers],
  );

  const changeStartValue = (startValue) => {
    if (playStarted || isLoading) {
      return;
    }
    const newPosition = Number.parseInt(startValue);
    setSliderPosition(newPosition);
    setPlayStarted(false);

    const startPosition = size - newPosition + tracerSize;

    setTrackersArr([]);
    dispatch(
      loadTrackers({
        id,
        participantId,
        startPosition,
        trackerQuantity: bathSize + tracerSize,
      }),
    );
  };

  const updateTrackerArr = useCallback(() => {
    setTrackersArr(
      removeTrackerElement(participantId, trackersArr, tracerSize),
    );
  }, [participantId, trackersArr]);

  useEffect(() => {
    if (!playStarted && !additionalDataLoadState) {
      return setTrackersArr(loadedTrackers);
    }
    addNewTrackers();
  }, [
    dispatch,
    loadedTrackers,
    addNewTrackers,
    additionalDataLoadState,
    playStarted,
  ]);

  useEffect(() => {
    updateDisplayedTrackers();
  }, [setTrackersArr, trackersArr, updateDisplayedTrackers]);

  useEffect(() => {
    if (playTimer || !playStarted) {
      return;
    }

    if (getTrackerSize(participantId, trackersArr) < 0) {
      return;
    }

    let tempCurPosition = sliderPosition;
    let additionalDataLoad = false;
    let prevTrackerSize = 0;
    const playerInterval = setInterval(() => {
      setPlayTimer(playerInterval);
      tempCurPosition++;

      if (tempCurPosition > size) {
        clearIntervalAndUpdateState(playerInterval);
        return;
      }
      const trackerSize = getTrackerSize(participantId, trackersArr);

      if (trackerSize > prevTrackerSize) {
        additionalDataLoad = false;
      }
      prevTrackerSize = trackerSize;

      if (trackerSize <= tracerSize && additionalDataLoad) {
        return;
      }

      if (
        trackerSize <= bathSize / 2 &&
        !additionalDataLoad &&
        tempCurPosition + trackerSize < size
      ) {
        const pos = getLastTrackerPosition(participantId, trackersArr) - 1;
        dispatch(
          loadTrackers({
            id,
            participantId,
            startPosition: pos,
            trackerQuantity: bathSize,
          }),
        );
        setAdditionalDataLoadState(additionalDataLoad);
        additionalDataLoad = true;
      }

      updateTrackerArr();
      updateDisplayedTrackers(tempCurPosition);
      setSliderPosition((sliderPosition) => sliderPosition + 1);
    }, refreshTime);
  }, [
    setPlayStarted,
    playStarted,
    clearIntervalAndUpdateState,
    dispatch,
    id,
    participantId,
    playTimer,
    refreshTime,
    size,
    sliderPosition,
    trackersArr,
    updateDisplayedTrackers,
    updateTrackerArr,
    setPlayTimer,
    setSliderPosition,
  ]);

  return {
    changeStartValue,
    changeParticipant,
    startReplay,
    stopReplay,
    activeFoxIndex,
    displayedTrackers,
    playStarted,
    sliderPosition,
    participantId,
  };
}
