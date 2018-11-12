import RootApi from '../../_api/root.api';
import Prefs from '../../prefKeys';

const types = {
  SET_INIT: 'SET_INIT',
  SET_INIT_IN_PROGRESS: 'SET_INIT_IN_PROGRESS',
  SET_THEME: 'SET_THEME',
  SET_MODE: 'SET_MODE',
  SET_OFFLINE_MODE: 'SET_OFFLINE_MODE',
  SET_OFFLINE_RECOVERY_MODE: 'SET_OFFLINE_RECOVERY_MODE'
}

const appMode = {
  DIARY: 'DIARY',
  CREATOR: 'CREATOR',
  CONTACTS: 'CONTACTS'
}

const state = {
  initialData: {},
  mode: appMode.DIARY,
  theme: {},
  loadingInitialData: false,
  offlineMode: false,
  offlineRecoveryMode: false
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
  preferences: state => state.initialData.preferences || [],
  diaryMode: state => state.mode === appMode.DIARY,
  creatorMode: state => state.mode === appMode.CREATOR,
  contactsMode: state => state.mode === appMode.CONTACTS,
  offlineMode: state => state.offlineMode,
  offlineRecoveryMode: state => state.offlineRecoveryMode,
  getPreference: (state, getters) => key => {
    if (!Prefs.hasOwnProperty(key)) {
      throw new Error('Preference does not exists!')
    }

    return getters.preferences[key]
  }
}

const actions = ({ baseUrl }) => {
  const api = RootApi(baseUrl)

  const initializeApplication = ({ commit, getters }) => {
    return new Promise(resolve => {
      commit(types.SET_INIT_IN_PROGRESS, true);


      api.getInitial(initialData => {
        commit(types.SET_INIT, { initialData });
        const themeIdx = getters.themes.findIndex(t => t.id == getters.preferences.THEME)
        const theme = themeIdx !== -1 ? getters.themes[themeIdx] : getters.themes[0]

        commit(types.SET_THEME, { theme })
        commit(types.SET_INIT_IN_PROGRESS, false);
        resolve(initialData);
      });
    });
  }

  const selectTheme = ({ commit, getters, dispatch }, themeId) => {
    const themeIdx = getters.themes.findIndex(t => t.id === themeId)
    const theme = getters.themes[themeIdx]

    dispatch('updateUserPreference', { key: Prefs.THEME, value: theme.id })
    commit(types.SET_THEME, { theme })
  }

  const setCreatorMode = ({ commit }) => {
    commit(types.SET_MODE, { mode: appMode.CREATOR })
  }

  const setDiaryMode = ({ commit }) => {
    commit(types.SET_MODE, { mode: appMode.DIARY })
  }

  const setContactsMode = ({ commit }) => {
    commit(types.SET_MODE, { mode: appMode.CONTACTS })
  }

  const switchOfflineMode = ({ commit, getters }, offlineMode) => {
    commit(types.SET_OFFLINE_MODE, { offlineMode: offlineMode || !getters.offlineMode })
  }

  const switchOfflineRecoveryMode = ({ commit, getters }, offlineRecoveryMode) => {
    commit(types.SET_OFFLINE_RECOVERY_MODE, { offlineRecoveryMode: offlineRecoveryMode || !getters.offlineRecoveryMode })
  }

  const updateUserPreference = ({ commit, getters }, { key, value }) => {
    return new Promise((resolve, reject) => {
      if (!Prefs.hasOwnProperty(key)) {
        reject('Preference does not exists!')
        return;
      }
  
      return api.updateUserPreference(key, value).then(result => {
        resolve(result);
      })
    })
  }

  return {
    initializeApplication,
    selectTheme,
    setDiaryMode,
    setContactsMode,
    setCreatorMode,
    switchOfflineMode,
    updateUserPreference
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
  
  [types.SET_MODE] (st, { mode }) {
    st.mode = mode;
  },

  [types.SET_OFFLINE_MODE] (state, { offlineMode }) {
    state.offlineMode = offlineMode;
  },

  [types.SET_OFFLINE_RECOVERY_MODE] (state, { offlineRecoveryMode }) {
    state.offlineRecoveryMode = offlineRecoveryMode;
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
