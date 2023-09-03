import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loading from "./Loading";
import { logout } from "@/api/users";
import Swal from "sweetalert2";
import { sweetAlert, confirmAlert } from "@/composables/sweetAlert";

export default function Logout() {
  const navigate = useNavigate();

  // loading
  const [isLoading, setIsLoading] = useState(false);

  // 登出
  const handleLogout = async () => {
    const result = await Swal.fire(confirmAlert("確定要登出嗎？"));
    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        const { data } = await logout();
        sweetAlert("success", data.message);
        const timer = setTimeout(() => {
          navigate("/");
          clearTimeout(timer);
        }, 1000);

        // 清除 localStorage 裡的 nickname
        localStorage.removeItem("nickname");
        // 清除 cookie 裡的 todoToken，只要把時間設為過去就可以刪除 cookie
        document.cookie = "todoToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      } catch (error) {
        const { message } = error.response.data;
        sweetAlert("success", "登出失敗", message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="position-absolute end-0 mt-2 mt-lg-3">
      <button
        type="button"
        className="btn btn-outline-primary btn-sm d-flex justify-content-center align-items-center"
        disabled={isLoading}
        onClick={handleLogout}
      >
        <Loading isLoading={isLoading} />
        <i
          className={`bi bi-box-arrow-right me-1 ${
            isLoading ? "d-none" : "d-flex-inline"
          }`}
        />
        登出
      </button>
    </div>
  );
}
