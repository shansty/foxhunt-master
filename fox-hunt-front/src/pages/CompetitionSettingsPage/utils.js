import {
  DEFAULT_MAX_NUMBER_OF_FOXES,
  FOX_FREQUENCY_144_MGZ,
  FOX_FREQUENCY_3_5_MGZ,
} from '../../constants/commonConst';

export const getNumberOfFoxOptions = (maxNumberOfFox) =>
  Array.from(
    { length: maxNumberOfFox || DEFAULT_MAX_NUMBER_OF_FOXES },
    (v, k) => ++k,
  ).map((value) => ({
    value: value,
    label: value,
  }));

export const getAllowedCompetitionFrequencies = () =>
  Array.of(FOX_FREQUENCY_144_MGZ, FOX_FREQUENCY_3_5_MGZ).map((value) => ({
    value: value,
    label: `${value} MGz`,
  }));
