import React, { createContext, useReducer } from 'react';

export default (reducer, actions, defaultValue) => {
  const Context = createContext();

  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions = {};

    for (const key in actions) {
      if (Object.prototype.hasOwnProperty.call(actions, key)) {
        boundActions[key] = actions[key](dispatch);
      }
    }

    return (
      <Context.Provider value={{ state, ...boundActions, dispatch }}>
        {children}
      </Context.Provider>
    );
  };

  return { Context, Provider };
};
