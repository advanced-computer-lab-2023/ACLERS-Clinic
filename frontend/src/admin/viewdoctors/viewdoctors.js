import { useEffect, useState } from "react";
import DoctorDetails from "../../components/doctordetails";
import jwt from "jsonwebtoken-promisified";
import { Link, useNavigate } from "react-router-dom";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedtoken = jwt.decode(token);
  console.log("decoded Token:", decodedtoken);
  const id = decodedtoken.id;
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await fetch("/admin/view-doctors");
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      }
    };
    fetchDoctors();
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
    <div className="doctorviewer">
      <button onClick={() => navigate(-1)}>Go Back</button>
      <h1>Doctors</h1>
      {doctors &&
        doctors.map((doctor) => (
          <DoctorDetails key={doctor._id} doctor={doctor} />
        ))}
    </div>
  );
};

export default ViewDoctors;
