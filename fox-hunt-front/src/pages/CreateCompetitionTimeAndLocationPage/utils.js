import dayjs from 'dayjs';

export const getParticipantOptions = (participants) =>
  Array.isArray(participants)
    ? participants.map(({ id, firstName, lastName }) => ({
        value: id,
        label: `${firstName} ${lastName}`,
      }))
    : [];

export const locationListOnTemplateFunction = (locations) =>
  locations.map((val) => ({ value: val.id, label: val.name }));

export const getCoachOptions = (coachArr, loggedUserId) => {
  const processedArr = getParticipantOptions(coachArr)
    .filter((participant) => participant.value !== loggedUserId)
    .map((value) => value);

  const currentUserCoach = getParticipantOptions(coachArr)
    .filter((participant) => participant.value === loggedUserId)
    .map((value) => ({ ...value, label: `Me (${value.label.trim()})` }));

  currentUserCoach.push(...processedArr);
  return currentUserCoach;
};

export const getMinCompetitionStartDate = () =>
  dayjs().add(15, 'minute').toDate();
