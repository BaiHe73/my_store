import Vue from 'vue';
import Router from 'vue-router';
// 引入login模块
import Login from '@/views/login';
import Home from '@/views/home';
// @ 代表的是src的绝对路径
// @ 是在build/webpack.base.conf.js
// 为什么可以省略.vue  在build/webpack.base.conf.js 中配置了
// 模块省略后缀之后，加载的顺序  extensions: ['.js', '.vue', '.json'],
// import HelloWorld from '@/components/HelloWorld';

Vue.use(Router);

export default new Router({
  routes: [
    { name: 'Home', path: '/', component: Home },
    { name: 'Login', path: '/login', component: Login }
  ]
});
