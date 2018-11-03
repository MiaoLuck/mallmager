<template>
<!-- 卡片容器 -->
<el-card class="box-card">
<!-- 面包屑 -->
    <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 搜索框 -->
<div style="margin-top: 15px;">
    <el-row>
        <el-col :span="10">
  <el-input placeholder="请输入内容" clearable v-model="searchValue" class="searchInput">
    <el-button slot="append" @click="handleSearch" icon="el-icon-search"></el-button>
  </el-input>
        </el-col>
        <el-col :span="14">
  <el-button type="success" @click="showAdduser()">添加用户</el-button>
  </el-col>
  </el-row>
</div>
<!-- 添加用户的对话框 -->
<el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdduser">
  <el-form :model="formData">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input v-model="formData.username" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="密码" :label-width="formLabelWidth">
      <el-input v-model="formData.password" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="formData.email" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="formData.mobile" autocomplete="off"></el-input>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser">确 定</el-button>
  </div>
</el-dialog>


<!-- 表格 -->
<el-table
      v-loading="loading"
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
      prop="email"
        label="邮箱">
      </el-table-column>
      <el-table-column
      prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.create_time | fmtDate}}
        </template>
      </el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
          @change="changeMgState(scope.row)"
          v-model="scope.row.mg_state"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-row>
            <el-button type="primary" @click ="showEditHandle(scope.row)" icon="el-icon-edit" size="mini" plain circle></el-button>
            <el-button type="success" @click ="showRole(scope.row)" icon="el-icon-check" size="mini" plain circle></el-button>
            <el-button type="danger" @click ="deleteHandle(scope.row)" icon="el-icon-delete" size="mini" plain circle></el-button>
      </el-row>
        </template>
       
      </el-table-column>
    </el-table>

    <!-- 角色分配 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
  <el-form >
    <el-form-item label="用户名" :label-width="formLabelWidth">
        {{currUserName}}
    </el-form-item>
    <el-form-item label="角色" :label-width="formLabelWidth">
      <el-select v-model="currRoleId">
        <el-option disabled label="请选择" :value="-1"></el-option>
        <el-option
      v-for="(item,index) in roles"
      :key="index"
      :label="item.roleName"
      :value="item.id">
    </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
    <el-button type="primary" @click="changeRole">确 定</el-button>
  </div>
</el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdituser">
  <el-form :model="formData">
    <el-form-item label="用户名" :label-width="formLabelWidth">
      <el-input disabled v-model="formData.username" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" :label-width="formLabelWidth">
      <el-input v-model="formData.email" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="电话" :label-width="formLabelWidth">
      <el-input v-model="formData.mobile" autocomplete="off"></el-input>
    </el-form-item>
    
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdituser = false">取 消</el-button>
    <el-button type="primary" @click="edituser">确 定</el-button>
  </div>
</el-dialog>
<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>

</template>

<script>
export default {

    data() {
        return {
           list:[],
           //加载动画
           loading:true,
          //分页相关属性
          // currentPage: 1,
          pagesize: 2,
          pagenum:1,
          total: 20,
          //搜索框
          searchValue:'',
          //添加对话框显示
          dialogFormVisibleAdduser:false,
          //添加用户的表单数据
          formData:{
            username:'',
            password:'',
            email:'',
            mobile:''
          },
          formLabelWidth:'140px',
          //编辑对话框显示
          dialogFormVisibleEdituser:false,
          currUserId:-1,
          // 分配角色显示
          dialogFormVisibleRole:false,
          // 角色分类
          currUserName:'',
          // 当前角色id
          currRoleId:-1,
          // 角色
          roles:[],
          getRoleByUserId:-1
        }
    },
    mounted() {
      this.loadData()
    },
   methods:{

    //  分配角色修改后提交数据
  async changeRole() {
    this.dialogFormVisibleRole = false
    const res =await this.$http.put(`users/${this.getRoleByUserId}/role`,{
      rid:this.currRoleId
    })
    console.log(res)
  },
     //分配角色。显示对话框
     async showRole(user){
       this.getRoleByUserId = user.id
      //  console.log(res)
      this.dialogFormVisibleRole = true
      this.currUserName = user.username
      const res = await this.$http.get('roles')
      this.roles = res.data.data
      //显示当前用户的角色
    //通过users/：id请求 获取当前用户的rid

      const res1 = await this.$http.get(`users/${user.id}`)
      // console.log(res1)
      this.currRoleId = res1.data.data.rid
     },
     //编辑用户提交
async edituser() {
this.dialogFormVisibleEdituser = false
  // console.log(this.currUserId)
  const res= await this.$http.put(`users/${this.currUserId}`,this.formData)
  // console.log(res)
  const {meta:{msg,status}} = res.data
    if(status === 200) {
      this.$message.success(msg)
      // this.loadData()
    }
},
// 显示编辑按钮对话框
 async showEditHandle(user){
this.dialogFormVisibleEdituser = true
this.formData = user
this.currUserId = user.id
},
    //  提交添加对话框表单
    async adduser() {
this.dialogFormVisibleAdduser = false
    const res = await this.$http.post('users',this.formData)
    // console.log(res)
    const {meta:{status,msg}} = res.data
    if(status === 201) {
      this.$message.success(msg)
      this.loadData()
      for (const key in this.formData) {
        this.formData[key] = ''
      }
    }
    },
     //添加用户显示对话框
     showAdduser(){
      this.dialogFormVisibleAdduser = true
     },
     //删除列表
      async deleteHandle(user) {
        //删除弹框
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
                      // 确定删除发生请求
            const res = await this.$http.delete(`users/${user.id}`)
            // console.log(res)
            const {meta:{msg,status}} = res.data
            if(status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'      
          });
                  this.pagenum = 1,
                  this.loadData()      

            }
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
     //搜索
       async handleSearch() {
        this.loadData()
      },
     //用户状态
      async changeMgState() {
        const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
        console.log(res)
      },
      //分页处理
  handleSizeChange(val) {
    // console.log(`每页${val}条`)
    this.pagesize = val
    this.loadData()
  },
  handleCurrentChange(val) {
    // console.log(`当前页${val}条`)
    this.pagenum = val
    this.loadData()
  },
     async loadData() {
       this.loading = true
           //需要设置请求头=token
    const AUTH_TOKEN = sessionStorage.getItem("token")
    this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN
    const res = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`)
    console.log(res);
    const {meta,data} = res.data
        if(meta.status === 200) {
          this.total = res.data.data.total
          this.loading = false
            this.list = data.users
        }
     }
  },
 
};
</script>

<style>
</style>
