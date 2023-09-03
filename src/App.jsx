import { Routes, Route } from "react-router-dom";
import Login from "@/components/Login";
import Register from "@/components/Register";
import TodoList from "@/components/TodoList";

function App() {
  return (
    <Routes>
      <Route element={<Login />} path={"/"}></Route>
      <Route element={<Register />} path="/register"></Route>
      <Route element={<TodoList />} path="/todolist"></Route>
    </Routes>
  );
}

export default App;
