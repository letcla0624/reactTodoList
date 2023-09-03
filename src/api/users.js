import { request } from "./request";

// 註冊
export const register = (data) => {
  return request({
    method: "POST",
    url: "/users/sign_up",
    data,
  });
};

// 登入
export const login = (data) => {
  return request({
    method: "POST",
    url: "/users/sign_in",
    data,
  });
};

// 驗證
export const checkout = () => {
  return request({
    method: "GET",
    url: "/users/checkout",
  });
};

// 登出
export const logout = (data = {}) => {
  return request({
    method: "POST",
    url: "/users/sign_out",
    data,
  });
};
