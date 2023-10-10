// App.js
import { Routes, Route } from "react-router-dom";
import Login from "./login/SignInSide";
import SignUpPage from "./signupdirectory/SignUpPage";
import PatinetSignUpPage from "./signup/SignUp";
import AdminHome from "./admin/adminhome/adminhome";
import AdminAdd from "./admin/adminadd/adminadd";
import AdminRemove from "./admin/adminremove/adminremove";
import ViewAdmins from "./admin/viewadmins/viewadmins";
import ViewDoctors from "./admin/viewdoctors/viewdoctors";
import ViewPatients from "./admin/viewpatients/viewpatients";
import AddHealthPackage from "./admin/addhealthpackage/addHealthPackage";
import HealthPackageList from "./admin/viewhealthpackages/viewHealthPackages";
import EditHealthPackage from "./admin/viewhealthpackages/editHealthPackage";
import AdminDashboard from "./dashboard/AdminDashboard";
import DoctorDashboard from "./dashboard/DoctorDashboard";
import DoctorInfo from "./doctor/DoctorInfo";
import DoctorAppointments from "./doctor/DoctorAppointments";
import DoctorPatients from "./doctor/DoctorPatients";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signuppage" element={<SignUpPage />} />
        <Route path="/signuppage/patient" element={<PatinetSignUpPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/adminadd" element={<AdminAdd />} />
        <Route path="/admin/adminremove" element={<AdminRemove />} />
        <Route path="/admin/viewadmins" element={<ViewAdmins />} />
        <Route path="/admin/viewdoctors" element={<ViewDoctors />} />
        <Route path="/admin/viewpatients" element={<ViewPatients />} />
      </Routes>
    </>
  );
};

export default App;
