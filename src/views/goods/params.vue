<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 提示 -->
    <el-alert
      class="alert"
      :closable="false"
      title="注意：只允许为第三级分类设置相关参数！"
      type="warning"
      show-icon>
    </el-alert>
    <!-- 级联菜单 -->
    <el-cascader
      expand-trigger="hover"
      :options="options"
      :props="defaultProps"
      v-model="selectedOptions"
      @change="handleChange">
    </el-cascader>
    <!-- 选项卡切换 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button
          type="primary"
          size="mini">添加动态参数</el-button>
        <el-table
          :data="paramsData"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- :disable-transitions="false" 是否禁用渐变动画 -->
              <el-tag
                v-for="items in scope.row.params"
                :key="items"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{ items }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              ></el-input>

              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="商品参数"
            width="280">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                plain></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="only">
        <el-button
          type="primary"
          size="mini">添加静态参数</el-button>
        <el-table
          :data="attrsData"
          style="width: 100%">
          <el-table-column
            type="index"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attr_name"
            label="属性名称"
            width="280">
          </el-table-column>
          <el-table-column
            prop="attr_vals"
            label="属性名称"
            width="380">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                plain></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                plain></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 选项卡绑定数据
      activeName: 'many',
      // 动态参数列表展示数据
      paramsData: [],
      // 静态参数列表展示数据
      attrsData: [],
      // 级联菜单展示数据源
      options: [],
      // 配置级联菜单中要展示的属性
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联菜单双向绑定数据
      selectedOptions: [],
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.loadGoodsData();
  },
  methods: {
    // 获取级联菜单展示的数据
    async loadGoodsData () {
      const response = await this.$http.get('categories?type=3');
      // console.log(response);
      this.options = response.data.data;
    },
    // tab点击处理函数
    handleClick(tab, event) {
      // console.log(tab, event);
      // 获取参数数据
      this.loadParamsData();
    },
    // 获取参数要展示的数据
    async loadParamsData() {
      // console.log(this.selectedOptions);
      const response = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=${this.activeName}`);

      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        if (this.activeName === 'many') {
          // console.log(response);
          this.paramsData = response.data.data;
          // 为动态参数数组添加新属性 将参数从字符串变为数组
          this.paramsData.map((items) => {
            const attrList = items.attr_vals.length === 0 ? [] : items.attr_vals.split(',');
            // console.log(attrList);
            this.$set(items, 'params', attrList);
          });
        } else if (this.activeName === 'only') {
          this.attrsData = response.data.data;
        }
      } else {
        this.$message.error(msg);
      }
    },
    handleClose(tag) {
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    handleChange(value) {
      // console.log(value);
      // 判断所选是否是三级分类
      if (value.length !== 3) {
        // 不是的话 则提示
        this.$message.warning('请选择3级分类');
        // 清空选择框中内容
        this.selectedOptions = [];
      } else {
        // 是三级分类 则加载参数数据
        this.loadParamsData();
      }
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
};
</script>

<style>
  .alert {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .el-tag {
    margin: 6px;
  }
</style>
