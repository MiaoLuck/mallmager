<template>
<div class="login-wrap">
 <el-form class="login-form" 
 label-position="top" 
 label-width="80px" >
    <h2>用户登录</h2>

  <el-form-item label="用户">
    <el-input v-model="formData.username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formData.password"></el-input>
  </el-form-item>
   <el-button class="login-button" type="primary" @click="handleLogin()">登录</el-button>
</el-form>
</div>
   

</template>

<script>
export default {
    data(){
        return {
            formData:{
                username:'',
                password:''
            }
        }
    },
     methods:{
       async handleLogin() {
           const res = await this.$http.post('login',this.formData)
        //    .then((res)=>{
               const {meta} = res.data
               if(meta.status === 200){

                   //保存token值
                   const token = res.data.data.token
                    sessionStorage.setItem('token',token)

                   this.$message.success(meta.msg);
                   this.$router.push({name:'home'})
               }else{
                    this.$message.error(meta.msg)
                   
               }
                // console.log(res)
        //    })
        }
    },
    
   
}
</script>

<style>
.login-wrap{
    background-color: #324152;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
}
.login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
}
.login-wrap .login-form .login-button {
    width: 100%;
}
</style>
