export const replaySelector = (state) => state.replayReducer;

export const selectTrackers = (state) => state.replayReducer.trackers;

export const selectReplayLoadingState = (state) =>
  state.replayReducer.isLoading;

export const selectAllTrackersSize = (state) => state.replayReducer.size;
