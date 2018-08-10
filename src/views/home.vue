<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><div><img src="@/assets/logo.png"></div></el-col>
        <el-col :span="19"><div class="title">电商后台管理系统</div></el-col>
        <el-col :span="1"><div class="logout"><a href="#">退出</a></div></el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">Aside</el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {

};
</script>

<style scoped>
  .container {
    height: 100%;
  }
  .header {
    background-color: #B3C0D1;
    padding: 0;
  }
  .header .title {
    color: #fff;
    text-align: center;
    font-size: 24px;
    line-height: 60px;
  }
  .header .logout a {
    color: orange;
    text-decoration: none;
    line-height: 60px;
  }
  .aside {
    background-color: #D3DCE6;
    /*color: #333;*/
    /*text-align: center;*/
  }

  .main {
    background-color: #E9EEF3;
    /*color: #333;*/
    /*text-align: center;*/
    /*line-height: 160px;*/
  }
</style>
