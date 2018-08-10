<template>
  <el-card class="box-card">
    <!-- 面包屑组件 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchRow">
      <el-col :span="24">
        <el-input placeholder="请输入内容" class="search">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success" plain>添加用户</el-button>
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
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            plain
            size="mini"
            icon="el-icon-edit">
          </el-button>
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
      count: 0
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

      var response = await this.$http.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style>
  .box-card {
    height: 100%;
  }
  .searchRow {
    margin-top: 10px;
  }
  .search {
    width: 300px;
  }
</style>
