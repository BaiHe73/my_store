<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-table
      border
      stripe
      :data="rolesData"
      style="width: 100%; margin-top:10px">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="330">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="330">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <!-- ?????????????????????????????????? -->
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit">
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            plain
            size="mini"
            icon="el-icon-delete">
          </el-button>
          <el-button
            type="warning"
            plain
            size="mini"
            icon="el-icon-check">
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
      rolesData: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('roles');
      console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.rolesData = response.data.data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>

</style>
