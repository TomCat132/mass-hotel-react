// axios.js
import axios from 'axios';
import { useApiPrefix } from './config'; 

// 创建一个 Axios 实例
const apiClient = axios.create({
  baseURL: useApiPrefix ? '/api' : '', // 根据开关变量设置 baseURL true:本地环境  false:打包nginx部署
  headers: {
    'Content-Type': 'application/json',
    // 其他默认请求头
  }
});

// 添加请求拦截器（可选）
apiClient.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，例如添加认证 token
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器（可选）
apiClient.interceptors.response.use(
  response => {
    // 处理响应数据
    return response;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default apiClient;