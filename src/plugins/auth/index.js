import authStore from './_store';

const MODULE_NAMESPACE = '$_auth'
import { LoginForm, RegisterForm } from './_components'

import AuthInterceptor from './_api/auth.interceptor';
import { getAccessToken } from './utils';

const AuthPlugin = {
  install(Vue, { store, baseUrl, oncomplete }) {
    if (!store) {
      throw new Error('Please provide vuex store.');
    }

    store.registerModule(MODULE_NAMESPACE, authStore({ baseUrl: baseUrl || '' }));
    
    if (!Vue.http) {
      throw new Error('Vue resource plugin is strongly required!')
    }

    Vue.http.interceptors.push(AuthInterceptor(store));
    if (getAccessToken() != null) {
      store.dispatch(`${MODULE_NAMESPACE}/initializeUser`).then(res => { 
        if (oncomplete) {
          oncomplete()
        }
      })
    }

    Vue.component('login-form', LoginForm)
    Vue.component('register-form', RegisterForm)
  }
};

export default AuthPlugin;
