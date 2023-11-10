import { useEffect, useState } from "react";
import DoctorDetails from "../../components/doctordetails";
import { useNavigate } from "react-router-dom";

const ViewDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const navigate = useNavigate()
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
