import {createMemoryHistory, createBrowserHistory} from 'history';
import {createReduxHistoryContext} from 'redux-first-history';
import {Platform} from 'react-native';
import {batch} from './batch';

import type {History} from 'history';
import type {Store} from 'redux';

export let state: History & {listenObject: boolean};

export const context = createReduxHistoryContext({
  batch,
  reduxTravelling: true,
  history: Platform.OS === 'web'
    ? createBrowserHistory()
    : createMemoryHistory(),
});

export const init = (store: Store) => {
  state = context.createReduxHistory(store);
}
