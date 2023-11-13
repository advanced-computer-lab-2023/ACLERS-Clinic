import { useEffect, useState } from "react";
import PatientDetails from "../../components/patientdetails";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";

const ViewPatients = () => {
  const [patients, setPatients] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await fetch("/admin/view-patients");
      const json = await response.json();

      if (response.ok) {
        setPatients(json);
      }
    };
    fetchPatients();
  }, []);
  if (decodedtoken.role !== "admin") {
    return (
      <div>
        <div>ACCESS DENIED, You are not authenticated, please log in</div>
        <Link to="/login">Login</Link>
      </div>
    );
  }

  return (
    <div className="patientviewer">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>Patients</h1>
      {patients &&
        patients.map((patient) => (
          <PatientDetails key={patient._id} patient={patient} />
        ))}
    </div>
  );
};

export default ViewPatients;
