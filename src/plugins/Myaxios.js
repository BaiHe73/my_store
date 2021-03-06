import axios from 'axios';
// 首先声明一个空对象
const MyAxios = {};
// 插件必须提供一个install方法
MyAxios.install = function(Vue) {
  // 配置全局axios
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/';

  // 设置axios的拦截器
  // Add a request interceptor
  // 请求的拦截器
  // 发送请求之前，判断当前请求是否是login，如果是登录继续执行
  // 如果不是login，设置请求头中的Authorization
  axios.interceptors.request.use(function (config) {
    // 获取到当前请求的路径
    // 设置请求头
    // console.log(config);
    // console.log(config.headers);
    // console.log(config.url);
    if (config.url.toLocaleLowerCase() !== 'login') {
      // 设置请求头
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  // Add a response interceptor
  // 响应的拦截器
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  Vue.prototype.$http = axios;
};

export default MyAxios;
