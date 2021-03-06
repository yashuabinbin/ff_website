import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import router from './router'
import {formatDate} from './common/date'
import doRequest from './common/req'
import * as axios from 'axios'
import App from './App'

Vue.use(ElementUI)
Vue.prototype.$ajax = axios
Vue.prototype.HOST = '/api'
Vue.config.productionTip = false

// 注册
Vue.filter('dateTimeFilter', function (time) {
  return formatDate(new Date(time), 'yyyy-MM-dd HH:mm:ss')
})

Vue.filter('dateFilter', function (time) {
  return formatDate(new Date(time), 'yyyy-MM-dd')
})

Vue.prototype.doRequest = function (data) {
  return doRequest(data)
}

Vue.prototype.deepCopy = function (data) {
  return JSON.parse(JSON.stringify(data))
}

let vm = new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  filters: {
    formatDateTime: function (time) {
      return formatDate(new Date(time), 'yyyy-MM-dd HH:mm:ss')
    }
  }
})

Vue.use({
  vm
})
