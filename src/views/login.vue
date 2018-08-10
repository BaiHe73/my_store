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
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
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
  created() {
    console.log('123');
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
