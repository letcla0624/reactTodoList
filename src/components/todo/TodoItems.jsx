import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { confirmAlert } from "@/composables/sweetAlert";

TodoItems.propTypes = {
  filterTodoList: PropTypes.array,
  emptyText: PropTypes.string,
  editTodo: PropTypes.object,
  setEditTodo: PropTypes.func,
  updateTodo: PropTypes.func,
  updateText: PropTypes.func,
  deleteTodo: PropTypes.func,
  sweetAlert: PropTypes.func,
  getList: PropTypes.func,
  tab: PropTypes.string,
  isEdit: PropTypes.bool,
  setIsEdit: PropTypes.func,
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
};

export default function TodoItems(props) {
  const {
    filterTodoList,
    emptyText,
    editTodo,
    setEditTodo,
    updateTodo,
    updateText,
    deleteTodo,
    sweetAlert,
    getList,
    tab,
    isEdit,
    setIsEdit,
    isLoading,
    setIsLoading,
  } = props;

  // 更新待辦清單有無勾選的狀態
  const handleChecked = async (e, item) => {
    try {
      const { data } = await updateTodo(item.id);
      sweetAlert("success", data.message);
      getList(tab);
    } catch (error) {
      const { message } = error.response.data;
      sweetAlert("success", message);
    }
  };

  // 刪除單一待辦事項
  const handleDelete = async (item) => {
    const result = await Swal.fire(
      confirmAlert(`確定要刪除 ${item.content} 嗎？`)
    );

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteTodo(item.id);
        sweetAlert("success", "刪除成功");
        getList(tab);
      } catch (error) {
        const { message } = error.response.data;
        sweetAlert("success", "刪除失敗", message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 編輯單一待辦清單
  const handleEdit = async (item) => {
    item.isEdit = true;
    setIsEdit(true);
  };

  // 綁定編輯的 input
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditTodo((item) => ({ ...item, [id]: value.trim() }));
  };

  // 完成編輯
  const handleEditFinish = async (item) => {
    // 如果沒有修改就沿用舊的值，如果有更新就使用新的值
    if (editTodo[item.id] === undefined) {
      editTodo[item.id] = item.content;
    }

    const changeText = {
      content: editTodo[item.id],
    };

    try {
      await updateText(item.id, changeText);
      sweetAlert("success", "更新成功");
      item.isEdit = false;
      setIsEdit(false);
      getList(tab);
    } catch (error) {
      const { message } = error.response.data;
      sweetAlert("error", "更新失敗", message);
    }
  };

  // 完成編輯 Enter 鍵
  const handleUpdateTextDown = (e, item) => {
    if (e.key === "Enter") {
      handleEditFinish(item);
    }
  };

  return (
    <div className="tab-content" id="pills-tabContent">
      <div
        className="border rounded-bottom-3 px-3 py-1"
        style={{
          height: `calc(100vh - 240px)`,
          maxHeight: "600px",
          overflowY: "scroll",
        }}
      >
        <ul className="list-unstyled p-0">
          {filterTodoList.length === 0 ? (
            <li className="text-center text-secondary mt-3">{emptyText}</li>
          ) : (
            filterTodoList.map((item) => (
              <li
                className="todoList form-check border-bottom border-dark-subtle d-flex align-items-center"
                key={item.id}
              >
                {item.isEdit ? (
                  <input
                    type="text"
                    id={item.id}
                    className="flex-grow-1 p-2 my-2"
                    autoFocus
                    value={editTodo.content}
                    defaultValue={item.content}
                    onKeyDown={(e) => {
                      handleUpdateTextDown(e, item);
                    }}
                    onChange={handleChange}
                  />
                ) : (
                  <div className="d-flex align-items-center w-75 flex-grow-1">
                    <input
                      type="checkbox"
                      className="form-check-input me-2 checkTodo"
                      checked={item.status}
                      id={item.id}
                      value={item.content}
                      onChange={(e) => {
                        handleChecked(e, item);
                      }}
                      disabled={isLoading || isEdit}
                    />
                    <label
                      className="form-check-label fs-6 py-3 w-100 text-truncate"
                      htmlFor={item.id}
                      style={{
                        cursor: isEdit ? "not-allowed" : "pointer",
                      }}
                    >
                      {item.content}
                    </label>
                  </div>
                )}
                <div className="btn-group ms-3" role="group">
                  {item.isEdit ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => {
                        handleEditFinish(item);
                      }}
                    >
                      <i className="bi bi-check-lg" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={isLoading || isEdit}
                      onClick={() => {
                        handleEdit(item);
                      }}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    disabled={isLoading || isEdit}
                    onClick={() => {
                      handleDelete(item);
                    }}
                  >
                    <i className="bi bi-trash3" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
