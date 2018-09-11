import getters from './getters';
import actions from './actions';
import mutations from './mutations';

const state = {
  user: null,
  authenticated: false,
  loadingUser: false
}

export default function (options) {
  return {
    namespaced: true,
    state: { ...state },
    getters,
    actions: actions(options),
    mutations
  }
}