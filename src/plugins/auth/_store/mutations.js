import * as types from './mutation_types';

export default {
  [types.SET_USER] (state, { user }) {
    state.user = { ...user };
    state.authenticated = user != null;
  },

  [types.LOADING_USER] (state, loading_state) {
    state.loadingUser = loading_state;
  }
};