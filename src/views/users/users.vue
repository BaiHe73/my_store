<template>
  <el-card class="card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchRow">
      <el-col :span="24">
        <el-input
          v-model="searchValue"
          clearable
          placeholder="请输入内容"
          class="search">
          <el-button
            @click="handleSearch"
            slot="append"
            icon="el-icon-search"></el-button>
        </el-input>
        <el-button
          type="success"
          plain
          @click="addUserDialogVisible = true">
          添加用户
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="usersData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="200">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话"
        width="180">
      </el-table-column>
      <el-table-column
        label="时间"
        width="150">
        <template slot-scope="scope">
          <!-- scope.row 是当前行绑定的数据对象 -->
          <!-- {{ scope.$index }} -->
          {{ scope.row.create_time | fmtDate('YYYY - MM - DD')}}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态"
        width="80">
        <template slot-scope="scope">
          <el-switch
            @change="handleChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
          <!-- ?????????????????????????????????? -->
          <el-button
            @click="openEditDialog(scope.row)"
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit">
          </el-button>
          <!-- 删除按钮 -->
          <el-button
            @click="handleDelete(scope.row.id)"
            type="danger"
            plain
            size="mini"
            icon="el-icon-delete">
          </el-button>
          <el-button
            @click="handleOpenRoleDialog(scope.row)"
            type="warning"
            plain
            size="mini"
            icon="el-icon-check">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      :page-count="7"
      layout="total, sizes, prev, pager, next, jumper"
      :total="count">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisible">
      <!-- .sync 加上后才可以关上对话框 -->
      <!-- .sync同步 自动更新父组件属性的 v-on 监听器-->
      <!-- ref 被用来给元素或子组件注册引用信息 -->
      <el-form
        :rules="rules"
        ref="addForm"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog
      @close="handleEditClose"
      title="编辑用户"
      :visible.sync="editUserDialogVisible">
      <!-- .sync 加上后才可以关上对话框 -->
      <!-- .sync同步 自动更新父组件属性的 v-on 监听器-->
      <!-- ref 被用来给元素或子组件注册引用信息 ref="editForm"-->
      <el-form
        :rules="rules"
        label-width="80px"
        :model="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="addUserDialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogFormVisible">
      <el-form>
        <el-form-item label="当前用户" label-width="120px">
          {{ currentName }}
        </el-form-item>
        <el-form-item label="请选择角色" label-width="120px">
          <el-select v-model="currentRoleId">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRoleSet">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      usersData: [],
      // 分页相关数据
      // 页码
      pagenum: 1,
      // 每页数据
      pagesize: 2,
      // 总数
      count: 0,
      // 绑定搜索文本框
      searchValue: '',
      // 分配角色需要的数据
      currentName: '',
      // 绑定下拉框
      currentRoleId: '',
      currentUserId: '',
      // 角色列表
      roles: [],
      // 默认添加用户对话框不显示
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      setRoleDialogFormVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
  // 获取用户列表方法
    this.loadData();
  },
  methods: {
    // 获取用户列表方法
    async loadData() {
      // 在发送请求时 要在请求头中添加Authorization=token 携带token
      var token = sessionStorage.getItem('token');
      this.$http.defaults.headers.common['Authorization'] = token;
      // query:查询参数
      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchValue}`);
      // console.log(response);
      // response 的样子
      // { data: ,status: 200, headers: {}..... }
      // response.data 的样子,服务器返回的数据
      // { data: , meta: { msg:'', status: 200 }
      var { data: { meta: { status, msg } } } = response;
      if (status === 200) {
        // 总共的数据数
        this.count = response.data.data.total;
        this.usersData = response.data.data.users;
      } else {
        this.$message.error(msg);
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // 重新渲染页面
      this.loadData();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      // console.log(`当前页: ${val}`);
    },
    handleSearch() {
      this.loadData();
    },
    // 增加用户
    async handleAdd() {
      // 进行表单验证
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          // 表单验证成功
          // 发送添加用户请求
          const response = await this.$http.post('users', this.form);
          // 检测用户是否添加成功
          var { data: { meta: { status, msg } } } = response;
          if (status === 201) {
            // 添加成功
            // 显示提示消息
            this.$message.success(msg);
            // 关闭对话框
            this.addUserDialogVisible = false;
            // 重新加载数据
            this.loadData();
            // 还原表单默认值
            this.$refs.addForm.resetFields();
          } else {
            // 提示失败信息
            this.$message.error(msg);
          }
        } else {
          // 表单验证失败
          this.$message.error('表单验证失败');
        }
      });
    },
    // 打开修改对话框直显示当前用户信息的方法
    openEditDialog(user) {
      // 这个user(随意命名)哪来的？？？？？？
      // console.log(user);
      // 显示对话框
      this.editUserDialogVisible = true;
      this.form.username = user.username;
      this.form.email = user.email;
      this.form.mobile = user.mobile;
      // 存储用户的id
      this.form.id = user.id;
    },
    // 关闭对话框清空表单信息
    handleEditClose() {
      // 清空表单数据 对话框×之后添加用户框无内容
      for (var key in this.form) {
        this.form[key] = '';
      }
    },
    // 编辑用户
    async handleEdit() {
      // 发送编辑用户请求
      const response = await this.$http.put(`users/${this.form.id}`, {
        email: this.form.email,
        mobile: this.form.mobile
      });
      // console.log(response);
      // 检测用户是否添加成功
      var { data: { meta: { status, msg } } } = response;
      if (status === 200) {
        // 添加成功
        // 显示提示消息
        this.$message.success(msg);
        // 关闭对话框
        this.editUserDialogVisible = false;
        // 重新加载数据
        this.loadData();
        // 清空表单 点击添加用户时 表单中无内容
        for (var key in this.form) {
          this.form[key] = '';
        }
        console.log(this.form);
      } else {
        // 提示失败信息
        this.$message.error(msg);
      }
    },
    // 删除用户
    async handleDelete(id) {
      this.$confirm('确认删除用户?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // console.log(id);
          // 点击确定按钮
          // console.log(this);
          const response = await this.$http.delete(`users/${id}`);
          var { meta: { status, msg } } = response.data;
          // console.log(response);
          if (status === 200) {
            // 为啥是一
            if (this.usersData.length === 1 && this.pagenum !== 1) {
              this.pagenum--;
            }
            // 重新渲染页面
            this.loadData();
            // 提示删除信息
            this.$message.success(msg);
          } else {
            this.$message.error(msg);
          }
        })
        .catch(() => {
          // 点击取消删除按钮
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });
    },
    async handleChange(user) {
      // console.log(user);
      const response = await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    // 打开分配角色对话框
    async handleOpenRoleDialog(user) {
      // 打开对话框
      this.setRoleDialogFormVisible = true;
      // 显示当前用户名称
      this.currentName = user.username;
      this.currentUserId = user.id;
      // 获取角色列表信息
      const response = await this.$http.get('roles');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.roles = response.data.data;
        // 根据id查询用户信息里有当前用户角色id
        const userResponse = await this.$http.get(`users/${user.id}`);
        this.currentRoleId = userResponse.data.data.rid;
        // console.log(this.currentRoleId);
      } else {
        this.$message.error(msg);
      }
    },
    // 分配角色
    async handleRoleSet() {
      this.setRoleDialogFormVisible = false;
      const response = await this.$http.put(`users/${this.currentUserId}/role`, {
        rid: this.currentRoleId
      });
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.currentRoleId = response.data.data.rid;
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style>
  .searchRow {
    margin-top: 10px;
  }
  .search {
    width: 300px;
  }
</style>
