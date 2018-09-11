import Vue from 'vue'
import App from './App.vue'
import { AuthPlugin } from './plugins'
import store from './store'
import VueResource from 'vue-resource'

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(AuthPlugin, {
  store,
  baseUrl: 'http://diary.convene.sk'
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
