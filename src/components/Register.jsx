import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Footer from "./Footer";
import Loading from "./Loading";
import { register } from "@/api/users";
import { sweetAlert } from "@/composables/sweetAlert";

export default function Register() {
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // 表單送出的資料
  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });

  // 表單錯誤驗證
  const [errorMessage, setErrorMessage] = useState({
    email: [],
    password: [],
    nickname: [],
  });

  // 綁定 input
  const handleChange = (e) => {
    setRegisterForm({
      ...registerForm,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // 註冊
  const navigate = useNavigate();
  const handleRegister = async () => {
    try {
      setIsLoading(true);
      await register(registerForm);
      sweetAlert("success", "註冊成功");
      navigate("/");
    } catch (error) {
      sweetAlert("error", "註冊失敗");

      // 拆分驗證錯誤訊息
      const { message } = error.response.data;
      message === "用戶已存在"
        ? setErrorMessage({
            email: ["用戶已存在"],
            password: [],
            nickname: [],
          })
        : setErrorMessage({
            email: message.filter((item) => !item.indexOf("email")),
            password: message.filter((item) => !item.indexOf("password")),
            nickname: message.filter((item) => !item.indexOf("nickname")),
          });
    } finally {
      setIsLoading(false);
    }
  };

  // 按下 Enter 鍵註冊
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRegister();
    }
  };

  return (
    <div className="container">
      <div className="row vh-100 justify-content-center align-items-center">
        <div className="col-lg-6 col-xl-5">
          <h1 className="fs-2 text-center mb-5">註冊帳號</h1>
          <div className="card p-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nickname" className="form-label">
                    <small className="text-warning">*</small> 您的暱稱
                    <small className="text-secondary">（必填）</small>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${
                      errorMessage.nickname.length ? "border-danger" : ""
                    }`}
                    id="nickname"
                    name="nickname"
                    placeholder="您的暱稱"
                    autoFocus
                    aria-describedby="nicknameHelp"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div id="nicknameHelp" className="form-text text-danger">
                    {errorMessage.nickname
                      .join("，")
                      .replaceAll("nickname", "暱稱")}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="registerEmail" className="form-label">
                    <small className="text-warning">*</small> 信箱
                    <small className="text-secondary">（必填）</small>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errorMessage.email.length ? "border-danger" : ""
                    }`}
                    id="registerEmail"
                    name="email"
                    placeholder="您的信箱"
                    aria-describedby="emailHelp"
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <div id="emailHelp" className="form-text text-danger">
                    {errorMessage.email.join("，").replaceAll("email", "信箱")}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">
                    <small className="text-warning">*</small> 密碼
                    <small className="text-secondary">（必填）</small>
                  </label>
                  <input
                    type="password"
                    className={`form-control ${
                      errorMessage.password.length ? "border-danger" : ""
                    }`}
                    id="registerPassword"
                    name="password"
                    placeholder="您的密碼"
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
                  onClick={handleRegister}
                >
                  <Loading isLoading={isLoading} />
                  註冊
                </button>
              </form>
              <small className="d-block text-center mt-3">
                已有帳號？
                <Link to="/" style={{ pointerEvents: isLoading && "none" }}>
                  點此登入
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
