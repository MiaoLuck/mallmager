<template>
    <el-card>
        <my-bread level1="订单管理" level2="订单列表"></my-bread>
         <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="40">
      </el-table-column>
      <el-table-column
        prop="order_number"
        label="订单编号"
        width="220">
      </el-table-column>
      <el-table-column
        prop="order_price"
        label="订单价格"
        width="80">
      </el-table-column>
      <el-table-column
        prop="order_pay"
        label="是否付款"
        width="80">
        <template slot-scope="scope"> 
            <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
            <el-tag type="denger" v-if="scope.row.order_pay==='1'">未付款</el-tag>

        </template>
      </el-table-column>
      <el-table-column
        prop="is_send"
        label="是否发货"
        width="80">
      </el-table-column>
      <el-table-column
       
        label="下单时间">
        <template slot-scope="scope">
            {{scope.row.create_time|fmtDate}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
                <el-button @click="showEditdia(scope.row)" size="mini" type="primany" icon="el-icon-edit" plain></el-button>
              </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="省市区" :label-width="formLabelWidth">
        <el-cascader
            expand-trigger="hover"
            clearable
            :options="catlist"
            v-model="selectedOptions"
            >
      </el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" :label-width="formLabelWidth">
      <el-input v-model="form.address" autocomplate="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
    
</template>

<script>
    import options from '@/assets/city_data2017_element.js'
export default {
        data() {
            return{
                list:[],
               dialogFormVisible:false,
               form:{
                   address:''
               },
               catlist:[],
               selectedOptions:[]
            }
        },
        created(){
            this.catlist = options
            this.getData()
        },
        methods:{
            async getData(){
                const res = await this.$http.get(`orders?pagenum=1&pagesize=10`)
                console.log(res)
                this.list = res.data.data.goods
            },
            showEditdia(){
                this.dialogFormVisible = true

            }
        }
}
</script>

<style>

</style>
