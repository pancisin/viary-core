import RootApi from '../../_api/root.api';

const types = {
  SET_INIT: 'SET_INIT',
  SET_INIT_IN_PROGRESS: 'SET_INIT_IN_PROGRESS',
  SET_THEME: 'SET_THEME',
  SET_CREATOR_MODE: 'SET_CREATOR_MODE',
  SET_OFFLINE_MODE: 'SET_OFFLINE_MODE'
}

const state = {
  initialData: {},
  creatorMode: false,
  theme: {},
  loadingInitialData: false,
  offlineMode: false
}

const getters = {
  loadingInitialData: state => state.loadingInitialData,
  themes: state => state.initialData.themes || [],
  // theme: state => {
  //   const themes = state.initialData.themes;
  //   if (themes != null && themes.length > 0) {
  //     return themes[1]
  //   }

  //   return {}
  // },
  theme: state => state.theme,
  creatorMode: state => state.creatorMode,
  offlineMode: state => state.offlineMode
}

const actions = ({ baseUrl }) => {
  const initializeApplication = ({ commit }) => {
    return new Promise(resolve => {
      commit(types.SET_INIT_IN_PROGRESS, true);

      const api = RootApi(baseUrl)

      api.getInitial(initialData => {
        commit(types.SET_INIT, { initialData });
        commit(types.SET_THEME, { theme: initialData.themes[1] })
        commit(types.SET_INIT_IN_PROGRESS, false);
        resolve(initialData);
      });
    });
  }

  const selectTheme = ({ commit, getters }, themeId) => {
    const themeIdx = getters.themes.findIndex(t => t.id === themeId)
    console.log(getters.themes[themeIdx])
    commit(types.SET_THEME, { theme: getters.themes[themeIdx] })
  }

  const switchCreatorMode = ({ commit, getters }, state) => {
    commit(types.SET_CREATOR_MODE, { state: state || !getters.creatorMode })
  }

  const switchOfflineMode = ({ commit, getters }, offlineMode) => {
    commit(types.SET_OFFLINE_MODE, { offlineMode: offlineMode || !getters.offlineMode })
  }

  return {
    initializeApplication,
    selectTheme,
    switchCreatorMode,
    switchOfflineMode
  }
};

const mutations = {
  [types.SET_INIT] (state, { initialData }) {
    state.initialData = initialData;
  },

  [types.SET_INIT_IN_PROGRESS] (state, inProgress) {
    state.loadingInitialData = inProgress;
  },

  [types.SET_THEME] (state, { theme }) {
    state.theme = theme;
  },
  
  [types.SET_CREATOR_MODE] (st, { state }) {
    st.creatorMode = state;
  },

  [types.SET_OFFLINE_MODE] (state, { offlineMode }) {
    state.offlineMode = offlineMode;
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
