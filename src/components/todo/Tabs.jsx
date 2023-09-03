import PropTypes from "prop-types";

Tabs.propTypes = {
  allTodos: PropTypes.array,
  tab: PropTypes.string,
  setTab: PropTypes.func,
  getList: PropTypes.func,
  setEmptyText: PropTypes.func,
  isEdit: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default function Tabs(props) {
  const { allTodos, tab, setTab, getList, setEmptyText, isEdit, isLoading } =
    props;

  // 切換 todo 的 tabs
  const pillTabs = [
    {
      id: "allTab",
      title: "全部",
      num: allTodos.length,
    },
    {
      id: "finishTab",
      title: "已完成",
      num: allTodos.filter((item) => item.status).length,
    },
    {
      id: "unFinishTab",
      title: "待完成",
      num: allTodos.filter((item) => !item.status).length,
    },
  ];

  // 切換 tab
  const handleChangeTab = async (tab) => {
    setTab(tab);
    await getList(tab);
    tab === "已完成"
      ? setEmptyText("加油～目前都還沒完成呢！")
      : setEmptyText("太棒了～全部都完成了！");
  };

  return (
    <ul
      className="nav nav-pills nav-justified border border-bottom-0 rounded-top-3 overflow-hidden"
      id="pills-tab"
      role="tablist"
    >
      {pillTabs.map((item) => (
        <li
          className="nav-item"
          role="presentation"
          key={item.id}
          style={{
            cursor: isEdit && "not-allowed",
          }}
        >
          <button
            type="button"
            className={`nav-link rounded-0 text-nowrap d-flex justify-content-center align-items-center ${
              item.title === tab ? "active" : ""
            }`}
            disabled={isLoading || isEdit}
            onClick={() => {
              handleChangeTab(item.title);
            }}
          >
            {item.title}
            <span className="badge text-bg-light ms-2">{item.num}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
