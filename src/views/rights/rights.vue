<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表 -->
    <el-table
      border
      stripe
      :data="rightsData"
      style="width: 100%; margin-top:10px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="200">
      </el-table-column>
      <el-table-column
        label="层级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'">一级</span>
          <span v-else-if="scope.row.level === '1'">二级</span>
          <span v-else-if="scope.row.level === '2'">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightsData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载页面数据
    async loadData() {
      const response = await this.$http.get('rights/list');
      console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.rightsData = response.data.data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .card {
    height: 100%;
  }
</style>
