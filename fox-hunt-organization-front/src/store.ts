import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './store/reducers/combination';
import { apiError } from './store/middlewares/apiError';
import throttle from 'lodash/throttle';
import { AuthState } from './types/States';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const middlewares = [thunk, apiError];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const loadState = (): { authReducer: AuthState } | undefined => {
  try {
    const serializedState = localStorage.getItem('isSignedIn');
    if (serializedState === null) {
      return undefined;
    }
    const loadedState = JSON.parse(serializedState);
    return {
      authReducer: {
        isSignedIn: loadedState,
        error: null,
        isLoading: false,
      },
    };
  } catch (e) {
    return undefined;
  }
};

const saveState = (isSignedIn: boolean) => {
  const serializedState = JSON.stringify(isSignedIn);
  localStorage.setItem('isSignedIn', serializedState);
};
const persistedState: { authReducer: AuthState } | undefined = loadState();

const store = createStore(
  rootReducer,
  persistedState,
  composeEnhancers(applyMiddleware(...middlewares)),
);

store.subscribe(
  throttle(() => {
    saveState(store.getState().authReducer.isSignedIn);
  }, 1000),
);

export default store;
