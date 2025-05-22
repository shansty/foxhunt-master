export const getTrackerSize = (participantId, trackersArr = []) => {
  const participantTracker = trackersArr.find(
    (el) => el.participantId === participantId,
  );

  return participantTracker.trackerList.length;
};

export const getLastTrackerPosition = (participantId, trackersArr = []) => {
  const participantTracker = trackersArr.find(
    (el) => el.participantId === participantId,
  );
  const trackers = participantTracker.trackerList;
  console.log(trackers[0].rank, 'trackers[0].rank');
  return trackers[0].rank;
};

export const removeTrackerElement = (
  participantId,
  trackersArr,
  tracerSize,
) => {
  if (getTrackerSize(participantId, trackersArr) <= tracerSize) {
    return;
  }

  trackersArr.forEach((participantTracker) => {
    const trackers = participantTracker.trackerList;
    trackers.pop();
  });
  return trackersArr;
};

export const sliceParticipantTrackers = (
  currentSliderPosition = 0,
  trackersArr = [],
  tracerSize = 0,
) => {
  const newArr = trackersArr.map((participantTracker) => {
    const trackers = participantTracker.trackerList;
    const arraySize = trackers.length;

    if (arraySize === 0) {
      return [];
    }

    const endPosition =
      currentSliderPosition < tracerSize ? currentSliderPosition : tracerSize;
    const displayedTrackers = trackers.slice(
      arraySize - endPosition,
      arraySize,
    );

    return { ...participantTracker, trackerList: displayedTrackers };
  });

  return newArr;
};

export const unshiftTrackers = (originalArr = [], newArr = []) => {
  newArr.forEach((participantTracker) => {
    const newTrackers = participantTracker.trackerList;
    const tracker = originalArr.find(
      (el) => el.participantId === participantTracker.participantId,
    );
    const oldTrackers = tracker.trackerList;
    newTrackers.reverse().forEach((el) => oldTrackers.unshift(el));
  });
};
