<template>
<el-card class="box-card">
<!-- 面包屑 -->
<my-bread level1="商品管理" level2="商品分类"></my-bread>
<el-button class="btn" @click="addGoodCate()">添加角色</el-button>

<!-- 添加分类对话框  -->
 <el-dialog title="添加商品分类" :visible.sync="addDialogFormVisible">
      <el-form :model="form" label-width="140px">
        <el-form-item label="分类名称">
            <!-- {{selectedOptions}} -->
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="分类" label-width="140px">
          <!-- 这里不用自带的下拉框, 找el-ui中的级联选择器 -->
          <el-cascader
          change-on-select
          clearable
            expand-trigger="hover"
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
          >
          </el-cascader>
        </el-form-item>

        
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCate()">确 定</el-button>
    </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改商品分类" :visible.sync="editgoodsFormVisible">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="form.cat_name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleEdit">确 定</el-button>
    </div>
</el-dialog>
<!-- 表格 -->
    <el-table
      :data="list"
      style="width: 100%">
      <!-- <el-table-column
        prop="cat_name"
        label="商品名称"
        width="100">
      </el-table-column> -->

        <el-tree-grid
        prop="cat_name"
        label="分类名称"
        width="200"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children">           
            </el-tree-grid>  
            <el-table-column
             prop="cat_level"
             label="级别">
                <template slot-scope="scope">
            <span v-if="scope.row.cat_level===0">一级</span>
            <span v-else-if="scope.row.cat_level===1">二级</span>
            <span v-else-if="scope.row.cat_level===2">三级</span>
             </template>
            </el-table-column>
            <el-table-column
                prop="cat_deleted"
                 label="是否有效">
            <template slot-scope="scope">
            <span v-if="scope.row.cat_deleted===false">有效</span>
            <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-row>
            <el-button type="primary" @click ="showEditHandle(scope.row)" icon="el-icon-edit" size="mini" plain circle></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="showDelefirm(scope.row.cat_id)" size="mini" plain circle></el-button>
      </el-row>
        </template>
       
      </el-table-column>
    </el-table>
    <!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
</el-pagination>
</el-card>
</template>
<script>
const ElTreeGrid = require('element-tree-grid')
export default {
    components:{
        'el-tree-grid':ElTreeGrid
    },
    data() {
        return{
            list:[],
            pagenum:1,
            pagesize:10,
            total:1,
            addDialogFormVisible:false,
            form:{
                cat_pid:-1,
                cat_name:'',
                cat_level:-1
            },
            //级联选择器要用的数组
            caslist:[],
            selectedOptions:[],
            defaultProp:{
                value:'cat_id',
                label:'cat_name',
                children:'children'
            },
            editgoodsFormVisible:false
        }
    },
    created() {
        this.getGoodCate()
    },
methods:{
    //编辑分类
    // 编辑后发送请求
    async handleEdit(){
const res = await this.$http.put(`categories/${this.form.cat_id}`, this.form)
      const { meta } = res.data
      if (meta.status === 200) {
        this.editgoodsFormVisible = false
        this.$message.success(meta.msg)
        this.getGoodCate()
      } else {
        this.$message.error(meta.msg)
      }
    },
        //显示对话框
showEditHandle(cat){
    this.form.cat_name = cat.cat_name
      this.form.cat_id = cat.cat_id
      // console.log(this.form)
    this.editgoodsFormVisible=true

},
    //删除
    showDelefirm(catId) {
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送删除的网络请求
        const { data: resData } = await this.$http.delete(`categories/${catId}`)
        if (resData.meta.status === 200) {
          this.$message.success('删除成功')
          this.getGoodCate()
        } else {
          this.$message.error(resData.meta.msg)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
        //添加分类，发送请求
     async addCate(){
         this.addDialogFormVisible = false

         //区分添加的级别
            if(this.selectedOptions.length ===0){
                    this.form.cat_pid= 0
                    // this.form.cat_level= 0
            }else if(this.selectedOptions.length ===1){
                    this.form.cat_pid= this.selectedOptions[0]
                    // this.form.cat_level= 1
            }else if(this.selectedOptions.length ===2){
                    this.form.cat_pid= this.selectedOptions[1]
                    // this.form.cat_level= 2
            }
            // 简化代码
            this.form.cat_level = this.selectedOptions.length
            const res = await this.$http.post(`categories`,this.form)
            // console.log(res)
            const {meta:{status,msg}} =res.data
            if(status===201){
                this.$message.success(msg)
            this.getGoodCate()
            }else{
                this.$message.warning(msg)
            }
        },
      //添加商品分类
    async addGoodCate(){
        this.addDialogFormVisible = true
        const res = await this.$http.get(`categories?type=2`)
        // console.log(res)
        this.caslist = res.data.data
    },
        //分页处理
  handleSizeChange(val) {
    // console.log(`每页${val}条`)
    this.pagesize = val
    this.getGoodCate()
  },
  handleCurrentChange(val) {
    // console.log(`当前页${val}条`)
    this.pagenum = val
    this.getGoodCate()
  },
    //获取所有分类
    async getGoodCate() {
        const res = await this.$http.get(`categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
        // console.log(res)
        this.list = res.data.data.result
        this.total = res.data.data.total
    },
  

}
}
</script>

<style>
.btn{
    margin-top:20px;
}
</style>
