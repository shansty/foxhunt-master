import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { get } from 'lodash';
import { selectCompetition } from '../store/selectors/competitionSelectors';
import { getCompetitionById } from '../store/actions/competitionActions';
import { competitionErrorSelector } from 'src/store/selectors/errorsSelectors';
import { buildNotFoundUrl } from 'src/api/utils/navigationUtil';

/*
 * This should only be used in the context of redux store to compare props to optimize performance
 * This function relies on "updatedDate" field, that server should update on every PUT, PATCH request
 * If it's a new competition, then updatedDate is null => both are equal
 * If we update competition, server updates "updatedDate" => they are not equal
 * */
const compareCompetitions = (competition, prevCompetition) =>
  get(competition, ['updatedDate']) === get(prevCompetition, ['updatedDate']);

export const useCompetition = (id) => {
  const competitionError = useSelector(competitionErrorSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const competition = useSelector(
    (state) => selectCompetition(state, { id }),
    compareCompetitions,
  );
  useEffect(() => {
    dispatch(getCompetitionById(id));
    if (competitionError) navigate(buildNotFoundUrl());
  }, [id, dispatch, competitionError]);
  return competition;
};
