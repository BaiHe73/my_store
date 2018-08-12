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
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
            <el-col :span="4">
              <el-tag
                closable>
                {{level1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <el-row
                class="level2"
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    closable
                    type="success">
                    {{level2.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    class="level3"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    closable
                    type="warning">
                    {{level3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            {{ '没有权限' }}
          </el-row>
        </template>
      </el-table-column>
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
        // this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .level1 {
    margin-bottom: 10px;
  }
  .level2 {
    margin-bottom: 6px;
  }
  .level3 {
    margin-bottom: 4px;
    margin-right: 4px;
  }
</style>
