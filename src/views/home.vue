<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"><div><img src="@/assets/logo.png"></div></el-col>
        <el-col :span="19"><div class="title">电商后台管理系统</div></el-col>
        <el-col :span="1">
          <div class="logout">
            <a href="#" @click.prevent="handleLogout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <!-- default-active 可以让某一个menu-item选中，值是menu-item的index的值
             unique-opened 默认只有一项展开
             router 开启路由模式， menu-item的index作为路由地址,是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
         -->
        <el-menu
          unique-opened
          router
          style="height:100%"
          >
          <el-submenu
            v-for="level1 in menusList"
            :key="level1.id"
            :index="level1.id.toString()">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ level1.authName }}</span>
            </template>
            <el-menu-item
              v-for="level2 in level1.children"
              :key="level2.id"
              :index="'/' + level2.path">
              <i class="el-icon-menu"></i>
              {{ level2.authName }}
            </el-menu-item>
          </el-submenu>
 <!--          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
              <el-menu-item index="/users"><i class="el-icon-menu"></i>用户列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
              <el-menu-item index="/roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
              <el-menu-item index="/rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
              <el-menu-item index="3-1"><i class="el-icon-menu"></i>商品列表</el-menu-item>
              <el-menu-item index="3-2"><i class="el-icon-menu"></i>分类参数</el-menu-item>
              <el-menu-item index="3-3"><i class="el-icon-menu"></i>商品分类</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
              <el-menu-item index="4-1"><i class="el-icon-menu"></i>订单列表</el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
              <el-menu-item index="5-1"><i class="el-icon-menu"></i>数据报表</el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-main class="main">
        <!-- 嵌套路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menusList: []
    };
  },
  created() {
    this.loadMenu();
  },
  methods: {
    // 退出处理函数
    handleLogout() {
      // 提示登录成功
      this.$message.success('退出成功');
      // 清除token
      sessionStorage.clear('token');
      // 跳转到登录页
      this.$router.push('/login');
    },
    async loadMenu() {
      const response = await this.$http.get('menus');
      // console.log(response);
      const { meta: { status, msg } } = response.data;
      if (status === 200) {
        this.menusList = response.data.data;
        // console.log(this.menusList);
      } else {
        this.$message.error(msg);
      }
    }
  }
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
    height: 100%;
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
