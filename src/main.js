// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
// 引入element模块
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入全局样式文件
import '@/assets/css/index.css';
// 引入格式化时间模块
import moment from 'moment';

// 注册插件
Vue.use(ElementUI);

// 全局过滤器 格式化时间
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr);
});

// 配置全局axios
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
