import Vue from 'vue';
import Router from 'vue-router';
// 引入login模块
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';
import Rights from '@/views/rights/rights';
import Roles from '@/views/rights/roles';
import Categories from '@/views/goods/categories';
// 导入message
import { Message } from 'element-ui';
// @ 代表的是src的绝对路径
// @ 是在build/webpack.base.conf.js
// 为什么可以省略.vue  在build/webpack.base.conf.js 中配置了
// 模块省略后缀之后，加载的顺序  extensions: ['.js', '.vue', '.json'],
// import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

const router = new Router({
  routes: [
    { name: 'Login', path: '/login', component: Login },
    { name: 'Home',
      path: '/',
      component: Home,
      // 嵌套路由 当home的路由/匹配成功
      // /users会被渲染到home的router-view中
      children: [
        { name: 'Users', path: '/users', component: Users },
        { name: 'Rights', path: '/rights', component: Rights },
        { name: 'Roles', path: '/roles', component: Roles },
        { name: 'Categories', path: '/categories', component: Categories }
      ]
    }
  ]
});

// 路由的全局前置守卫 （拦截器）  -- 路由跳转之前执行
// 每个守卫方法接收三个参数：
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
router.beforeEach((to, from, next) => {
  // console.log(to);
  // console.log(from);
  // 如果是登录的时候不判断token ，不是登录才判断token
  if (to.name && to.name.toLocaleLowerCase() !== 'login') {
    // 在存储中获取到token
    var token = sessionStorage.getItem('token');
    // console.log(token);
    if (!token) {
      // console.log(this);
      Message.warning('请先登录');
      // 没有token，跳转到登录页面
      router.push('/login');
      return;
    }
  }
  next();
  // console.log(to);
  // console.log(from);
});

export default router;
