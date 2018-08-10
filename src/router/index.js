import Vue from 'vue';
import Router from 'vue-router';
// 引入login模块
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';
// @ 代表的是src的绝对路径
// @ 是在build/webpack.base.conf.js
// 为什么可以省略.vue  在build/webpack.base.conf.js 中配置了
// 模块省略后缀之后，加载的顺序  extensions: ['.js', '.vue', '.json'],
// import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    { name: 'Home',
      path: '/',
      component: Home,
      // 嵌套路由 当home的路由/匹配成功
      // /users会被渲染到home的router-view中
      children: [
        { name: 'Users', path: '/users', component: Users }
      ]
    }
  ]
});
