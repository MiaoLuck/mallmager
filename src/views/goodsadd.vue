<template>
<el-card>
<my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert
    class="top"
    title="添加商品信息"
    type="info"
    center
    show-icon>
  </el-alert>
    <!-- 步骤条 -->
  <el-steps :space="200" align-center  :active="active*1" finish-status="success">
  <el-step title="基本信息"></el-step>
  <el-step title="商品参数"></el-step>
  <el-step title="商品属性"></el-step>
  <el-step title="商品图片"></el-step>
  <el-step title="商品内容"></el-step>

</el-steps>
<!-- tabs栏 -->
<el-form class="form" :model="form">
<el-tabs class="h" v-model="active" tab-position="left" @tab-click="tabChange()">
    <el-tab-pane name="1" label="基本信息">
        <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
                 <!-- 这里不用自带的下拉框, 找el-ui中的级联选择器 -->
          <el-cascader
          change-on-select
          clearable
            expand-trigger="hover"
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane name="2" label="商品参数">
        <el-form-item :label="item.attr_name" v-for="item in dyParams" :key="item.attr_id"><br>
            <!-- {{checkList}} -->
        <el-checkbox-group v-model="item.attr_vals" >
    <el-checkbox border :label="item2" 
    v-for="(item2,index) in item.attr_vals"
    :key="index"
    ></el-checkbox>
    
  </el-checkbox-group>
  </el-form-item>
    </el-tab-pane>
    <el-tab-pane name="3" label="商品属性">
         <el-form-item :label="item.attr_name"
         v-for="item in staticParams"
         :key="item.attr_id"
         >
            <el-input v-model="item.attr_vals"
            ></el-input>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane name="4" label="商品图片">
        <el-upload
  action="http://localhost:8888/api/private/v1/upLoad"
  :headers="headers"
  :on-preview="handlePreview"
  :on-remove="handleRemove"
  :on-success="handleSuccess"
  list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>

    <el-tab-pane name="5" label="商品内容">
        <el-button type="primary" @click="addGoods()">添加商品</el-button>
        <!-- 富文本编辑器 -->
        <quill-editor class="h" v-model="form.goods_introduce"></quill-editor>
        </el-tab-pane>   
  </el-tabs>
</el-form>
</el-card>
</template>

<script>


import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'
export default {
    components: {
    quillEditor
  },
        data() {
            return{
                
                active:'1',
                form:{
                    goods_name:'',                   
                    goods_price:'',                    
                    goods_weight:'',
                    goods_number:'',
                    goods_introduce:'',
                    goods_cat:'',
                    pics:[],
                    attrs:[],
                    
                },
                defaultProp:{
                    value:'cat_id',
                    label:'cat_name',
                    children:'children'
                },
                caslist:[],
                selectedOptions:[],
                checkList:[],
                // 动态参数的数据数组
                dyParams:[],
                staticParams:[],
                headers:{
                    'Authorization':sessionStorage.getItem('token')
                }
            }
        },
        created(){
            this.getGoodsCate()
        },  
        methods:{
            //添加商品按钮
            async addGoods(){
                this.form.goods_cat = this.selectedOptions.join(',')


                
                const res = await this.$http.post('goods',this.form)
                // console.log(res)
            },
            //图片上传
            handlePreview(file) {
                // console.log('handlePreview')
                // console.log(file)
            },
            handleRemove(file) {
                // console.log('handleRemove')
                // console.log(file)
                const index = this.form.pics.findIndex((item)=>{
                    return item.pic===file.response.data.tmp_path
                })
                //上传移除的照片的索引
                // console.log(index)
                this.form.pics.splice(index,1)
            },
            handleSuccess(response) {
                // console.log('handleSuccess')
                // console.log(response)
                this.form.pics.push({
                    pic:response.data.tmp_path
                })
            },
            // 切换商品参数页面发请求
           async tabChange(){
                if(this.active==='2'||this.active==='3') {
                    if(this.selectedOptions.length !==3) {
                        this.$message.error('请先选择商品三级分类')
                        return
                    }
                    const sel = this.active==='2'?"many":"only"
 const res =await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${sel}`)

                    if(this.active==='2'){
                    // console.log(res)
                    this.dyParams = res.data.data
                    this.dyParams.forEach((item)=>{
                        item.attr_vals = 
                        item.attr_vals.trim().length===0 ? [] : item.attr_vals.trim().split(',')
                    })
                    }else{
                        this.staticParams = res.data.data
                        // console.log(this.staticParams)
                    }
                   
                }
            },
            //获取三级分类数据
            async getGoodsCate() {
                const res = await this.$http.get(`categories?type=3`)
                // console.log(res)
                this.caslist = res.data.data
            },
            handleChange() {

            }
        }
}
</script>

<style>
.top{
    margin: 20px 0;
}
.h{
    margin-top: 20px;
}
.el-step__title{
    font-size: 12px;
}
.ql-editor{
    min-height: 150px;
}
</style>
