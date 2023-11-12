import { useEffect, useState } from "react";
import DoctorDetails from "../../components/doctordetails";
import { useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken-promisified";
const ViewDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate()
  const token = localStorage.getItem("token");
  const decodedToken = jwt.decode(token);
  console.log("decoded Token:", decodedToken);
  useEffect(() => {
    const fetchDoctors = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await fetch("http://localhost:8000/admin/view-doctors",requestOptions);
      const json = await response.json();

      if (response.ok) {
        setDoctors(json);
      }
    };
    fetchDoctors();
  }, []);

  if (!token ) {
    // Handle the case where id is not available
    return <div>ACCESS DENIED, You are not authenticated, please log in</div>;
  }
  if(decodedToken.role !=="admin"){
    return <div>ACCESS DENIED, You are not authorized</div>;
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
