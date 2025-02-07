import * as types from './mutation_types';
import AuthApi from '../_api/auth.api';
import { removeAccessToken, setAccessToken, setRefreshToken, getRefreshToken, removeRefreshToken } from '../utils';

export default ({ baseUrl, onlogout }) => {
  const Api = AuthApi(baseUrl)
  
  const login = ({ state, dispatch, commit }, { credentials, remember }) => {
    if (state.authenticated) {
      return;
    }

    return new Promise((resolve, reject) => {
      commit(types.LOGIN_IN_PROGRESS, true);
      Api.login(credentials, result => {
        setAccessToken(result.access_token, remember);
        setRefreshToken(result.refresh_token);
        commit(types.LOGIN_IN_PROGRESS, false);
        dispatch('initializeUser').then(resolve);
      }, error => {
        commit(types.LOGIN_IN_PROGRESS, false);
        reject(error)
      });
    });
  }

  const register = ({ dispatch, commit }, user) => {
    return new Promise((resolve, reject) => {
      commit(types.REGISTER_IN_PROGRESS, true);
      Api.register(user, _ => {
        commit(types.REGISTER_IN_PROGRESS, false);
        dispatch('login', {
          credentials: {
            username: user.email,
            password: user.password
          },
          remember: true
        }).then(resolve);
      }, err => {
        commit(types.REGISTER_IN_PROGRESS, false);
        reject(err)
      });
    });
  }

  const refreshLogin = ({ commit }) => {
    return new Promise((resolve, reject) => {
      const token = getRefreshToken();
      Api.refreshToken(token, result => {
        setAccessToken(result.access_token, true);
        setRefreshToken(result.refresh_token);
        resolve(result);
      }, reject)
    })
  }

  const initializeUser = ({ commit }) => {
    return new Promise((resolve, reject) => {
      commit(types.LOADING_USER, true);

      Api.getMe(user => {
        commit(types.SET_USER, { user });
        commit(types.LOADING_USER, false);
        resolve(user);
      }, err => {
        commit(types.LOADING_USER, false);
        console.error(err)
        reject();
      });
    });
  }

  const logout = ({ commit }) => {
    return new Promise(resolve => {
      removeAccessToken();
      removeRefreshToken();
      commit(types.SET_USER, { user: null });
      resolve();

      if(onlogout) {
        onlogout();
      }
    });
  }

  return {
    login,
    register,
    initializeUser,
    logout,
    refreshLogin
  }
};