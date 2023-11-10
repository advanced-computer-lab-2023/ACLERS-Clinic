// App.js
import { Routes, Route } from "react-router-dom";
import SignUp from "./signup/SignUp";
import Login from "./login/SignInSide";
import SignUpPage from "./signupdirectory/SignUpPage";
import AdminHome from "./admin/adminhome/adminhome";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signuppage" element={<SignUpPage />} />
        <Route path="/admin" element={<AdminHome />} />
      </Routes>
    </>
  );
};

export default App;
