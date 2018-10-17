import Vue from 'vue'
import App from './App.vue'
import { AuthPlugin, WebSocketPlugin } from './plugins'
import store from './store'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

const BASE_URL = 'http://localhost:8180';

Vue.use(WebSocketPlugin, {
  baseUrl: BASE_URL
})
Vue.use(VueResource)
Vue.use(AuthPlugin, {
  store,
  baseUrl: BASE_URL,
  oncomplete: _ => {
    new Vue({
      store,
      render: h => h(App)
    }).$mount('#app')
  },
  onlogout: _ => {
    console.log('User logged out.')
  }
})
