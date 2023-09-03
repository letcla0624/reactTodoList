import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import Footer from "./Footer";
import AddTodoInput from "./todo/addTodoInput";
import Tabs from "./todo/Tabs";
import TodoItems from "./todo/TodoItems";
import Swal from "sweetalert2";
import { sweetAlert, confirmAlert } from "@/composables/sweetAlert";
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  updateText,
} from "@/api/todos";

export default function TodoList() {
  const [isLoading, setIsLoading] = useState(false); // loading
  const [newTodo, setNewTodo] = useState(""); // 新增待辦事項
  const [allTodos, setAllToDos] = useState([]); // 全部待辦事項
  const [tab, setTab] = useState("全部"); // tab 切換
  const [emptyText, setEmptyText] = useState(""); // 沒有項目時顯示的文字
  const [filterTodoList, setFilterToDoList] = useState([]); // 待辦事項分類
  const [editTodo, setEditTodo] = useState({}); // 編輯單一待辦事項
  const [isEdit, setIsEdit] = useState(false); // 編輯切換畫面，沒有設定無法顯示畫面

  // 取得 localStorage 的 nickname
  const nickname = localStorage.getItem("nickname");

  useEffect(() => {
    getList(tab);
    // 一定要加入這行 eslint 註解，不然會跳警告
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 取得待辦清單
  const navigate = useNavigate();
  const getList = async (tab) => {
    try {
      const { data } = await getTodos();
      // 設定是否編輯
      data.data.map((newItem) => (newItem.isEdit = false));

      setAllToDos(data.data);
      // 排序 (最新的放最前面)
      const filterTodoData = data.data
        .sort((a, b) => b.createTime - a.createTime)
        .filter((item) => {
          if (tab === "全部") {
            return item;
          } else if (tab === "已完成") {
            return item.status;
          } else if (tab === "待完成") {
            return !item.status;
          }
        });
      setFilterToDoList(filterTodoData);
    } catch (error) {
      const { message } = error.response.data;
      sweetAlert("error", "請重新登入", message);
      navigate("/");
    }
  };

  // 刪除已完成的待辦事項
  const handleDeleteFinish = async () => {
    const result = await Swal.fire(
      confirmAlert("確定要刪除全部已完成項目嗎？")
    );
    if (result.isConfirmed) {
      try {
        const finishTodos = allTodos.filter(
          (item) => item.status && deleteTodo(item.id)
        );

        if (!finishTodos.length) {
          sweetAlert("error", "沒有已完成項目", "sorry~您刪除了個寂寞！");
          return;
        }
        // 等全部清除完
        await Promise.all(finishTodos);
        sweetAlert("success", "刪除完成");
        getList(tab);
      } catch (error) {
        const { message } = error.response.data;
        sweetAlert("error", "刪除失敗", message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container position-relative">
      <Logout confirmAlert={confirmAlert} />
      <div className="row justify-content-center align-items-center vh-100 pt-3">
        <div className="col-lg-6">
          <h1 className="fs-2 text-center mb-3">{nickname} 的待辦事項</h1>
          <AddTodoInput
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setTab={setTab}
            addTodo={addTodo}
            getList={getList}
            isEdit={isEdit}
          />
          <div>
            {allTodos.length === 0 ? (
              <p className="text-center text-secondary">目前尚無代辦事項！</p>
            ) : (
              <>
                <Tabs
                  allTodos={allTodos}
                  tab={tab}
                  setTab={setTab}
                  getList={getList}
                  setEmptyText={setEmptyText}
                  isEdit={isEdit}
                  isLoading={isLoading}
                />
                <TodoItems
                  filterTodoList={filterTodoList}
                  emptyText={emptyText}
                  editTodo={editTodo}
                  setEditTodo={setEditTodo}
                  updateTodo={updateTodo}
                  updateText={updateText}
                  deleteTodo={deleteTodo}
                  sweetAlert={sweetAlert}
                  getList={getList}
                  tab={tab}
                  isEdit={isEdit}
                  setIsEdit={setIsEdit}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  confirmAlert={confirmAlert}
                />
                <div className="d-flex justify-content-between align-items-center py-2">
                  <small>
                    剩餘 {allTodos.filter((item) => !item.status).length}{" "}
                    個待完成項目
                  </small>
                  <button
                    type="button"
                    className="btn btn-link btn-sm"
                    disabled={isLoading || isEdit}
                    onClick={handleDeleteFinish}
                  >
                    <i className="bi bi-trash3 me-1" />
                    刪除全部已完成項目
                  </button>
                </div>
                <Footer />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
