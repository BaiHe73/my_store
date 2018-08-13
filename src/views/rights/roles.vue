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
          <!-- 显示一级权限的名称 -->
          <el-row
            class="level1"
            v-for="level1 in scope.row.children"
            :key="level1.id">
            <el-col :span="4">
              <el-tag
                @close="handleClose(scope.row,level1.id)"
                closable>
                {{level1.authName}}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 显示二级权限的名称 -->
              <el-row
                class="level2"
                v-for="level2 in level1.children"
                :key="level2.id">
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row,level2.id)"
                    closable
                    type="success">
                    {{level2.authName}}
                  </el-tag>
                </el-col>
                <el-col :span="20">
                  <!-- 显示三级权限的名称 -->
                  <el-tag
                    @close="handleClose(scope.row,level3.id)"
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
            @click="handleOpenRightsDialog(scope.row)"
            type="warning"
            plain
            size="mini"
            icon="el-icon-check">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible">
      <!-- node-key="id" -->
      <!-- ref="tree" -->
      <!-- highlight-current -->
      <el-tree
        ref="tree"
        :data="rightsData"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="checkedList"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolesData: [],
      setRightsDialogVisible: false,
      rightsData: [],
      checkedList: [],
      // 设置角色id
      roleId: -1,
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 设置树节点上展示的属性
        label: 'authName'
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const response = await this.$http.get('roles');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.rolesData = response.data.data;
        // this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 删除用户权限
    async handleClose(role, rightsId) {
      const response = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`);
      const { meta: { status, msg } } = response.data;
      // console.log(response);
      if (status === 200) {
        // this.loadData();
        // 重新加载当前角色所对应的权限列表?????
        // 重新加载页面会关闭下拉框 这样处理可以直观显示关闭了哪项
        role.children = response.data.data;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 展示分配权限列表
    async handleOpenRightsDialog(rights) {
      // console.log(rights);
      // 获取角色id 作为分配权限时url参数
      this.roleId = rights.id;
      // 清空权限列表
      this.checkedList = [];
      // 打开分配权限对话框
      this.setRightsDialogVisible = true;
      // 发送获取权限列表请求
      const response = await this.$http.get('rights/tree');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.rightsData = response.data.data;
        // 把当前角色所拥有的权限id，存储到checkedList
        rights.children.forEach((level1) => {
          // console.log(level1);
          level1.children.forEach((level2) => {
            // console.log(level2);
            level2.children.forEach((level3) => {
              // console.log(level3);
              this.checkedList.push(level3.id);
            });
          });
        });
        // console.log(this.checkedList);
      } else {
        this.$message.error(msg);
      }
    },
    // 分配权限
    async handleSetRights() {
      // console.log(this.$refs.tree.getCheckedKeys());
      // console.log(this.roleId);

      // 全选(√)节点的id
      const checkedList = this.$refs.tree.getCheckedKeys();
      // console.log(checkedList);
      // 半选(-)节点的id
      const halfCheckedList = this.$refs.tree.getHalfCheckedKeys();
      // console.log(halfCheckedList);
      // 所有节点的id数组
      const rightsArr = checkedList.concat(halfCheckedList);
      // console.log(arr);
      const response = await this.$http.post(`roles/${this.roleId}/rights`, {
        // 参数：权限id列表, 以','分割
        rids: rightsArr.join(',')
      });
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        // 响应成功
        this.setRightsDialogVisible = false;
        this.loadData();
        this.$message.success(msg);
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
