import { request } from "./request";

// 取得 Todos
export const getTodos = () => {
  return request({
    method: "GET",
    url: "/todos",
  });
};

// 新增一個 todo
export const addTodo = (data) => {
  return request({
    method: "POST",
    url: "/todos",
    data,
  });
};

// 更新指定 todo 的勾選狀態
export const updateTodo = (id, data = {}) => {
  return request({
    method: "PATCH",
    url: `/todos/${id}/toggle`,
    data,
  });
};

// 刪除一個指定 todo
export const deleteTodo = (id) => {
  return request({
    method: "DELETE",
    url: `/todos/${id}`,
  });
};

// 更新指定 todo 文字
export const updateText = (id, data) => {
  return request({
    method: "PUT",
    url: `/todos/${id}`,
    data,
  });
};
