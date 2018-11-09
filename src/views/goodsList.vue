<template>
<!-- 卡片容器 -->
<el-card class="box-card">

<!-- 面包屑 -->
<my-bread level1="商品管理" level2="商品列表"></my-bread>
<!-- 搜索框 -->
<div style="margin-top: 15px;">
    <el-row>
        <el-col :span="10">
  <el-input placeholder="请输入内容" clearable v-model="searchValue" class="searchInput">
    <el-button slot="append"  icon="el-icon-search"></el-button>
  </el-input>
        </el-col>
        <el-col :span="14">
  <el-button type="success" @click="goodsAdduser()">商品添加</el-button>
  </el-col>
  </el-row>
</div>



<!-- 表格 -->
<el-table
      class="table"
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="380">
      </el-table-column>
      <el-table-column
      prop="goods_price"
        label="商品价格（元）">
      </el-table-column>
      <el-table-column
      prop="goods_weight"
        label="商品重量">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{scope.row.add_time | fmtDate}}
        </template>
      </el-table-column>
   
      <el-table-column label="操作">
        <template slot-scope="scope">
           <el-row>
            <el-button type="primary" @click ="showEditHandle(scope.row)" icon="el-icon-edit" size="mini" plain circle></el-button>
            <el-button type="danger" @click ="deleteHandle(scope.row)" icon="el-icon-delete" size="mini" plain circle></el-button>
      </el-row>
        </template>
       
      </el-table-column>
    </el-table>
<!-- 分页 -->
<el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
 

</el-card>

</template>

<script>
export default {
    data() {
        return{
            searchValue:'',
            list:[],
            pagenum:1,
            pagesize:5,
            total:1
        }
    },
    created() {
        this.loadGoodsList()
    },
    methods:{
        //添加商品
        goodsAdduser(){
          this.$router.push({name:'goodsadd'})
        },
         //分页处理
  handleSizeChange(val) {
    // console.log(`每页${val}条`)
    this.pagesize = val
    this.loadGoodsList()
  },
  handleCurrentChange(val) {
    // console.log(`当前页${val}条`)
    this.pagenum = val
    this.loadGoodsList()
  },
        //获取商品数据
        async loadGoodsList(){
    const res = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${
            this.searchValue
            }`
        )
            // console.log(res)
            this.list = res.data.data.goods
            this.total = res.data.data.total
        }
    }
}
</script>

<style>

</style>
