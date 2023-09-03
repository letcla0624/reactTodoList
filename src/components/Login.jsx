import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import Loading from "./Loading";
import Cookies from "js-cookie";
import { login, checkout } from "@/api/users";
import { sweetAlert } from "@/composables/sweetAlert";

export default function Login() {
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // 表單送出的資料
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // 表單錯誤驗證
  const [errorMessage, setErrorMessage] = useState({
    email: [],
    password: [],
  });

  // 綁定 input
  const handleChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 登入
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { data } = await login(loginForm);
      const { token, nickname } = data;
      // 儲存 nickname 到 localStorage
      localStorage.setItem("nickname", nickname);
      // 使用 js-cookie 設定儲存到 cookie，到期日為 1 天
      Cookies.set("todoToken", token, { expires: 1 });
      // 驗證 token
      await checkout();
      sweetAlert("success", "登入成功");
      navigate("/todolist");
    } catch (error) {
      sweetAlert("error", "登入失敗");

      // 拆分驗證錯誤訊息
      const { message } = error.response.data;
      message === "帳號密碼驗證錯誤"
        ? setErrorMessage({
            email: ["確定帳號是對的？"],
            password: ["確定密碼是對的？"],
          })
        : setErrorMessage({
            email: message.filter((item) => !item.indexOf("email")),
            password: message.filter((item) => !item.indexOf("password")),
          });
    } finally {
      setIsLoading(false);
    }
  };

  // 按下 Enter 鍵登入
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-lg-6 col-xl-5">
          <h1 className="fs-2 text-center mb-5">最實用的線上代辦事項服務</h1>
          <div className="card p-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <small className="text-warning">*</small> 信箱
                    <small className="text-secondary">（必填）</small>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errorMessage.email.length ? "border-danger" : ""
                    }`}
                    id="email"
                    name="email"
                    placeholder="請輸入信箱"
                    autoFocus
                    required
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div id="emailHelp" className="form-text text-danger">
                    {errorMessage.email.join("，").replaceAll("email", "信箱")}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <small className="text-warning">*</small> 密碼
                    <small className="text-secondary">（必填）</small>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errorMessage.password.length ? "border-danger" : ""
                    }`}
                    id="password"
                    name="password"
                    placeholder="請輸入密碼"
                    required
                    aria-describedby="passwordHelp"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div id="passwordHelp" className="form-text text-danger">
                    {errorMessage.password
                      .join("，")
                      .replaceAll("password", "密碼")}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 mt-4 d-flex justify-content-center align-items-center"
                  disabled={isLoading}
                  onClick={() => {
                    handleLogin();
                  }}
                >
                  <Loading isLoading={isLoading} />
                  登入
                </button>
              </form>
              <small className="d-block text-center mt-3">
                沒有帳號？
                <Link
                  to="/register"
                  style={{ pointerEvents: isLoading && "none" }}
                >
                  點此註冊
                </Link>
              </small>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
