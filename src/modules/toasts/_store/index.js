import * as types from './mutation_types';

const state = {
  toasts: []
};

const getters = {
  toasts: state => state.toasts
};

const actions = {
  addToast ({ commit }, toast) {
    commit(types.ADD_TOAST, { toast });

    if (toast.type !== 'prompt') {
      setTimeout(() => {
        commit(types.REMOVE_TOAST, { toast });
      }, 5000);
    }
  },

  removeToast ({ commit }, toast) {
    commit(types.REMOVE_TOAST, { toast });
  }
};

const mutations = {
  [types.ADD_TOAST] (state, { toast }) {
    state.toasts.push(toast);
  },

  [types.REMOVE_TOAST] (state, { toast }) {
    state.toasts.splice(state.toasts.indexOf(toast), 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
