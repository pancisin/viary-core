import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

export default (options) => {
  return  {
    namespaced: true,
    state : { ...state },
    getters,
    actions: actions(options),
    mutations
  }
}