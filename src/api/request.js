import axios from "axios";
import Cookies from "js-cookie";

export const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// 使用請求攔截器來加上 headers Authorization
request.interceptors.request.use((config) => {
  const token = Cookies.get("todoToken");
  config.headers.Authorization = token;

  return config;
});
