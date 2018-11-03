import Vue from 'vue'
import Router from 'vue-router'

//导入登录模块
import Login from '@/views/login'
import Home from '@/views/home'
//导入用户模块
import Users from '@/views/users'
Vue.use(Router)

export default new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children:[{
      path:'/users',
      component: Users
    }]
  },{
    name:'login',
    path:'/login',
    component: Login
  }]
})
