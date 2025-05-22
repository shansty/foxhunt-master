import React, { useLayoutEffect, useState } from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

export const TestPage = () => <div>You are on the test page</div>;

export const CustomRouter = ({ ...props }: any) => {
  const history = props.history || createMemoryHistory();
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      {...props}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

export const getPaginatedRows = (
  rows: any[],
  pageSize: number,
  pageNumber: number,
) => {
  return pageSize > 0
    ? rows.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize)
    : rows;
};
