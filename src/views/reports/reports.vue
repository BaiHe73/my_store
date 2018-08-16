<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div ref="main" style="width:800px;height:600px;margin-top:10px"></div>
  </el-card>
</template>

<script>
import Echarts from 'echarts';
export default {
  data() {
    return {
      optionOther: {
        title: {
          text: '用户来源'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await this.$http.get('reports/type/1');
      // console.log(response);
      const myChart = Echarts.init(this.$refs.main);
      let option = response.data.data;
      option = {...option, ...this.optionOther};
      option.xAxis[0].boundaryGap = false;
      console.log(option);
      myChart.setOption(option);
    }
  }
};

</script>

<style>

</style>
