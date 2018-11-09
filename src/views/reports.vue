<template>
    <el-card>
        <my-bread level1="订单管理" level2="订单列表"></my-bread>
<div id="main" ref="main" style="width:600px;height:400px;"></div>

    </el-card>

</template>

<script>
import echarts from 'echarts'
export default {
        mounted() {
            this.useEcharts()
        },
        methods:{
            async useEcharts() {
                const myChart = echarts.init(this.$refs.main);

               const option2 = {
    title: {
        text: '堆叠区域图'
    },
    tooltip : {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
   
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
   }
                const res = await this.$http.get(`reports/type/1`)
                // console.log(res)
                const option1 = res.data.data
                const option = {...option1,...option2}
                myChart.setOption(option)
            }
        }
}
</script>

<style>

</style>
