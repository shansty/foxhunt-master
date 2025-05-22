import React, { useLayoutEffect, useState, ReactNode } from 'react';
import { Router } from 'react-router-dom';
import { createMemoryHistory, MemoryHistory } from 'history';

export const TestPage = () => <div>You are on the test page</div>;

interface CustomRouterProps {
  history?: MemoryHistory;
  children: ReactNode;
}

const CustomRouter = (props: CustomRouterProps) => {
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

export default CustomRouter;
