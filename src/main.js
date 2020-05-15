import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import Element from 'element-ui'
import './assets/css/normalize.css'

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
