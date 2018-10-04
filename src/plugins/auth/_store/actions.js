import * as types from './mutation_types';
import AuthApi from '../_api/auth.api';

export default ({ baseUrl }) => {
  const Api = AuthApi(baseUrl)
  
  const login = ({ state, dispatch }, { credentials, remember }) => {
    if (state.authenticated) {
      return;
    }

    return new Promise(resolve => {
      const storage = remember ? window.localStorage : window.sessionStorage;
      Api.login(credentials, result => {
        storage.setItem('access_token', result.access_token);
        dispatch('initializeUser').then(resolve);
      });
    });
  }

  const register = ({ dispatch }, user) => {
    return new Promise(resolve => {
      Api.register(user, () => {

        dispatch('login', {
          credentials: {
            username: user.email,
            password: user.password
          },
          remember: true
        }).then(resolve);
      });
    });
  }

  const initializeUser = ({ commit }) => {
    return new Promise(resolve => {
      commit(types.LOADING_USER, true);

      Api.getMe(user => {
        commit(types.SET_USER, { user });
        commit(types.LOADING_USER, false);

        resolve(user);
      });
    });
  }

  const logout = ({ commit }) => {
    return new Promise(resolve => {
      window.localStorage.removeItem('access_token');
      window.sessionStorage.removeItem('access_token');

      commit(types.SET_USER, { user: null });

      // dispatch('flushDiaries');d
      resolve();
      // dispatch('resetModelModule');
      // dispatch('resetApiModule');
    });
  }

  return {
    login,
    register,
    initializeUser,
    logout
  }
};