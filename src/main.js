import Vue from 'vue'
import Element from 'element-ui'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './assets/css/normalize.css'
import './registerServiceWorker'

Vue.config.devtools = true;
axios.defaults.baseURL = 'http://localhost:3000/api/'
Vue.prototype.$http = axios

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
