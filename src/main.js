// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import HttpTool from '@/plugins/http.js'
import moment from 'moment'
import '@/assets/css/index.css'


// 面包屑
import myBread from '@/components/my-bread.vue'

Vue.use(ElementUI)
Vue.use(HttpTool)
Vue.config.productionTip = false

//全局面包屑
Vue.component('my-bread',myBread)



//全局过滤器
// 格式化日期
Vue.filter('fmtDate',(value) => {
  return moment(value).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
