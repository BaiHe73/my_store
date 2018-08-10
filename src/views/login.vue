<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="top"
      label-width="80px"
      :model="formData">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <!-- 添加回车登录功能 ？？？？-->
        <!-- 对于组件，vue有自己的事件机制，用的是vue事件机制实现的keyup事件 -->
        <!-- 想要转变为原生的事件机制需要加上native -->
        <!-- 而原生的html标签是原生的事件机制 所以无需加native -->
        <!-- 想使用DOM中的keyup事件 native是告诉组件，我要使用原生DOM事件 -->
        <el-input @keyup.enter.native="handleLogin" type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <!-- 为什么click不加 -->
      <el-button @click="handleLogin" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>
<script>
// 导入axios模块
import axios from 'axios';
export default {
  data() {
    return {
      formData: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      axios
        .post('http://localhost:8888/api/private/v1/login', this.formData)
        .then((response) => {
          // data:
          //   data:
          //   {id: 500, rid: 30, username: "admin", mobile: "12345678", email"adsfad@qq.com" }
          //   meta:
          //   {msg: "登录成功", status: 200}
          // console.log(response);
          var status = response.data.meta.status;
          var message = response.data.meta.msg;
          if (status === 200) {
            // 登录成功
            // 提示
            this.$message.success(message);
            // 获取token 记录在sessionStorage中
            var token = response.data.data.token;
            sessionStorage.setItem('token', token);
            // console.log(token);
            // 跳转
            this.$router.push('/');
          } else {
            // 登录失败
            this.$message.error(message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
  .login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .login-wrap .login-form {
    background-color: #fff;
    width: 400px;
    padding: 30px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
</style>
