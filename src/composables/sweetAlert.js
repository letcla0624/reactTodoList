import Swal from "sweetalert2";

// sweetAlert 2
export const sweetAlert = (icon, title, text = "") => {
  Swal.fire({
    icon,
    title,
    text,
    iconColor: icon === "success" ? "#989df7" : "#f27474",
    color: "#fff",
    background: "#212529",
    showConfirmButton: false,
    timer: 1000,
  });
};

// sweetAlert 2 confirm
export const confirmAlert = (title) => {
  return {
    title,
    icon: "warning",
    color: "#fff",
    background: "#212529",
    showCancelButton: true,
    confirmButtonText: "確定",
    cancelButtonText: "取消",
    reverseButtons: true,
  };
};
