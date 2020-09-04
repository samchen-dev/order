import Vue from 'vue'
import Element from 'element-ui'
import axios from 'axios'
import moment from 'moment'
import fileSaver from 'file-saver'
import App from './App.vue'
import router from './router'
import './assets/css/normalize.css'
import './registerServiceWorker'
import XEUtils from 'xe-utils'
import XLSX from '@sheet/coredemo'

moment.locale('zh-cn')
// 日期插件
Vue.prototype.$moment = moment
// 文件下载插件
// 工具类
Vue.prototype.$XEUtils = XEUtils
Vue.prototype.$fileSaver = fileSaver
Vue.prototype.$XLSX = XLSX
Vue.config.devtools = true;
axios.defaults.baseURL = 'http://192.168.2.66:3000/api/'
Vue.prototype.$http = axios

Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
