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
// 导入商品管理
import Cateparams from '@/views/cateparams'
import Goodscate from '@/views/goodscate'
import GoodsList from '@/views/goodsList'
import GoodsAdd from '@/views/goodsadd'
import Order from '@/views/order'
import Reports from '@/views/reports'


Vue.use(Router)


const router = new Router({
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
    },{
      path:'/goods',
      component: GoodsList
    },{
      path:'/categories',
      component: Goodscate
    },{
      path:'/params',
      component: Cateparams
    },{
      name:'goodsadd',
      path:'/GoodsAdd',
      component: GoodsAdd
    },{
      path:'/orders',
      component: Order
    },{
      path:'/reports',
      component: Reports
    }]
  },{
    name:'login',
    path:'/login',
    component: Login
  }]
})

// 导航守卫
router.beforeEach((to,from,next)=>{
  console.log(to)
  if(to.path==='/login') {
    next()
  }else{
    const token = sessionStorage.getItem("token");
    if(!token){
      router.push('/login')
      return
    }
    next()
  }

        // if (!token) {
  
      //   this.$message.warning("请先登录");
  
      //   this.$router.push("/login");
  
      // }
  // next()
})
export default router




