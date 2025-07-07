import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCompetitions } from '../../store/actions/competitionActions';
import {
  selectAllCompetitions,
  selectAllCompetitionsCount,
} from '../../store/selectors/competitionSelectors';
import { competitionsErrorSelector } from 'srcstore/selectors/errorsSelectors';
import { selectLoggedUser } from '../../store/selectors/authSelectors';
import CompetitionsTable from '../../components/CompetitionsTable';

function ListCompetitionsLaunchContainer(props) {
  const initialState = {
    sort: {},
    competitionsToday: [],
    pager: {
      page: 0,
      rowsPerPage: 25,
    },
  };

  const [state, setState] = useState(initialState);

  useEffect(() => {
    props.fetchCompetitions({
      launch: true,
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  }, []);

  const changePager = (pager = { page: 0, rowsPerPage: 25 }) => {
    const newPager = Object.assign(state.pager, pager);
    const newState = { ...state, pager: newPager };

    setState(newState);
    props.fetchCompetitions({
      launch: true,
      page: state.pager.page,
      size: state.pager.rowsPerPage,
    });
  };

  return (
    <>
      {props.error && <p>Sorry! There was an error loading the items</p>}
      {props.competitions && (
        <CompetitionsTable
          competitions={props.competitions}
          pager={state.pager}
          onPageChange={changePager}
          countAllRows={props.allSize}
          loggedUser={props.loggedUser}
        />
      )}
    </>
  );
}

ListCompetitionsLaunchContainer.propTypes = {
  competitions: PropTypes.array.isRequired,
  error: PropTypes.string,
  fetchCompetitions: PropTypes.func.isRequired,
  loggedUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  competitions: selectAllCompetitions(state),
  allSize: selectAllCompetitionsCount(state),
  loggedUser: selectLoggedUser(state),
  error: competitionsErrorSelector(state),
});

export default connect(mapStateToProps, { fetchCompetitions: getCompetitions })(
  ListCompetitionsLaunchContainer,
);
