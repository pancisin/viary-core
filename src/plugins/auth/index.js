import authStore from './_store';

const MODULE_NAMESPACE = '$_auth'
import { LoginForm, RegisterForm, AuthWrapper } from './_components'

import AuthInterceptor from './_api/auth.interceptor';
import { getAccessToken } from './utils';

const AuthPlugin = {
  install(Vue, { store, baseUrl, oncomplete, onlogout }) {
    if (!store) {
      throw new Error('Please provide vuex store.');
    }

    store.registerModule(MODULE_NAMESPACE, authStore({ baseUrl: baseUrl || '', onlogout }));
    
    if (!Vue.http) {
      throw new Error('Vue resource plugin is strongly required!')
    }

    Vue.http.interceptors.push(AuthInterceptor(store));

    Promise.resolve(getAccessToken())
      .then(token => {
        if (token != null) {
          return store.dispatch(`${MODULE_NAMESPACE}/initializeUser`)
        }
      })
      .then(_ => {
        if (oncomplete) {
          oncomplete()
        }
      })

    Vue.component('login-form', LoginForm)
    Vue.component('register-form', RegisterForm)
    Vue.component('auth-wrapper', AuthWrapper)
  }
};

export default AuthPlugin;
