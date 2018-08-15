<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示栏 -->
    <el-alert
      class="alert"
      title="添加商品信息"
      type="info"
      center
      show-icon>
    </el-alert>
    <!-- 步骤条 -->
    <el-steps
      space="200px"
      :active="active"
      align-center
      finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab切换 -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs
        @tab-click="handleClick"
        tab-position="left"
        style="margin-top: 20px">
        <el-tab-pane label="基本信息">
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
            <!-- :options="options" 绑定要展示的数据源-->
            <!-- :prop="defaultProps" 选中要展示的属性-->
            <!-- v-model="selectedOptions" -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              :props="defaultProps"
              v-model="selectedOptions"
              @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      // 表单绑定数据
      form: {},
      // 级联菜单绑定的数据源
      options: [],
      // 级联菜单双向绑定的数组
      selectedOptions: [],
      defaultProps: {
        // 指定选项的值为选项对象的某个属性值
        value: 'cat_id',
        // 指定选项的名称为选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的子选项为选项对象的某个属性值
        children: 'children'
      }
    };
  },
  created() {
    this.loadGoodsData();
  },
  methods: {
    // 加载多级菜单数据
    async loadGoodsData() {
      const response = await this.$http.get('categories?type=3');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.options = response.data.data;
      } else {
        this.$message.error(msg);
      }
    },
    // tab栏点击切换步骤条效果
    handleClick(tab, event) {
      // console.log(tab, event);
      // 将tab中的index属性赋给active 从字符串转化为数值类型
      this.active = tab.index - 0;
    },
    // 多级下拉选中项变化的时候执行
    handleChange(value) {
      if (value.length !== 3) {
        this.$message.warning('请选择3级分类');
        // 清空级联下拉中的内容
        this.selectedOptions.length = 0;
      }
      // console.log(this.selectedOptions);
      // console.log(value);
    }
  }
};
</script>

<style>
  .alert {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-step__title {
    font-size: 12px;
  }
</style>
