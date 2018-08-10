import axios from 'axios';
// 首先声明一个空对象
const MyAxios = {};
// 插件必须提供一个install方法
MyAxios.install = function(Vue) {
  // 配置全局axios
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';
  Vue.prototype.$http = axios;
};

export default MyAxios;
