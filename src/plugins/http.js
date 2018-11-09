//模块
// 把axios第三方的库改成插件
// import axios from 'axios'
// const HttpTool = {}
// HttpTool.install = (Vue)=>{

//     axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
//     Vue.prototype.$http = axios
// }

// export default HttpTool

import axios from 'axios'

import {Message} from 'element-ui'
const HttpTool = {}
HttpTool.install = (Vue)=>{
// axios
axios.defaults.baseURL= 'http://localhost:8888/api/private/v1/'


// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // console.log(config)


 //需要设置请求头=token
 const AUTH_TOKEN = sessionStorage.getItem("token")
 config.headers.common["Authorization"] = AUTH_TOKEN


    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    const {meta:{status,msg}} = response.data
    if(status !==200 && status !==201){
      Message.warning(msg)
    }
  // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
Vue.prototype.$http = axios



}

export default HttpTool