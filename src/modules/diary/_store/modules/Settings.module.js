import RootApi from '../../_api/root.api';

const types = {
  SET_INIT: 'SET_INIT',
  SET_INIT_IN_PROGRESS: 'SET_INIT_IN_PROGRESS'
}

const state = {
  initialData: {},
  loadingInitialData: false
}

const getters = {
  loadingInitialData: state => state.loadingInitialData,
  theme: state => {
    const themes = state.initialData.themes;
    if (themes != null && themes.length > 0) {
      return themes[1]
    }

    return {}
  }
}

const actions = ({ baseUrl }) => {
  const initializeApplication = ({ commit }) => {
    return new Promise(resolve => {
      commit(types.SET_INIT_IN_PROGRESS, true);

      const api = RootApi(baseUrl)

      api.getInitial(initialData => {
        commit(types.SET_INIT, { initialData });
        commit(types.SET_INIT_IN_PROGRESS, false);
        resolve(initialData);
      });
    });
  }

  return {
    initializeApplication
  }
};

const mutations = {
  [types.SET_INIT] (state, { initialData }) {
    state.initialData = initialData;
  },

  [types.SET_INIT_IN_PROGRESS] (state, inProgress) {
    state.loadingInitialData = inProgress;
  }
};

export default options => {
  return {
    namespaced: true,
    state,
    getters,
    actions: actions(options),
    mutations
  }
};
