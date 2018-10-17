import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

// import SettingsModule from './modules/Settings.module'

export default (options) => {
  return  {
    namespaced: true,
    state : { ...state },
    // modules: {
    //   $_settings: SettingsModule(options)
    // },
    getters,
    actions: actions(options),
    mutations
  }
}