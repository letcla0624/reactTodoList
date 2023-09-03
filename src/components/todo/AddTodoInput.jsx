import PropTypes from "prop-types";
import Loading from "../Loading";
import { sweetAlert } from "@/composables/sweetAlert";

AddTodoInput.propTypes = {
  newTodo: PropTypes.string,
  setNewTodo: PropTypes.func,
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
  setTab: PropTypes.func,
  addTodo: PropTypes.func,
  getList: PropTypes.func,
  isEdit: PropTypes.bool,
};

export default function AddTodoInput(props) {
  const {
    newTodo,
    setNewTodo,
    isLoading,
    setIsLoading,
    setTab,
    addTodo,
    getList,
    isEdit,
  } = props;

  // 加入待辦清單
  const addList = async () => {
    if (!newTodo) return;

    const todo = {
      content: newTodo,
    };

    try {
      setIsLoading(true);
      await addTodo(todo);
      sweetAlert("success", "已加入待辦清單");
      // 清空 input
      setNewTodo("");
      // 新增完回到全部頁籤
      setTab("全部");
      getList("全部");
    } catch (error) {
      const { message } = error.response.data;
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  // 加入待辦清單 Enter 鍵
  const handleAddTextDown = (e) => {
    if (e.key === "Enter") {
      addList();
    }
  };

  return (
    <div className="input-group mb-3 mb-lg-4">
      <input
        type="text"
        className="form-control form-control-lg"
        placeholder="請輸入待辦事項"
        aria-label="請輸入待辦事項"
        aria-describedby="addBtn"
        autoFocus
        value={newTodo}
        onKeyDown={handleAddTextDown}
        disabled={isEdit}
        onChange={(e) => {
          setNewTodo(e.target.value.trim());
        }}
      />
      <button
        className="btn btn-primary"
        type="button"
        id="addBtn"
        onClick={addList}
        disabled={isLoading || isEdit}
      >
        <Loading isLoading={isLoading} />
        <i className={`bi bi-plus fs-4 ${isLoading ? "d-none" : "d-block"}`} />
      </button>
    </div>
  );
}
