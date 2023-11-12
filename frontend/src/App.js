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
import PatientInfo from "./doctor/patientInfo";
import PatientDashBoard from "./dashboard/PatientDashboard";
import PatientPerscriptions from "./patient/viewPerscriptions";
import PatientFamilyMembers from "./patient/familymembers";
import PatientMedicalHistory from "./patient/medicalhistory";
import DoctorSignUpPage from "./signup/SignUpdoctor";
import ViewApplicants from "./admin/viewapplicants/viewapplicants";
import PatientDoctors from "./patient/viewdoctors";
import PatientAppointments from "./patient/appointments";
import Viewhealthpackages from "./patient/HealthPackageList";
import Handlesubscription from "./patient/handlesubscribe";
import ForgotPassword from "./login/forgotpassword";
import FollowUp from "./doctor/FollowUp"
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signuppage" element={<SignUpPage />} />
        <Route path="/signuppage/patient" element={<PatinetSignUpPage />} />
        <Route path="/signuppage/doctor" element={<DoctorSignUpPage />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/adminadd" element={<AdminAdd />} />
        <Route path="/admin/adminremove" element={<AdminRemove />} />
        <Route path="/admin/viewadmins" element={<ViewAdmins />} />
        <Route path="/admin/viewdoctors" element={<ViewDoctors />} />
        <Route path="/admin/viewpatients" element={<ViewPatients />} />
        <Route
          path="/admin/add-health-package"
          element={<AddHealthPackage />}
        />
        <Route
          path="/admin/view-HealthPackages"
          element={<HealthPackageList />}
        />
        <Route
          path="/admin/edit-HealthPackage/"
          element={<EditHealthPackage />}
        />
        <Route path="/admin/Dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/Dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/view-my-info" element={<DoctorInfo />} />
        <Route
          path="/doctor/view-my-appointments"
          element={<DoctorAppointments />}
        />
        <Route path="/doctor/view-my-patients" element={<DoctorPatients />} />

        <Route path="/patient/dashboard" element={<PatientDashBoard />} />
        <Route
          path="/patient/view-perscriptions"
          element={<PatientPerscriptions />}
        />
        <Route
          path="/patient/familymembers"
          element={<PatientFamilyMembers />}
        />
        <Route path="/admin/view-applicants" element={<ViewApplicants />} />
        <Route path="/patient/viewdoctors/" element={<PatientDoctors />} />
        <Route
          path="/patient/appointments/"
          element={<PatientAppointments />}
        />
        <Route
          path="/patient/medicalhistory/"
          element={<PatientMedicalHistory />}
        />
        <Route
          path="/doctor/view-patient/:patientId"
          element={<PatientInfo />}
        />
        <Route
          path="/doctor/view-patient/:patientId/view-freeSlots"
          element={<FollowUp />}
        />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route
          path="/patient/appointments/:id"
          element={<PatientAppointments />}
        />

        <Route
          path="/patient/Viewhealthpackages/:id"
          element={<Viewhealthpackages />}
        />
        <Route
          path="/patient/Handlesubscription/:id1/:id2"
          element={<Handlesubscription />}
        />
      </Routes>
    </>
  );
};

export default App;
