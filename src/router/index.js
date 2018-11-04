import Vue from 'vue'
import Router from 'vue-router'

//导入登录模块
import Login from '@/views/login'
import Home from '@/views/home'
//导入用户模块
import Users from '@/views/users'
// 导入权限管理/权限列表模块
import Rights from '@/views/rights'
// 导入权限管理角色列表模块
import Roles from '@/views/roles'
Vue.use(Router)

export default new Router({
  routes: [{
    name: 'home',
    path: '/',
    component: Home,
    children:[{
      path:'/users',
      component: Users
    },{
      path:'/rights',
      component: Rights
    },{
      path:'/roles',
      component: Roles
    }]
  },{
    name:'login',
    path:'/login',
    component: Login
  }]
})
