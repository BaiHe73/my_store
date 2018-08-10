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
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <!-- <el-table-column
        prop="do"
        label="操作">
        <el-button type="primary" icon="el-icon-edit"></el-button>
        <el-button type="primary" icon="el-icon-share"></el-button>
        <el-button type="primary" icon="el-icon-delete"></el-button>
      </el-table-column> -->

    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          name: '2016-05-02',
          email: '王小虎',
          mobile: '上海市普陀区金沙江路 1518 弄'
        },
        {
          name: '2016-05-02',
          email: '王小虎',
          mobile: '上海市普陀区金沙江路 1518 弄'
        },
        {
          name: '2016-05-02',
          email: '王小虎',
          mobile: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    };
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
