<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button
      class="btn"
      type="success"
      plain>
      添加分类
    </el-button>
    <!-- 分类列表 -->
    <el-table
      border
      stripe
      :data="categoriesData"
      style="width: 100%">
      <el-table-column
        prop="cat_name"
        label="分类名称"
        width="380">
      </el-table-column>
      <el-table-column
        label="级别"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level === 0">一级</span>
          <span v-else-if="scope.row.cat_level === 1">二级</span>
          <span v-else-if="scope.row.cat_level === 2">三级</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cat_deleted"
        label="是否有效"
        width="150">
        <template slot-scope="scope">
          {{ scope.row.cat_deleted? '无效' : '有效' }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            icon="el-icon-edit">
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            icon="el-icon-delete">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      categoriesData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('categories?type=3');
      console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.categoriesData = response.data.data;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .btn {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
